"""Commission engine tests.

Run with: pytest commission/tests.py -v
"""

from decimal import Decimal
from unittest.mock import patch

from accounts.models import Account
from common.models import Org, Profile, User
from django.test import RequestFactory, TestCase
from django.urls import resolve
from invoices.models import Invoice, InvoiceLineItem, Payment, Product
from rest_framework.test import APIClient

from commission.api_helpers import visible_entries
from commission.constants import CREDIT_ROLES
from commission.models import CommissionCreditRule, CommissionEntry, CommissionPolicy, CommissionTier
from commission.services import (
    compute_base,
    customer_type_for,
    on_invoice_saved,
    on_payment_saved,
    resolve_policy,
    reverse_payment,
)


class CommissionTestBase(TestCase):
    def setUp(self):
        self.org = Org.objects.create(name="Commission Org")
        self.owner = User.objects.create_user(email="owner@test.com", password="x")
        self.source = User.objects.create_user(email="source@test.com", password="x")
        self.owner_profile = Profile.objects.create(
            user=self.owner, org=self.org, role="USER", is_active=True
        )
        self.source_profile = Profile.objects.create(
            user=self.source, org=self.org, role="USER", is_active=True
        )
        self.account = Account.objects.create(name="Acme", org=self.org)
        self.account.assigned_to.add(self.owner_profile)
        self.product = Product.objects.create(
            name="Widget", price=Decimal("100"), standard_cost=Decimal("60"),
            org=self.org,
        )

    def make_invoice(self, status="Sent", unit_price=Decimal("100"), tax_rate=Decimal("0")):
        invoice = Invoice.objects.create(
            invoice_title="Test Invoice",
            invoice_number=f"INV-CM-{self.id}-{Invoice.objects.count()}",
            status=status,
            account=self.account,
            client_name="Acme",
            subtotal=unit_price,
            discount_amount=0,
            tax_amount=0,
            total_amount=unit_price,
            currency="USD",
            org=self.org,
        )
        item = InvoiceLineItem.objects.create(
            invoice=invoice,
            product=self.product,
            name="Widget",
            quantity=1,
            unit_price=unit_price,
            tax_rate=tax_rate,
            subtotal=unit_price,
            total=unit_price,
            unit_cost_snapshot=self.product.standard_cost,
            org=self.org,
        )
        return invoice, item


class TestPolicyResolution(CommissionTestBase):
    def test_product_specific_policy_wins(self):
        all_policy = CommissionPolicy.objects.create(
            name="All", org=self.org, scope="ALL", base_type="NET", rate=1
        )
        product_policy = CommissionPolicy.objects.create(
            name="Widget", org=self.org, scope="PRODUCT", product=self.product,
            base_type="NET", rate=5,
        )
        resolved = resolve_policy(self.org, self.product, None, None)
        self.assertEqual(resolved.id, product_policy.id)
        self.assertNotEqual(resolved.id, all_policy.id)

    def test_inactive_policy_ignored(self):
        CommissionPolicy.objects.create(
            name="Off", org=self.org, scope="ALL", rate=9, is_active=False
        )
        self.assertIsNone(resolve_policy(self.org, self.product, None, None))


class TestBaseCalculations(CommissionTestBase):
    def test_net_vs_gross_base(self):
        _, item = self.make_invoice(unit_price=Decimal("100"), tax_rate=Decimal("13"))
        item.tax_amount = Decimal("13")
        item.total = Decimal("113")
        item.save()

        net_policy = CommissionPolicy(name="N", org=self.org, base_type="NET", rate=10)
        gross_policy = CommissionPolicy(name="G", org=self.org, base_type="GROSS", rate=10)
        profit_policy = CommissionPolicy(name="P", org=self.org, base_type="GROSS_PROFIT", rate=10)

        net_base, _, _ = compute_base(item, net_policy)
        gross_base, _, _ = compute_base(item, gross_policy)
        profit_base, profit, _ = compute_base(item, profit_policy)

        self.assertEqual(net_base, Decimal("100.00"))
        self.assertEqual(gross_base, Decimal("113.00"))
        self.assertEqual(profit_base, Decimal("40.00"))
        self.assertEqual(profit, Decimal("40.00"))


