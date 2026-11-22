"""MCP server authentication and caller-resolution tests.

Covers OpenSpec tasks 3.1-3.3:
  - unauthenticated / tampered / expired credentials are rejected before tools run
  - a valid credential resolves to the caller identity and exchanges a scoped token
  - user1 and admin calls resolve to distinct CRM identities
  - permission resolution failure fails closed; cross-org selection is rejected
"""

import base64
import json
import os
import time
import unittest
from unittest.mock import patch

import opencrm_server as srv

SECRET = "unit-test-shared-secret"


def _b64encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")


def _credential(payload: dict, secret: str = SECRET) -> str:
    body = _b64encode(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    )
    sig = srv._sign_credential(body, secret)
    return f"{body}.{sig}"


def _valid_payload(**overrides) -> dict:
    now = int(time.time())
    payload = {
        "uid": "user-1",
        "oid": "org-1",
        "email": "user1@example.com",
        "adm": False,
        "iat": now,
        "exp": now + 120,
        "nonce": "nonce-1",
    }
    payload.update(overrides)
    return payload


class CredentialValidationTests(unittest.TestCase):
    def test_valid_credential_decodes_to_payload(self):
        payload = _valid_payload()
        decoded = srv._decode_credential(_credential(payload), SECRET)
        self.assertEqual(decoded["uid"], "user-1")
        self.assertEqual(decoded["oid"], "org-1")
        self.assertFalse(decoded["adm"])

    def test_tampered_credential_is_rejected(self):
        cred = _credential(_valid_payload())
        body, _, _ = cred.rpartition(".")
        tampered = f"{body}.{'0' * 64}"
        self.assertIsNone(srv._decode_credential(tampered, SECRET))

    def test_expired_credential_is_rejected(self):
        now = int(time.time())
        cred = _credential(_valid_payload(iat=now - 1000, exp=now - 10))
        self.assertIsNone(srv._decode_credential(cred, SECRET))

    def test_wrong_secret_is_rejected(self):
        cred = _credential(_valid_payload(), SECRET)
        self.assertIsNone(srv._decode_credential(cred, "another-secret"))


class SafeCallIdentityTests(unittest.TestCase):
    def _call(self, credential):
        """Run a trivial tool through safe_call with a given _meta credential."""
        @srv.safe_call
        def probe():
            return {"__error__": False, "ran": True}

        with patch.dict(os.environ, {"NANOBOT_IDENTITY_SECRET": SECRET}), \
             patch.object(srv, "_credential_from_request", return_value=credential):
            return probe()

    def test_no_credential_is_rejected_before_tool_runs(self):
        result = self._call(None)
        self.assertTrue(result["__error__"])
        self.assertEqual(result["status_code"], 401)
        self.assertNotIn("ran", result)

    def test_tampered_credential_is_rejected_before_tool_runs(self):
        result = self._call("not-a-valid-credential")
        self.assertTrue(result["__error__"])
        self.assertEqual(result["status_code"], 401)
        self.assertNotIn("ran", result)

    def test_valid_credential_runs_tool(self):
        result = self._call(_credential(_valid_payload()))
        self.assertFalse(result.get("__error__", False))
        self.assertTrue(result["ran"])

    def test_missing_secret_fails_closed(self):
        @srv.safe_call
        def probe():
            return {"ran": True}

        env = os.environ.copy()
        env.pop("NANOBOT_IDENTITY_SECRET", None)
        with patch.dict(os.environ, env, clear=True), \
             patch.object(srv, "_credential_from_request", return_value=_credential(_valid_payload())):
            result = probe()
        self.assertTrue(result["__error__"])
        self.assertEqual(result["status_code"], 503)
        self.assertNotIn("ran", result)


class CallerResolutionTests(unittest.TestCase):
    def _client_for_payload(self, payload, me_orgs, exchange=None):
        """Resolve a client as _get_client() would for a given signed payload."""
        cred = _credential(payload)
        exchanged = exchange or {
            "access_token": f"scoped-token-{payload['uid']}",
            "user_id": payload["uid"],
            "org_id": payload["oid"],
        }
        fake_resp = type("Resp", (), {
            "status_code": 200,
            "text": "",
            "json": staticmethod(lambda: exchanged),
        })()

        def fake_session_request(self, method, url, **kwargs):
            me_resp = type("MeResp", (), {
                "status_code": 200,
                "text": "",
                "json": staticmethod(lambda: {"organizations": me_orgs}),
            })()
            return me_resp

        with patch.dict(os.environ, {"NANOBOT_IDENTITY_SECRET": SECRET}), \
             patch.object(srv, "_credential_from_request", return_value=cred), \
             patch.object(srv.requests, "post", return_value=fake_resp), \
             patch.object(srv.requests.Session, "request", fake_session_request):
            tok = srv._bind_call_identity()
            try:
                return srv._get_client()
            finally:
                srv._current_identity.reset(tok)

    def test_user_and_admin_resolve_to_distinct_identities(self):
        orgs = [
            {"id": "org-1", "name": "Org1", "role": "USER",
             "is_organization_admin": False, "has_sales_access": False,
             "has_marketing_access": False, "is_active": True}
        ]
        user_client = self._client_for_payload(_valid_payload(uid="user-1", adm=False), orgs)
        admin_client = self._client_for_payload(
            _valid_payload(uid="admin-1", adm=True), orgs
        )

        self.assertEqual(user_client.identity["user_id"], "user-1")
        self.assertEqual(admin_client.identity["user_id"], "admin-1")
        self.assertNotEqual(user_client.access_token, admin_client.access_token)
        self.assertEqual(user_client.identity["org_id"], "org-1")

    def test_cross_org_permissions_do_not_resolve(self):
        # Credential says org-1, but /me only lists org-2 -> fail closed.
        orgs = [
            {"id": "org-2", "name": "Org2", "role": "ADMIN",
             "is_organization_admin": True, "has_sales_access": True,
             "has_marketing_access": True, "is_active": True}
        ]
        client = self._client_for_payload(_valid_payload(oid="org-1"), orgs)
        self.assertFalse(client.permissions["resolved"])

    def test_non_admin_denied_admin_permission(self):
        orgs = [
            {"id": "org-1", "name": "Org1", "role": "USER",
             "is_organization_admin": False, "has_sales_access": False,
             "has_marketing_access": False, "is_active": True}
        ]
        client = self._client_for_payload(_valid_payload(adm=False), orgs)
        denied = client._check_permission("admin")
        self.assertTrue(denied["__error__"])
        self.assertEqual(denied["status_code"], 403)

    def test_unresolved_permissions_fail_closed(self):
        client = self._client_for_payload(_valid_payload(), [])
        denied = client._check_permission("sales")
        self.assertTrue(denied["__error__"])
        self.assertEqual(denied["status_code"], 403)
        self.assertIn("无法解析", denied["message"])


