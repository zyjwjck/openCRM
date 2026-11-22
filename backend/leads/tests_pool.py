"""Tests for the public/private pool filter on the leads list endpoint."""

from unittest.mock import patch

from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate

from common.models import Org, Profile, User
from leads.models import Lead
from leads.views.lead_views import LeadListView


class LeadPoolFilterTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.org = Org.objects.create(name="Pool Test Org")
        cls.other_org = Org.objects.create(name="Other Org")

        cls.owner = User.objects.create_user(email="owner@pool.test", password="pw")
        cls.owner_profile = Profile.objects.create(
            user=cls.owner, org=cls.org, role="USER", is_active=True
        )
        cls.other = User.objects.create_user(email="other@pool.test", password="pw")
        cls.other_profile = Profile.objects.create(
            user=cls.other, org=cls.org, role="USER", is_active=True
        )
        cls.admin = User.objects.create_user(email="admin@pool.test", password="pw")
        cls.admin_profile = Profile.objects.create(
            user=cls.admin, org=cls.org, role="ADMIN", is_active=True
        )

        # Own private: assigned to owner
        cls.own_lead = Lead.objects.create(org=cls.org, title="Own Lead", status="assigned")
        cls.own_lead.assigned_to.add(cls.owner_profile)

        # Other's private: assigned to another user
        cls.other_lead = Lead.objects.create(org=cls.org, title="Other Lead", status="assigned")
        cls.other_lead.assigned_to.add(cls.other_profile)

        # Public: no assignee
        cls.public_lead = Lead.objects.create(org=cls.org, title="Public Lead", status="assigned")

        # Foreign org -> must never appear
        cls.foreign_lead = Lead.objects.create(org=cls.other_org, title="Foreign Lead", status="assigned")

    def _get_ids(self, profile, params=None):
        request = APIRequestFactory().get("/api/leads/", params or {})
        force_authenticate(request, user=profile.user)
        request.profile = profile
        request.org = profile.org
        with patch("common.permissions.HasOrgContext.has_permission", return_value=True):
            response = LeadListView.as_view()(request)
        data = response.data["open_leads"]["open_leads"]
        return {str(item["id"]) for item in data}

    def test_no_pool_non_admin_defaults_to_own_private(self):
        ids = self._get_ids(self.owner_profile)
        self.assertEqual(ids, {str(self.own_lead.id)})

    def test_no_pool_admin_defaults_to_all(self):
        ids = self._get_ids(self.admin_profile)
        self.assertEqual(
            ids,
            {str(self.own_lead.id), str(self.other_lead.id), str(self.public_lead.id)},
        )

    def test_private_non_admin_sees_only_own_assigned(self):
        ids = self._get_ids(self.owner_profile, {"pool": "private"})
        self.assertEqual(ids, {str(self.own_lead.id)})

    def test_private_admin_sees_all_assigned(self):
        ids = self._get_ids(self.admin_profile, {"pool": "private"})
        self.assertEqual(ids, {str(self.own_lead.id), str(self.other_lead.id)})
        self.assertNotIn(str(self.public_lead.id), ids)

    def test_public_non_admin_sees_unassigned(self):
        ids = self._get_ids(self.owner_profile, {"pool": "public"})
        self.assertEqual(ids, {str(self.public_lead.id)})

    def test_public_admin_sees_unassigned(self):
        ids = self._get_ids(self.admin_profile, {"pool": "public"})
        self.assertEqual(ids, {str(self.public_lead.id)})

    def test_all_non_admin_sees_own_plus_public_not_others_private(self):
        ids = self._get_ids(self.owner_profile, {"pool": "all"})
        self.assertEqual(ids, {str(self.own_lead.id), str(self.public_lead.id)})
        self.assertNotIn(str(self.other_lead.id), ids)

    def test_all_admin_sees_everything_in_org(self):
        ids = self._get_ids(self.admin_profile, {"pool": "all"})
        self.assertIn(str(self.own_lead.id), ids)
        self.assertIn(str(self.other_lead.id), ids)
        self.assertIn(str(self.public_lead.id), ids)
        self.assertNotIn(str(self.foreign_lead.id), ids)

    def test_invalid_pool_value_defaults_by_role(self):
        self.assertEqual(
            self._get_ids(self.owner_profile, {"pool": "bogus"}),
            self._get_ids(self.owner_profile),
        )
        self.assertEqual(
            self._get_ids(self.admin_profile, {"pool": "bogus"}),
            self._get_ids(self.admin_profile),
        )

    def test_public_with_search_filter(self):
        ids = self._get_ids(
            self.owner_profile, {"pool": "public", "search": "Public Lead"}
        )
        self.assertEqual(ids, {str(self.public_lead.id)})
