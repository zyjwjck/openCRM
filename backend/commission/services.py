"""Commission calculation engine.

Two-stage accrual:
1. PROVISIONAL - created when an invoice leaves Draft (estimation only).
2. EARNED      - created when a payment is recorded (cash received).

All amounts are computed from frozen line-item values plus the policy values
captured in ``calc_snapshot``. Recalculation never updates existing rows:
it appends a reversal plus a new ledger version.
"""

import hashlib
from decimal import Decimal, ROUND_HALF_UP

from django.db import transaction
from django.db.models import Q, Sum
from django.utils import timezone
from invoices.models import Invoice

from commission.models import CommissionEntry, CommissionPolicy

ZERO = Decimal("0")
HUNDRED = Decimal("100")


def _q(value):
    return Decimal(value or ZERO).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def _pct(value):
    return Decimal(value or ZERO) / HUNDRED


def active_policies(org, as_of=None):
    """Active policies, optionally limited to those effective on ``as_of``."""
    candidates = CommissionPolicy.objects.filter(org=org, is_active=True)
    if as_of:
        candidates = candidates.filter(
            Q(effective_from__isnull=True) | Q(effective_from__lte=as_of)
        ).filter(Q(effective_to__isnull=True) | Q(effective_to__gte=as_of))
    return candidates.select_related("product")


def policy_matches(policy, product, category):
    """Whether a policy's scope covers the given product/category."""
    if policy.scope == "PRODUCT":
        return bool(product and policy.product_id == product.id)
    if policy.scope == "CATEGORY":
        return bool(category and policy.category == category)
    return policy.scope == "ALL"


def resolve_policy(org, product, category, invoice_date):
    """Pick the highest-priority active policy matching the product.

    Specific product > category > all-products, then priority desc.
    """
    scoped = []
    for policy in active_policies(org, invoice_date):
        if policy_matches(policy, product, category):
            specificity = (
                2 if policy.scope == "PRODUCT"
                else 1 if policy.scope == "CATEGORY"
                else 0
            )
            scoped.append((specificity, policy.priority, policy))
    if not scoped:
        return None
    scoped.sort(key=lambda item: (item[0], item[1]), reverse=True)
    return scoped[0][2]


def customer_type_for(invoice, policy, as_of=None):
    """NEW / EXISTING based on prior paid invoices for the same account."""
    if not invoice.account_id:
        return "NEW"
    prior = Invoice.objects.filter(
        org=invoice.org_id,
        account_id=invoice.account_id,
        status="Paid",
    ).exclude(id=invoice.id)
    if as_of:
        prior = prior.filter(paid_at__date__lte=as_of)
    return "EXISTING" if prior.exists() else "NEW"


def compute_base(item, policy, ratio=Decimal("1")):
    """Return (base_amount, gross_profit, values) for a line item."""
    net = _q((item.subtotal - item.discount_amount) * ratio)
    gross = _q(item.total * ratio)
    cost = _q(item.unit_cost_snapshot * item.quantity * ratio)
    gross_profit = _q(net - cost)
    margin_rate = _q((gross_profit / net) * HUNDRED) if net > ZERO else ZERO

    if policy.base_type == "GROSS":
        base = gross
    elif policy.base_type == "GROSS_PROFIT":
        base = gross_profit
    elif policy.base_type == "MARGIN_RATE":
        base = net
    else:  # NET and CASH both use the tax-exclusive net as the monetary base
        base = net

    values = {
        "net_amount": str(net),
        "gross_amount": str(gross),
        "cost_amount": str(cost),
        "gross_profit": str(gross_profit),
        "margin_rate": str(margin_rate),
        "ratio": str(ratio),
        "base_amount": str(base),
    }
    return max(base, ZERO), gross_profit, values