class TestTwoStageAccrual(CommissionTestBase):
    def setUp(self):
        super().setUp()
        self.policy = CommissionPolicy.objects.create(
            name="Widget Net 10%", org=self.org, scope="PRODUCT",
            product=self.product, base_type="NET", rate=10,
        )
        CommissionCreditRule.objects.create(
            policy=self.policy, role="ACCOUNT_OWNER", share_percent=100
        )

    def test_invoice_creates_provisional_only(self):
        invoice, _ = self.make_invoice(status="Sent")
        created = on_invoice_saved(invoice)
        self.assertEqual(created, 1)
        self.assertEqual(
            CommissionEntry.objects.filter(invoice=invoice, stage="PROVISIONAL").count(), 1
        )
        self.assertEqual(CommissionEntry.objects.filter(invoice=invoice, stage="EARNED").count(), 0)
        entry = CommissionEntry.objects.get(invoice=invoice)
        self.assertEqual(entry.amount, Decimal("10.00"))
        self.assertEqual(entry.profile, self.owner_profile)

    def test_payment_creates_earned(self):
        invoice, _ = self.make_invoice(status="Sent")
        on_invoice_saved(invoice)
        payment = Payment.objects.create(
            invoice=invoice, amount=Decimal("100"), payment_date=invoice.issue_date,
            payment_method="CASH", org=self.org,
        )
        created = on_payment_saved(payment)
        self.assertEqual(created, 1)
        earned = CommissionEntry.objects.get(invoice=invoice, stage="EARNED")
        self.assertEqual(earned.amount, Decimal("10.00"))
        self.assertEqual(earned.payment, payment)

    def test_payment_is_idempotent(self):
        invoice, _ = self.make_invoice(status="Sent")
        payment = Payment.objects.create(
            invoice=invoice, amount=Decimal("100"), payment_date=invoice.issue_date,
            payment_method="CASH", org=self.org,
        )
        self.assertEqual(on_payment_saved(payment), 1)
        self.assertEqual(on_payment_saved(payment), 0)
        self.assertEqual(CommissionEntry.objects.filter(stage="EARNED").count(), 1)

    def test_reversal_appends_negative_row(self):
        invoice, _ = self.make_invoice(status="Sent")
        payment = Payment.objects.create(
            invoice=invoice, amount=Decimal("100"), payment_date=invoice.issue_date,
            payment_method="CASH", org=self.org,
        )
        on_payment_saved(payment)
        self.assertEqual(reverse_payment(payment), 1)
        original = CommissionEntry.objects.get(stage="EARNED", status="ACTIVE", reversed_by__isnull=False)
        self.assertIsNotNone(original.reversed_by)
        self.assertEqual(original.reversed_by.amount, -original.amount)
        self.assertEqual(original.reversed_by.status, "REVERSED")


