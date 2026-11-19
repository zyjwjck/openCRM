"""Commission models.

Design guarantees:
- CommissionEntry is an append-only ledger. Recalculations insert a new row
  with ``supersedes`` pointing at the previous one; reversals insert a row
  with a negative amount. Nothing is ever mutated or deleted.
- Each entry freezes every input used (price, tax, cost, customer type,
  policy values) into ``calc_snapshot`` so historical figures never drift.
- Org isolation follows the project convention: every model carries an
  explicit org FK, views filter by ``request.profile.org``.
"""

from decimal import Decimal

from common.base import BaseModel
from common.models import Org, Profile
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _

from commission.constants import (
    BASE_TYPES,
    CREDIT_ROLES,
    CUSTOMER_SCOPES,
    ENTRY_STATUSES,
    ENTRY_STAGES,
    POLICY_SCOPES,
)


class CommissionPolicy(BaseModel):
    """A single commission policy attached to a product, category or all."""

    name = models.CharField(_("Policy Name"), max_length=255)
    code = models.CharField(_("Code"), max_length=50, blank=True, null=True)
    org = models.ForeignKey(Org, on_delete=models.CASCADE, related_name="commission_policies")

    scope = models.CharField(_("Scope"), max_length=20, choices=POLICY_SCOPES, default="ALL")
    product = models.ForeignKey(
        "invoices.Product",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="commission_policies",
    )
    category = models.CharField(_("Category"), max_length=100, blank=True, null=True)

    base_type = models.CharField(_("Base Type"), max_length=20, choices=BASE_TYPES, default="NET")
    customer_scope = models.CharField(
        _("Customer Scope"), max_length=20, choices=CUSTOMER_SCOPES, default="ALL"
    )

    # Flat rate as a percentage, e.g. 5.00 = 5%
    rate = models.DecimalField(_("Rate (%)"), max_digits=6, decimal_places=2, default=0)
    # Single-transaction tiers are optional; when present they override `rate`.
    use_tiers = models.BooleanField(_("Use Tiers"), default=False)

    min_base_amount = models.DecimalField(
        _("Minimum Base Amount"), max_digits=12, decimal_places=2, default=0
    )
    cap_amount = models.DecimalField(
        _("Cap Amount"), max_digits=12, decimal_places=2, default=0,
        help_text="0 means no cap",
    )
    floor_amount = models.DecimalField(
        _("Floor Amount"), max_digits=12, decimal_places=2, default=0,
        help_text="0 means no floor",
    )
    exclude_negative_margin = models.BooleanField(
        _("Exclude Negative Margin"), default=True,
        help_text="Skip commission when gross profit is negative",
    )

    priority = models.PositiveIntegerField(_("Priority"), default=0)
    is_active = models.BooleanField(_("Is Active"), default=True)
    effective_from = models.DateField(_("Effective From"), null=True, blank=True)
    effective_to = models.DateField(_("Effective To"), null=True, blank=True)
    notes = models.TextField(_("Notes"), blank=True)

    class Meta:
        verbose_name = "Commission Policy"
        verbose_name_plural = "Commission Policies"
        db_table = "commission_policy"
        ordering = ("-priority", "name")
        indexes = [
            models.Index(fields=["org", "is_active"]),
            models.Index(fields=["org", "scope"]),
        ]

    def __str__(self):
        return self.name

    def clean(self):
        if self.scope == "PRODUCT" and not self.product_id:
            raise ValidationError({"product": "A product is required for PRODUCT scope."})
        if self.scope == "CATEGORY" and not self.category:
            raise ValidationError({"category": "A category is required for CATEGORY scope."})
        if self.rate < 0 or self.rate > 100:
            raise ValidationError({"rate": "Rate must be between 0 and 100."})

    def save(self, *args, **kwargs):
        self.full_clean(exclude=["created_by", "updated_by"])
        super().save(*args, **kwargs)

    def rate_for_base(self, base_amount):
        """Resolve the percentage for a single transaction.

        Tiers are evaluated on the single-transaction base amount (not on
        period totals), as requested. The matched tier's rate applies to the
        whole base amount; tiers are not progressive.
        """
        if not self.use_tiers:
            return self.rate
        tier = (
            self.tiers.filter(
                min_amount__lte=base_amount,
            )
            .filter(models.Q(max_amount__isnull=True) | models.Q(max_amount__gte=base_amount))
            .order_by("-min_amount")
            .first()
        )
        return tier.rate if tier else self.rate


