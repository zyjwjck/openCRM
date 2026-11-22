"""Tests for the nanobot -> MCP credential-exchange endpoint.

Run with: python manage.py test common.tests.test_agent_mcp_permissions -v 2
"""

import json
import os
import time

from django.conf import settings
from django.test import TestCase
from rest_framework.test import APIClient

from common.models import Org, Profile, User
from common.views.agent_views import _b64encode, _sign

URL = "/api/agent/mcp-token/"


def _make_credential(uid, oid, *, adm=False, exp=None, iat=None, secret=None):
    secret = secret or os.environ.get("NANOBOT_IDENTITY_SECRET") or settings.SECRET_KEY
    now = int(time.time())
    payload = {
        "uid": str(uid),
        "oid": str(oid),
        "email": "caller@example.com",
        "adm": adm,
        "iat": now if iat is None else iat,
        "exp": now + 300 if exp is None else exp,
        "nonce": "test-nonce",
    }
    body = _b64encode(json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8"))
    return f"{body}.{_sign(body, secret)}"


class McpTokenExchangeTests(TestCase):
    def setUp(self):
        self.org = Org.objects.create(name="MCP Test Org")
        self.other_org = Org.objects.create(name="MCP Other Org")
        self.user = User.objects.create_user(email="mcp-user@test.com", password="pass12345")
        self.profile = Profile.objects.create(
            user=self.user, org=self.org, role="ADMIN", is_active=True
        )
        self.client = APIClient()

    def test_valid_credential_returns_scoped_access_token(self):
        credential = _make_credential(self.user.id, self.org.id)
        response = self.client.post(URL, {"credential": credential}, format="json")
        self.assertEqual(response.status_code, 200, response.content)
        data = response.json()
        self.assertTrue(data["access_token"])
        self.assertEqual(data["user_id"], str(self.user.id))
        self.assertEqual(data["org_id"], str(self.org.id))
        self.assertNotIn("refresh_token", data)
        self.assertNotIn("password", data)

    def test_scoped_token_carries_caller_identity_and_org(self):
        credential = _make_credential(self.user.id, self.org.id)
        response = self.client.post(URL, {"credential": credential}, format="json")
        from rest_framework_simplejwt.tokens import AccessToken

        token = AccessToken(response.json()["access_token"])
        self.assertEqual(str(token["user_id"]), str(self.user.id))
        self.assertEqual(str(token["org_id"]), str(self.org.id))

    def test_tampered_credential_rejected(self):
        credential = _make_credential(self.user.id, self.org.id)
        body, _, sig = credential.rpartition(".")
        tampered = f"{body}.{'0' * len(sig)}"
        response = self.client.post(URL, {"credential": tampered}, format="json")
        self.assertEqual(response.status_code, 401, response.content)

    def test_expired_credential_rejected(self):
        now = int(time.time())
        credential = _make_credential(
            self.user.id, self.org.id, iat=now - 1000, exp=now - 10
        )
        response = self.client.post(URL, {"credential": credential}, format="json")
        self.assertEqual(response.status_code, 401, response.content)

    def test_wrong_secret_credential_rejected(self):
        credential = _make_credential(self.user.id, self.org.id, secret="not-the-secret")
        response = self.client.post(URL, {"credential": credential}, format="json")
        self.assertEqual(response.status_code, 401, response.content)

    def test_org_taken_from_credential_not_header(self):
        # Even if a caller supplies a different org header, the token org must
        # come from the signed credential.
        credential = _make_credential(self.user.id, self.org.id)
        response = self.client.post(
            URL,
            {"credential": credential},
            format="json",
            HTTP_X_ORG_NAME=self.other_org.name,
            HTTP_X_ORG=str(self.other_org.id),
        )
        self.assertEqual(response.status_code, 200, response.content)
        self.assertEqual(response.json()["org_id"], str(self.org.id))

    def test_non_member_of_org_rejected(self):
        # user belongs to self.org; credential claims other_org where they have
        # no active profile -> must be rejected (no cross-org token).
        credential = _make_credential(self.user.id, self.other_org.id)
        response = self.client.post(URL, {"credential": credential}, format="json")
        self.assertEqual(response.status_code, 403, response.content)

    def test_unknown_user_rejected(self):
        import uuid

        credential = _make_credential(str(uuid.uuid4()), self.org.id)
        response = self.client.post(URL, {"credential": credential}, format="json")
        self.assertEqual(response.status_code, 403, response.content)
