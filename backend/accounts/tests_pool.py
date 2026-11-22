"""Tests for the public/private pool filter on the accounts list endpoint."""

from unittest.mock import patch

from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from accounts.models import Account
from accounts.views import AccountsListView
from common.models import Org, Profile, User


class AccountPoolFilterTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.org = Org.objects.create(name="Account Pool Org")
        cls.other_org = Org.objects.create(name="Other Account Org")

        cls.owner = User.objects.create_user(email="owner@acctpool.test", password="pw")
        cls.owner_profile = Profile.objects.create(
            user=cls.owner, org=cls.org, role="USER", is_active=True
        )
        cls.other = User.objects.create_user(email="other@acctpool.test", password="pw")
        cls.other_profile = Profile.objects.create(
            user=cls.other, org=cls.org, role="USER", is_active=True
        )
        cls.admin = User.objects.create_user(email="admin@acctpool.test", password="pw")
        cls.admin_profile = Profile.objects.create(
            user=cls.admin, org=cls.org, role="ADMIN", is_active=True
        )

        cls.own_account = Account.objects.create(name="Own Account", org=cls.org, is_active=True)
        cls.own_account.assigned_to.add(cls.owner_profile)

        cls.other_account = Account.objects.create(name="Other Account", org=cls.org, is_active=True)
        cls.other_account.assigned_to.add(cls.other_profile)

        cls.public_account = Account.objects.create(name="Public Account", org=cls.org, is_active=True)

        cls.foreign_account = Account.objects.create(
            name="Foreign Account", org=cls.other_org, is_active=True
        )

    def _get_ids(self, profile, params=None):
        request = APIRequestFactory().get("/api/accounts/", params or {})
        force_authenticate(request, user=profile.user)
        request.profile = profile
        request.org = profile.org
        with patch("common.permissions.HasOrgContext.has_permission", return_value=True):
            response = AccountsListView.as_view()(request)
        data = response.data["active_accounts"]["open_accounts"]
        return {str(item["id"]) for item in data}

    def test_no_pool_non_admin_defaults_to_own_private(self):
        ids = self._get_ids(self.owner_profile)
        self.assertEqual(ids, {str(self.own_account.id)})

    def test_no_pool_admin_defaults_to_all(self):
        ids = self._get_ids(self.admin_profile)
        self.assertEqual(
            ids,
            {str(self.own_account.id), str(self.other_account.id), str(self.public_account.id)},
        )

    def test_private_non_admin_sees_only_own_assigned(self):
        ids = self._get_ids(self.owner_profile, {"pool": "private"})
        self.assertEqual(ids, {str(self.own_account.id)})

    def test_private_admin_sees_all_assigned(self):
        ids = self._get_ids(self.admin_profile, {"pool": "private"})
        self.assertEqual(ids, {str(self.own_account.id), str(self.other_account.id)})
        self.assertNotIn(str(self.public_account.id), ids)

    def test_public_non_admin_sees_unassigned(self):
        ids = self._get_ids(self.owner_profile, {"pool": "public"})
        self.assertEqual(ids, {str(self.public_account.id)})

    def test_public_admin_sees_unassigned(self):
        ids = self._get_ids(self.admin_profile, {"pool": "public"})
        self.assertEqual(ids, {str(self.public_account.id)})

    def test_all_non_admin_sees_own_plus_public_not_others_private(self):
        ids = self._get_ids(self.owner_profile, {"pool": "all"})
        self.assertEqual(ids, {str(self.own_account.id), str(self.public_account.id)})
        self.assertNotIn(str(self.other_account.id), ids)

    def test_all_admin_sees_everything_in_org(self):
        ids = self._get_ids(self.admin_profile, {"pool": "all"})
        self.assertIn(str(self.own_account.id), ids)
        self.assertIn(str(self.other_account.id), ids)
        self.assertIn(str(self.public_account.id), ids)
        self.assertNotIn(str(self.foreign_account.id), ids)

    def test_invalid_pool_value_defaults_by_role(self):
        self.assertEqual(
            self._get_ids(self.owner_profile, {"pool": "bogus"}),
            self._get_ids(self.owner_profile),
        )

    def test_public_with_search_filter(self):
        ids = self._get_ids(
            self.owner_profile, {"pool": "public", "search": "Public Account"}
        )
        self.assertEqual(ids, {str(self.public_account.id)})