class CommissionTier(BaseModel):
    """Single-transaction tier for a policy."""

    policy = models.ForeignKey(
        CommissionPolicy, on_delete=models.CASCADE, related_name="tiers"
    )
    min_amount = models.DecimalField(_("Min Amount"), max_digits=12, decimal_places=2, default=0)
    max_amount = models.DecimalField(
        _("Max Amount"), max_digits=12, decimal_places=2, null=True, blank=True
    )
    rate = models.DecimalField(_("Rate (%)"), max_digits=6, decimal_places=2, default=0)

    class Meta:
        verbose_name = "Commission Tier"
        verbose_name_plural = "Commission Tiers"
        db_table = "commission_tier"
        ordering = ("min_amount",)

    def __str__(self):
        return f"{self.policy.name}: {self.min_amount}-{self.max_amount} @ {self.rate}%"

    def clean(self):
        if self.rate < 0 or self.rate > 100:
            raise ValidationError({"rate": "Rate must be between 0 and 100."})
        if self.max_amount is not None and self.max_amount < self.min_amount:
            raise ValidationError({"max_amount": "Max must not be less than min."})


class CommissionCreditRule(BaseModel):
    """How a policy's commission is split between credit roles.

    Percentages across roles of one policy should add up to 100.
    """

    policy = models.ForeignKey(
        CommissionPolicy, on_delete=models.CASCADE, related_name="credit_rules"
    )
    role = models.CharField(_("Role"), max_length=30, choices=CREDIT_ROLES)
    share_percent = models.DecimalField(
        _("Share (%)"), max_digits=6, decimal_places=2, default=100
    )

    class Meta:
        verbose_name = "Commission Credit Rule"
        verbose_name_plural = "Commission Credit Rules"
        db_table = "commission_credit_rule"
        ordering = ("role",)
        constraints = [
            models.UniqueConstraint(fields=["policy", "role"], name="uniq_policy_role"),
        ]

    def __str__(self):
        return f"{self.policy.name}: {self.role} {self.share_percent}%"

    def clean(self):
        if self.share_percent < 0 or self.share_percent > 100:
            raise ValidationError({"share_percent": "Share must be between 0 and 100."})


class CommissionEntry(BaseModel):
    """Immutable commission ledger row."""

    org = models.ForeignKey(Org, on_delete=models.CASCADE, related_name="commission_entries")
    policy = models.ForeignKey(
        CommissionPolicy, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="entries",
    )
    policy_name_snapshot = models.CharField(_("Policy Name Snapshot"), max_length=255, default="")
    policy_version = models.PositiveIntegerField(_("Policy Version"), default=1)

    invoice = models.ForeignKey(
        "invoices.Invoice", on_delete=models.PROTECT, related_name="commission_entries"
    )
    invoice_item = models.ForeignKey(
        "invoices.InvoiceLineItem", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="commission_entries",
    )
    payment = models.ForeignKey(
        "invoices.Payment", on_delete=models.SET_NULL, null=True, blank=True,
        related_name="commission_entries",
    )
    profile = models.ForeignKey(
        Profile, on_delete=models.SET_NULL, null=True, blank=True,
        related_name="commission_entries",
    )
    role = models.CharField(_("Role"), max_length=30, choices=CREDIT_ROLES, blank=True)

    stage = models.CharField(_("Stage"), max_length=20, choices=ENTRY_STAGES)
    status = models.CharField(_("Status"), max_length=20, choices=ENTRY_STATUSES, default="ACTIVE")

    base_amount = models.DecimalField(_("Base Amount"), max_digits=12, decimal_places=2, default=0)
    rate = models.DecimalField(_("Rate (%)"), max_digits=6, decimal_places=2, default=0)
    gross_amount = models.DecimalField(_("Gross Commission"), max_digits=12, decimal_places=2, default=0)
    share_percent = models.DecimalField(_("Share (%)"), max_digits=6, decimal_places=2, default=100)
    amount = models.DecimalField(_("Amount"), max_digits=12, decimal_places=2, default=0)
    currency = models.CharField(_("Currency"), max_length=3, default="USD")

    customer_type = models.CharField(_("Customer Type"), max_length=20, blank=True)
    calc_snapshot = models.JSONField(_("Calculation Snapshot"), default=dict, blank=True)

    # Idempotency: one row per (invoice item, payment, role, policy version, stage).
    idempotency_key = models.CharField(_("Idempotency Key"), max_length=255, unique=True)

    supersedes = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True, related_name="superseded_by"
    )
    reversed_by = models.ForeignKey(
        "self", on_delete=models.SET_NULL, null=True, blank=True, related_name="reverses"
    )
    reason = models.CharField(_("Reason"), max_length=255, blank=True)

    class Meta:
        verbose_name = "Commission Entry"
        verbose_name_plural = "Commission Entries"
        db_table = "commission_entry"
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=["org", "-created_at"]),
            models.Index(fields=["org", "profile"]),
            models.Index(fields=["org", "stage"]),
            models.Index(fields=["invoice"]),
            models.Index(fields=["payment"]),
        ]

    def __str__(self):
        return f"{self.invoice_id} - {self.stage} - {self.amount}"

    @property
    def is_active(self):
        return self.status == "ACTIVE" and not self.reversed_by_id