def resolve_credits(invoice, policy):
    """Map credit roles to profiles.

    ACCOUNT_OWNER -> account.assigned_to
    LEAD_SOURCE   -> opportunity.lead.assigned_to (fallback: opportunity.assigned_to)
    """
    result = {"ACCOUNT_OWNER": [], "LEAD_SOURCE": []}

    if invoice.account_id:
        result["ACCOUNT_OWNER"] = list(invoice.account.assigned_to.all())

    opportunity = invoice.opportunity
    if opportunity:
        lead = getattr(opportunity, "lead", None)
        if lead is not None and hasattr(lead, "assigned_to") and lead.assigned_to.exists():
            result["LEAD_SOURCE"] = list(lead.assigned_to.all())
        else:
            result["LEAD_SOURCE"] = list(opportunity.assigned_to.all())

    if not result["ACCOUNT_OWNER"] and not result["LEAD_SOURCE"]:
        result["ACCOUNT_OWNER"] = list(invoice.assigned_to.all())

    return result


def _idem_key(invoice_item, payment, role, policy, stage, profile, version=1):
    parts = [
        str(invoice_item.id) if invoice_item else "invoice",
        str(payment.id) if payment else "none",
        role or "none",
        str(policy.id) if policy else "none",
        stage,
        str(profile.id) if profile else "none",
        str(version),
    ]
    return hashlib.sha256("|".join(parts).encode()).hexdigest()


def _make_reversal(entry, reason, suffix):
    return CommissionEntry(
        org=entry.org,
        policy=entry.policy,
        policy_name_snapshot=entry.policy_name_snapshot,
        policy_version=entry.policy_version,
        invoice=entry.invoice,
        invoice_item=entry.invoice_item,
        payment=entry.payment,
        profile=entry.profile,
        role=entry.role,
        stage=entry.stage,
        status="REVERSED",
        base_amount=entry.base_amount,
        rate=entry.rate,
        gross_amount=-entry.gross_amount,
        share_percent=entry.share_percent,
        amount=-entry.amount,
        currency=entry.currency,
        customer_type=entry.customer_type,
        calc_snapshot={**entry.calc_snapshot, "reversal_of": str(entry.id)},
        idempotency_key=f"{suffix}:{entry.idempotency_key}",
        reason=reason,
        supersedes=entry,
    )


def _insert_entries(
    *,
    invoice,
    item,
    payment,
    policy,
    stage,
    ratio,
    version,
    customer_type,
    snapshot_base,
):
    """Insert one or more commission rows for a line item. Returns count."""
    base, gross_profit, values = compute_base(item, policy, ratio)
    if base <= ZERO:
        return 0
    if policy.base_type in ("GROSS_PROFIT", "MARGIN_RATE") and gross_profit < ZERO:
        if policy.exclude_negative_margin:
            return 0

    if policy.base_type == "MARGIN_RATE":
        rate = _q(policy.rate_for_base(_q(values["margin_rate"])))
    else:
        rate = _q(policy.rate_for_base(base))

    gross_commission = _q(base * _pct(rate))
    if policy.cap_amount and policy.cap_amount > ZERO:
        gross_commission = min(gross_commission, _q(policy.cap_amount))
    if policy.floor_amount and policy.floor_amount > ZERO:
        gross_commission = max(gross_commission, _q(policy.floor_amount))

    credits = resolve_credits(invoice, policy)
    rules = list(policy.credit_rules.all())
    if not rules:
        # Default: split 100% between all determinable credit roles equally.
        roles = [role for role, profiles in credits.items() if profiles]
        share = _q(HUNDRED / Decimal(len(roles))) if roles else ZERO
        rules = [type("R", (), {"role": role, "share_percent": share})() for role in roles]

    snapshot = {
        **values,
        **snapshot_base,
        "policy_id": str(policy.id),
        "policy_name": policy.name,
        "base_type": policy.base_type,
        "customer_scope": policy.customer_scope,
        "customer_type": customer_type,
        "rate": str(rate),
        "use_tiers": policy.use_tiers,
        "version": version,
        "calculated_at": timezone.now().isoformat(),
    }

    created = 0
    for rule in rules:
        profiles = credits.get(rule.role, [])
        if not profiles:
            continue
        share = _q(rule.share_percent)
        if share <= ZERO:
            continue
        per_profile_share = _q(share / Decimal(len(profiles)))
        amount = _q(gross_commission * _pct(per_profile_share))
        for profile in profiles:
            key = _idem_key(item, payment, rule.role, policy, stage, profile, version)
            if CommissionEntry.objects.filter(idempotency_key=key).exists():
                continue
            CommissionEntry.objects.create(
                org=invoice.org,
                policy=policy,
                policy_name_snapshot=policy.name,
                policy_version=version,
                invoice=invoice,
                invoice_item=item,
                payment=payment,
                profile=profile,
                role=rule.role,
                stage=stage,
                status="ACTIVE",
                base_amount=base,
                rate=rate,
                gross_amount=gross_commission,
                share_percent=per_profile_share,
                amount=amount,
                currency=invoice.currency or "USD",
                customer_type=customer_type,
                calc_snapshot={**snapshot, "share_percent": str(per_profile_share)},
                idempotency_key=key,
            )
            created += 1
    return created


