"""Caller identity and owner-scoped access helpers for the embedded WebUI.

The CRM signs a short-lived credential with a shared secret.  nanobot verifies
it at ``/webui/bootstrap`` and binds the resulting identity to the issued
WebSocket / HTTP tokens.  Sessions record their owner as ``org_id:user_id`` and
every read path checks it here so the rules stay in one place.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import secrets
import time
from dataclasses import dataclass
from typing import Any, Mapping

CREDENTIAL_TTL_S = 8 * 3600
# Short-lived credential used for a single gateway -> MCP tool call. Kept well
# below the WebUI bootstrap credential TTL to limit the window of misuse.
MCP_CALL_CREDENTIAL_TTL_S = 120
OWNER_METADATA_KEY = "owner"
CALLER_METADATA_KEY = "_nanobot_caller_identity"
# Internal request metadata carrying a short-lived signed credential for the
# current MCP tool call. Never placed in tool arguments or model-visible text.
MCP_CALL_CREDENTIAL_METADATA_KEY = "_nanobot_mcp_call_credential"


@dataclass(frozen=True)
class CallerIdentity:
    user_id: str
    org_id: str
    email: str = ""
    is_admin: bool = False

    @property
    def owner_key(self) -> str:
        return f"{self.org_id}:{self.user_id}"

    def as_metadata(self) -> dict[str, Any]:
        return {
            "user_id": self.user_id,
            "org_id": self.org_id,
            "email": self.email,
            "is_admin": self.is_admin,
        }


def _b64encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")


def _b64decode(text: str) -> bytes:
    padding = "=" * (-len(text) % 4)
    return base64.urlsafe_b64decode(text + padding)


def _signature(body: str, secret: str) -> str:
    return hmac.new(secret.encode("utf-8"), body.encode("ascii"), hashlib.sha256).hexdigest()


def encode_credential(payload: Mapping[str, Any], secret: str) -> str:
    """Sign a credential payload. Mirrored byte-for-byte in the CRM backend."""
    body = _b64encode(
        json.dumps(dict(payload), ensure_ascii=False, separators=(",", ":")).encode("utf-8")
    )
    return f"{body}.{_signature(body, secret)}"


def mint_mcp_call_credential(
    identity: CallerIdentity,
    secret: str,
    *,
    ttl_s: int = MCP_CALL_CREDENTIAL_TTL_S,
    now_s: float | None = None,
) -> str:
    """Mint a short-lived signed credential bound to a caller identity.

    The MCP server verifies this with the same shared secret scheme and
    exchanges it for a scoped CRM token. The credential is intentionally
    short-lived and never contains passwords or long-lived JWTs.
    """
    if not secret or not identity.user_id or not identity.org_id:
        raise ValueError("identity and secret are required to mint an MCP credential")
    now = int(time.time() if now_s is None else now_s)
    payload = {
        "uid": identity.user_id,
        "oid": identity.org_id,
        "email": identity.email,
        "adm": identity.is_admin,
        "iat": now,
        "exp": now + int(ttl_s),
        "nonce": secrets.token_urlsafe(8),
    }
    return encode_credential(payload, secret)


def decode_credential(
    credential: str,
    secret: str,
    *,
    now_s: float | None = None,
    ttl_s: int = CREDENTIAL_TTL_S,
) -> CallerIdentity | None:
    """Verify signature and expiry, returning an identity or ``None``."""
    if not isinstance(credential, str) or not secret or "." not in credential:
        return None
    body, _, supplied_sig = credential.rpartition(".")
    if not body or not supplied_sig or not hmac.compare_digest(supplied_sig, _signature(body, secret)):
        return None
    try:
        payload = json.loads(_b64decode(body))
    except (ValueError, TypeError):
        return None
    if not isinstance(payload, dict):
        return None
    now = time.time() if now_s is None else now_s
    exp = payload.get("exp")
    iat = payload.get("iat")
    if not isinstance(exp, (int, float)) or not isinstance(iat, (int, float)):
        return None
    if now >= exp or iat - now > 300:
        return None
    user_id = str(payload.get("uid") or "").strip()
    org_id = str(payload.get("oid") or "").strip()
    if not user_id or not org_id:
        return None
    return CallerIdentity(
        user_id=user_id,
        org_id=org_id,
        email=str(payload.get("email") or ""),
        is_admin=bool(payload.get("adm")),
    )


def identity_from_metadata(metadata: Mapping[str, Any] | None) -> CallerIdentity | None:
    """Rebuild a caller identity from request/message metadata."""
    if not isinstance(metadata, Mapping):
        return None
    raw = metadata.get(CALLER_METADATA_KEY)
    if not isinstance(raw, Mapping):
        return None
    user_id = str(raw.get("user_id") or "").strip()
    org_id = str(raw.get("org_id") or "").strip()
    if not user_id or not org_id:
        return None
    return CallerIdentity(
        user_id=user_id,
        org_id=org_id,
        email=str(raw.get("email") or ""),
        is_admin=bool(raw.get("is_admin")),
    )


def session_owner(metadata: Mapping[str, Any] | None) -> str:
    if not isinstance(metadata, Mapping):
        return ""
    value = metadata.get(OWNER_METADATA_KEY)
    if isinstance(value, str):
        return value.strip()
    if isinstance(value, Mapping):
        org_id = str(value.get("org_id") or "").strip()
        user_id = str(value.get("user_id") or "").strip()
        return f"{org_id}:{user_id}" if org_id and user_id else ""
    return ""


def can_access(identity: CallerIdentity | None, metadata: Mapping[str, Any] | None) -> bool:
    """Whether *identity* may see a session carrying *metadata*.

    With isolation disabled (``identity is None``) everything stays visible,
    preserving nanobot's original single-user behaviour.  A signed-in admin may
    see every session; other callers only see their own.  Legacy sessions with
    no owner are hidden from non-admins so nothing leaks by default.
    """
    if identity is None:
        return True
    if identity.is_admin:
        return True
    owner = session_owner(metadata)
    return bool(owner) and owner == identity.owner_key