class ConfigurationTests(unittest.TestCase):
    def test_default_config_enables_identity_enforcement(self):
        env = os.environ.copy()
        env.pop("NANOBOT_MCP_IDENTITY", None)
        cfg = {"identity_enforcement": True}
        with patch.dict(os.environ, env, clear=True), \
             patch.object(srv, "_load_config", return_value=cfg):
            self.assertTrue(srv._identity_enforcement_enabled())

    def test_legacy_mode_disables_enforcement(self):
        config = {"identity_enforcement": False}
        with patch.dict(os.environ, {"NANOBOT_MCP_IDENTITY": "off"}), \
             patch.object(srv, "_load_config", return_value=config):
            self.assertFalse(srv._identity_enforcement_enabled())

    def test_legacy_and_enforcement_are_mutually_exclusive(self):
        """Legacy static-account fallback is unreachable while enforcement is on."""
        # Enforcement on -> no credential -> fail closed, static account never used.
        cfg = {"identity_enforcement": True, "password": "static-pass", "access_token": None}
        with patch.dict(os.environ, {"NANOBOT_IDENTITY_SECRET": SECRET}, clear=False), \
             patch.object(srv, "_load_config", return_value=cfg), \
             patch.object(srv, "_credential_from_request", return_value=None), \
             patch.object(srv.CRMClient, "_login") as mock_login:
            tok = None
            try:
                tok = srv._bind_call_identity()
                self.fail("expected fail-closed without credential")
            except srv.MCPAuthorizationError as exc:
                self.assertEqual(exc.status_code, 401)
            finally:
                if tok is not None:
                    srv._current_identity.reset(tok)
            mock_login.assert_not_called()

    def test_identity_mode_never_reads_static_account(self):
        """Production identity mode must not consult config.json's static account."""
        cred = _credential(_valid_payload())
        exchanged = {
            "access_token": "scoped-token-user-1",
            "user_id": "user-1",
            "org_id": "org-1",
        }
        fake_post = type("Resp", (), {
            "status_code": 200,
            "text": "",
            "json": staticmethod(lambda: exchanged),
        })()
        fake_me = type("MeResp", (), {
            "status_code": 200,
            "text": "",
            "json": staticmethod(lambda: {"organizations": [{
                "id": "org-1", "name": "Org1", "role": "USER",
                "is_organization_admin": False, "has_sales_access": False,
                "has_marketing_access": False, "is_active": True,
            }]}),
        })()

        # Static account is deliberately INVALID in config; identity mode must still work.
        cfg = {
            "identity_enforcement": True,
            "base_url": "http://127.0.0.1:8099",
            "email": "", "password": "CHANGE_ME", "access_token": None,
        }
        with patch.dict(os.environ, {"NANOBOT_IDENTITY_SECRET": SECRET}), \
             patch.object(srv, "_load_config", return_value=cfg), \
             patch.object(srv, "_credential_from_request", return_value=cred), \
             patch.object(srv.requests, "post", return_value=fake_post), \
             patch.object(srv.requests.Session, "request", return_value=fake_me):
            tok = srv._bind_call_identity()
            try:
                client = srv._get_client()
            finally:
                srv._current_identity.reset(tok)

        self.assertEqual(client.access_token, "scoped-token-user-1")
        self.assertEqual(client.identity["user_id"], "user-1")
        self.assertEqual(client.email, "")  # no static account email used

    def test_legacy_mode_uses_static_account_when_explicitly_off(self):
        cfg = {
            "identity_enforcement": False,
            "base_url": "http://127.0.0.1:8099",
            "email": "static@example.com",
            "password": "static-pass",
            "access_token": None,
        }
        with patch.dict(os.environ, {"NANOBOT_MCP_IDENTITY": "off"}), \
             patch.object(srv, "_load_config", return_value=cfg), \
             patch.object(srv.CRMClient, "_login"), \
             patch.object(srv.CRMClient, "_resolve_permissions"):
            client = srv._get_client()
        self.assertEqual(client.email, "static@example.com")
        self.assertIsNone(client.identity)


if __name__ == "__main__":
    unittest.main()
