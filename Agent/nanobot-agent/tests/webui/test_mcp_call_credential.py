"""Tests for short-lived MCP call credentials minted from a caller identity."""

import unittest

from nanobot.webui.identity import (
    MCP_CALL_CREDENTIAL_TTL_S,
    CallerIdentity,
    decode_credential,
    mint_mcp_call_credential,
)

SECRET = "unit-test-secret"


class McpCallCredentialTests(unittest.TestCase):
    def test_minted_credential_round_trips_identity(self):
        identity = CallerIdentity(
            user_id="user-1", org_id="org-1", email="user1@example.com", is_admin=False
        )
        credential = mint_mcp_call_credential(identity, SECRET, now_s=1000.0)

        decoded = decode_credential(credential, SECRET, now_s=1000.0)
        self.assertIsNotNone(decoded)
        self.assertEqual(decoded.user_id, identity.user_id)
        self.assertEqual(decoded.org_id, identity.org_id)
        self.assertEqual(decoded.email, identity.email)
        self.assertFalse(decoded.is_admin)

    def test_minted_credential_is_short_lived(self):
        identity = CallerIdentity(user_id="user-1", org_id="org-1", is_admin=True)
        credential = mint_mcp_call_credential(identity, SECRET, now_s=1000.0)

        self.assertLessEqual(MCP_CALL_CREDENTIAL_TTL_S, 300)
        self.assertIsNotNone(decode_credential(credential, SECRET, now_s=1005.0))
        self.assertIsNone(
            decode_credential(
                credential, SECRET, now_s=1000.0 + MCP_CALL_CREDENTIAL_TTL_S
            )
        )

    def test_wrong_secret_cannot_decode(self):
        identity = CallerIdentity(user_id="user-1", org_id="org-1")
        credential = mint_mcp_call_credential(identity, SECRET, now_s=1000.0)
        self.assertIsNone(decode_credential(credential, "other-secret", now_s=1000.0))

    def test_mint_requires_identity_fields(self):
        with self.assertRaises(ValueError):
            mint_mcp_call_credential(CallerIdentity(user_id="", org_id="org-1"), SECRET)
        with self.assertRaises(ValueError):
            mint_mcp_call_credential(CallerIdentity(user_id="user-1", org_id=""), SECRET)


if __name__ == "__main__":
    unittest.main()