@transaction.atomic
def calculate_invoice(invoice, stage="PROVISIONAL", payment=None, ratio=None, version=1):
    """Calculate commission for all line items. Returns inserted row count."""
    ratio = Decimal("1") if ratio is None else ratio
    as_of = payment.payment_date if payment else None
    created = 0

    for item in invoice.line_items.select_related("product").all():
        category = item.product.category if item.product and item.product.category else None
        policy = resolve_policy(invoice.org, item.product, category, invoice.issue_date)
        if not policy:
            continue
        customer_type = customer_type_for(invoice, policy, as_of=as_of)
        if policy.customer_scope == "NEW" and customer_type != "NEW":
            continue
        if policy.customer_scope == "EXISTING" and customer_type != "EXISTING":
            continue
        created += _insert_entries(
            invoice=invoice,
            item=item,
            payment=payment,
            policy=policy,
            stage=stage,
            ratio=ratio,
            version=version,
            customer_type=customer_type,
            snapshot_base={
                "invoice_date": str(invoice.issue_date),
                "payment_date": str(as_of) if as_of else None,
            },
        )
    return created


@transaction.atomic
def on_invoice_saved(invoice):
    """Stage 1: provisional estimate once the invoice leaves Draft."""
    if not invoice.pk or invoice.status == "Draft":
        return 0
    return calculate_invoice(invoice, stage="PROVISIONAL")


@transaction.atomic
def on_payment_saved(payment):
    """Stage 2: earned commission for the cash just received.

    Only this payment's ratio is accrued, so partial payments accumulate
    correctly and a payment is never counted twice (idempotency key includes
    the payment id).
    """
    invoice = payment.invoice
    if not invoice.total_amount or payment.amount <= ZERO:
        return 0
    ratio = min(_q(payment.amount) / _q(invoice.total_amount), Decimal("1"))
    return calculate_invoice(
        invoice, stage="EARNED", payment=payment, ratio=ratio, version=1
    )


@transaction.atomic
def reverse_payment(payment, reason="Payment deleted"):
    """Append reversal rows for all active entries linked to a payment."""
    created = 0
    for entry in CommissionEntry.objects.filter(payment=payment, status="ACTIVE"):
        if entry.reversed_by_id:
            continue
        reversal = _make_reversal(entry, reason, "reversal")
        reversal.save()
        entry.reversed_by = reversal
        entry.save(update_fields=["reversed_by"])
        created += 1
    return created


@transaction.atomic
def recalculate_invoice(invoice, confirm=False):
    """Rebuild provisional entries as a new version; needs explicit confirm."""
    if not confirm:
        raise ValueError("Recalculation requires explicit confirmation")
    old = list(
        CommissionEntry.objects.filter(
            org=invoice.org_id, invoice=invoice, stage="PROVISIONAL", status="ACTIVE"
        )
    )
    max_version = 1
    for entry in old:
        max_version = max(max_version, entry.policy_version)
        reversal = _make_reversal(entry, "Recalculation", f"recalc-{timezone.now().timestamp()}")
        reversal.policy_version = entry.policy_version + 1
        reversal.save()
        entry.reversed_by = reversal
        entry.save(update_fields=["reversed_by"])
    return calculate_invoice(invoice, stage="PROVISIONAL", version=max_version + 1)
