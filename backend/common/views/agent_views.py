"""Endpoints supporting the embedded nanobot agent."""

import base64
import hashlib
import hmac
import json
import os
import secrets
import time

from django.conf import settings
from drf_spectacular.utils import extend_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from common.models import Org, Profile, User
from common.serializer import OrgAwareRefreshToken

CREDENTIAL_TTL_S = 8 * 3600


def _b64encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")


def _b64decode(text: str) -> bytes:
    padding = "=" * (-len(text) % 4)
    return base64.urlsafe_b64decode(text + padding)


def _sign(body: str, secret: str) -> str:
    return hmac.new(secret.encode("utf-8"), body.encode("ascii"), hashlib.sha256).hexdigest()


def _decode_credential(credential, secret):
    """Verify a signed nanobot credential and return its payload, or None.

    Mirrors ``nanobot.webui.identity.decode_credential`` so credentials minted
    by either side are interchangeable. Only signature, expiry and required
    claims are checked here; authorization uses the referenced DB records.
    """
    if not isinstance(credential, str) or not secret or "." not in credential:
        return None
    body, _, supplied_sig = credential.rpartition(".")
    if not body or not supplied_sig or not hmac.compare_digest(supplied_sig, _sign(body, secret)):
        return None
    try:
        payload = json.loads(_b64decode(body))
    except (ValueError, TypeError):
        return None
    if not isinstance(payload, dict):
        return None
    now = time.time()
    exp = payload.get("exp")
    iat = payload.get("iat")
    if not isinstance(exp, (int, float)) or not isinstance(iat, (int, float)):
        return None
    if now >= exp or iat - now > 300:
        return None
    if not str(payload.get("uid") or "").strip() or not str(payload.get("oid") or "").strip():
        return None
    return payload


class NanobotCredentialView(APIView):
    """Issue a short-lived, signed credential for the nanobot WebUI.

    The CRM frontend embeds the returned credential in the nanobot iframe URL.
    nanobot verifies the signature with the shared secret so a browser cannot
    forge another user's identity or admin flag.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        description="Signed identity credential for the embedded nanobot agent",
        responses={200: dict},
    )
    def get(self, request):
        profile = getattr(request, "profile", None)
        org = getattr(request, "org", None)
        if profile is None or org is None:
            user = request.user
            profile = Profile.objects.filter(user=user, is_active=True).order_by("created_at").first()
            if profile is None:
                return Response({"detail": "No active organization profile"}, status=403)
            org = profile.org

        # Fall back to the app secret so the endpoint works out of the box; set
        # NANOBOT_IDENTITY_SECRET in .env to isolate this credential from JWTs.
        secret = os.environ.get("NANOBOT_IDENTITY_SECRET") or settings.SECRET_KEY
        now = int(time.time())
        payload = {
            "uid": str(request.user.id),
            "oid": str(org.id),
            "email": request.user.email or "",
            "adm": bool(
                getattr(profile, "is_organization_admin", False)
                or getattr(profile, "role", "") == "ADMIN"
                or getattr(request.user, "is_superuser", False)
            ),
            "iat": now,
            "exp": now + CREDENTIAL_TTL_S,
            "nonce": secrets.token_urlsafe(8),
        }
        body = _b64encode(
            json.dumps(payload, ensure_ascii=False, separators=(",", ":")).encode("utf-8")
        )
        credential = f"{body}.{_sign(body, secret)}"
        return Response({"credential": credential, "expires_in": CREDENTIAL_TTL_S})


class McpTokenExchangeView(APIView):
    """Exchange a verified nanobot caller credential for a short-lived, scoped JWT.

    Used by the MCP server to act as the actual CRM caller behind an embedded AI
    session instead of a shared service account. The org is taken from the
    signed credential only (never from a client header), and the caller's active
    membership in that org is verified before a token is issued.
    """

    authentication_classes = []
    permission_classes = []

    @extend_schema(
        description="Exchange a signed nanobot caller credential for a scoped CRM access token",
        request={"credential": "string"},
        responses={200: dict, 400: dict, 401: dict, 403: dict},
    )
    def post(self, request):
        credential = request.data.get("credential")
        secret = os.environ.get("NANOBOT_IDENTITY_SECRET") or settings.SECRET_KEY
        payload = _decode_credential(credential, secret)
        if payload is None:
            return Response({"detail": "Invalid or expired credential"}, status=401)

        user_id = str(payload["uid"])
        org_id = str(payload["oid"])
        try:
            user = User.objects.get(id=user_id, is_active=True)
        except (User.DoesNotExist, ValueError):
            return Response({"detail": "Caller user not found"}, status=403)
        try:
            org = Org.objects.get(id=org_id, is_active=True)
        except (Org.DoesNotExist, ValueError):
            return Response({"detail": "Caller organization not found"}, status=403)
        profile = Profile.objects.filter(user=user, org=org, is_active=True).first()
        if profile is None:
            return Response({"detail": "Caller is not an active member of the organization"}, status=403)

        token = OrgAwareRefreshToken.for_user_and_org(user, org, profile)
        # Only the short-lived access token is returned — no refresh token and
        # no password material ever leaves this endpoint.
        return Response(
            {
                "access_token": str(token.access_token),
                "user_id": str(user.id),
                "org_id": str(org.id),
            }
        )