class TestTiersAndCredits(CommissionTestBase):
    def test_single_transaction_tier(self):
        policy = CommissionPolicy.objects.create(
            name="Tiered", org=self.org, scope="PRODUCT", product=self.product,
            base_type="NET", rate=5, use_tiers=True,
        )
        CommissionTier.objects.create(policy=policy, min_amount=0, max_amount=200, rate=5)
        CommissionTier.objects.create(policy=policy, min_amount=200, max_amount=None, rate=8)
        CommissionCreditRule.objects.create(
            policy=policy, role="ACCOUNT_OWNER", share_percent=100
        )
        invoice, _ = self.make_invoice(status="Sent", unit_price=Decimal("300"))
        on_invoice_saved(invoice)
        entry = CommissionEntry.objects.get(invoice=invoice)
        self.assertEqual(entry.rate, Decimal("8.00"))
        self.assertEqual(entry.amount, Decimal("24.00"))

    def test_multi_role_split(self):
        policy = CommissionPolicy.objects.create(
            name="Split", org=self.org, scope="ALL", base_type="NET", rate=10,
        )
        CommissionCreditRule.objects.create(
            policy=policy, role="ACCOUNT_OWNER", share_percent=70
        )
        CommissionCreditRule.objects.create(
            policy=policy, role="LEAD_SOURCE", share_percent=30
        )
        # Lead source resolves through invoice assignees fallback when no opportunity
        invoice, _ = self.make_invoice(status="Sent")
        invoice.assigned_to.add(self.source_profile)
        on_invoice_saved(invoice)
        entries = CommissionEntry.objects.filter(invoice=invoice)
        self.assertEqual(entries.count(), 1)  # no lead source => only account owner
        owner_entry = entries.get(role="ACCOUNT_OWNER")
        self.assertEqual(owner_entry.amount, Decimal("7.00"))
        self.assertEqual(owner_entry.share_percent, Decimal("70.00"))


class TestVisibility(CommissionTestBase):
    def test_non_admin_only_sees_own_entries(self):
        invoice, _ = self.make_invoice(status="Sent")
        CommissionPolicy.objects.create(name="P", org=self.org, scope="ALL", rate=10)
        on_invoice_saved(invoice)

        factory = RequestFactory()
        request = factory.get("/api/commission/entries/")
        request.profile = self.owner_profile
        request.user = self.owner
        self.assertEqual(visible_entries(request).count(), 1)

        request.profile = self.source_profile
        request.user = self.source
        self.assertEqual(visible_entries(request).count(), 0)

    def test_admin_sees_all(self):
        invoice, _ = self.make_invoice(status="Sent")
        CommissionPolicy.objects.create(name="P", org=self.org, scope="ALL", rate=10)
        on_invoice_saved(invoice)
        self.source_profile.role = "ADMIN"
        self.source_profile.save(update_fields=["role"])
        factory = RequestFactory()
        request = factory.get("/api/commission/entries/")
        request.profile = self.source_profile
        request.user = self.source
        self.assertEqual(visible_entries(request).count(), 1)


class TestCustomerScope(CommissionTestBase):
    def test_new_vs_existing(self):
        policy = CommissionPolicy.objects.create(
            name="New only", org=self.org, scope="ALL", rate=10, customer_scope="NEW"
        )
        invoice, _ = self.make_invoice(status="Sent")
        self.assertEqual(customer_type_for(invoice, policy), "NEW")

        paid = Invoice.objects.create(
            invoice_title="Paid", invoice_number=f"INV-PAID-{Invoice.objects.count()}",
            status="Paid", account=self.account, client_name="Acme",
            total_amount=Decimal("50"), currency="USD", org=self.org,
        )
        self.assertEqual(customer_type_for(invoice, policy), "EXISTING")

    def test_existing_scope_skips_new_customer(self):
        policy = CommissionPolicy.objects.create(
            name="Existing only", org=self.org, scope="ALL", rate=10,
            customer_scope="EXISTING",
        )
        CommissionCreditRule.objects.create(
            policy=policy, role="ACCOUNT_OWNER", share_percent=100
        )
        invoice, _ = self.make_invoice(status="Sent")
        self.assertEqual(on_invoice_saved(invoice), 0)


class TestApiEndpoints(CommissionTestBase):
    """HTTP-level checks: routing, policy CRUD, confirmation guard."""

    def setUp(self):
        super().setUp()
        self.client = APIClient()
        # Bypass JWT/middleware org injection; inject our test profile directly.
        self.patcher = patch(
            "commission.api_views.HasOrgContext.has_permission",
            return_value=True,
        )
        self.patcher.start()
        self.addCleanup(self.patcher.stop)

    def _get(self, path):
        request = RequestFactory().get(path)
        request.profile = self.owner_profile
        request.user = self.owner
        return request

    def test_non_admin_cannot_create_policy(self):
        from commission.api_views import CommissionPolicyListView

        request = RequestFactory().post(
            "/api/commission/policies/",
            data={"name": "Nope", "scope": "ALL", "rate": 5},
            content_type="application/json",
        )
        request.data = {"name": "Nope", "scope": "ALL", "rate": 5}
        request.query_params = {}
        request.profile = self.owner_profile  # role USER
        request.user = self.owner
        response = CommissionPolicyListView().post(request)
        self.assertEqual(response.status_code, 403)
        self.assertFalse(CommissionPolicy.objects.filter(name="Nope").exists())

    def test_admin_can_create_policy(self):
        from commission.api_views import CommissionPolicyListView

        self.owner_profile.role = "ADMIN"
        self.owner_profile.save(update_fields=["role"])
        request = RequestFactory().post(
            "/api/commission/policies/",
            data={"name": "AdminPolicy", "scope": "ALL", "rate": 5},
            content_type="application/json",
        )
        request.data = {"name": "AdminPolicy", "scope": "ALL", "rate": 5}
        request.query_params = {}
        request.profile = self.owner_profile
        request.user = self.owner
        response = CommissionPolicyListView().post(request)
        self.assertEqual(response.status_code, 201)
        self.assertTrue(CommissionPolicy.objects.filter(name="AdminPolicy").exists())

    def test_policy_list_route_resolves(self):
        match = resolve("/api/commission/policies/")
        self.assertEqual(match.url_name, "policy_list")
        self.assertEqual(match.namespace, "common_urls:api_commission")

    def test_delete_without_confirm_returns_400(self):
        from commission.api_views import CommissionPolicyDetailView

        policy = CommissionPolicy.objects.create(name="P", org=self.org, scope="ALL", rate=5)
        # Delete is admin-only; make owner an admin so we test the confirm guard.
        self.owner_profile.role = "ADMIN"
        self.owner_profile.save(update_fields=["role"])
        view = CommissionPolicyDetailView()
        request = self._get(f"/api/commission/policies/{policy.id}/")
        request.data = {}
        request.query_params = {}
        response = view.delete(request, pk=policy.id)
        self.assertEqual(response.status_code, 400)
        self.assertTrue(CommissionPolicy.objects.filter(id=policy.id).exists())

    def test_summary_endpoint(self):
        from commission.api_views import CommissionSummaryView

        CommissionPolicy.objects.create(name="P", org=self.org, scope="ALL", rate=10)
        CommissionCreditRule.objects.create(
            policy=CommissionPolicy.objects.get(name="P"),
            role="ACCOUNT_OWNER", share_percent=100,
        )
        invoice, _ = self.make_invoice(status="Sent")
        on_invoice_saved(invoice)

        view = CommissionSummaryView()
        request = self._get("/api/commission/summary/")
        response = view.get(request)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Decimal(str(response.data["provisional"])), Decimal("10.00"))


class TestLedgerImmutability(CommissionTestBase):
    def test_entries_are_created_not_updated(self):
        policy = CommissionPolicy.objects.create(name="P", org=self.org, scope="ALL", rate=10)
        CommissionCreditRule.objects.create(
            policy=policy, role="ACCOUNT_OWNER", share_percent=100
        )
        invoice, _ = self.make_invoice(status="Sent")
        on_invoice_saved(invoice)
        entry = CommissionEntry.objects.get(invoice=invoice)
        original_key = entry.idempotency_key
        snapshot = dict(entry.calc_snapshot)
        # Re-running must not modify the original entry
        on_invoice_saved(invoice)
        entry.refresh_from_db()
        self.assertEqual(entry.idempotency_key, original_key)
        self.assertEqual(entry.calc_snapshot, snapshot)
        self.assertEqual(CommissionEntry.objects.filter(invoice=invoice).count(), 1)
