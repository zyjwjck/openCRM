import json
import secrets

from django.contrib.auth.hashers import make_password
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema, inline_serializer

from rest_framework import serializers, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.tokens import RefreshToken

from common import serializer
from common.models import Org, Profile, User
from common.serializer import OrgAwareRefreshToken


class LoginView(APIView):
    """
    Login with email and password, returns JWT tokens
    """

    permission_classes = []
    authentication_classes = []

    @extend_schema(
        description="Login with email and password",
        request=serializer.LoginSerializer,
        responses={
            200: {
                "type": "object",
                "properties": {
                    "access_token": {"type": "string"},
                    "refresh_token": {"type": "string"},
                    "user": {
                        "type": "object",
                        "properties": {
                            "id": {"type": "string"},
                            "email": {"type": "string"},
                            "organizations": {"type": "array"},
                        },
                    },
                },
            }
        },
    )
    def post(self, request):
        from django.utils import timezone

        from common.audit_log import audit_log

        serializer_obj = serializer.LoginSerializer(data=request.data)
        if serializer_obj.is_valid():
            user = serializer_obj.validated_data["user"]

            # Update last_login timestamp
            user.last_login = timezone.now()
            user.save(update_fields=["last_login"])

            # Get user's organizations
            profiles = Profile.objects.filter(user=user, is_active=True)

            # Get the default org (first org or from request)
            org_id = request.data.get("org_id")
            default_org = None

            if org_id:
                # Use specified org if user has access
                try:
                    profile = profiles.get(org_id=org_id)
                    default_org = profile.org
                except Profile.DoesNotExist:
                    audit_log.login_failure(
                        user.email, f"No access to org {org_id}", request
                    )
                    return Response(
                        {
                            "error": "User does not have access to specified organization"
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
            elif profiles.exists():
                # Use first available org
                profile = profiles.first()
                default_org = profile.org

            # Generate JWT tokens with org context (include profile for role)
            if default_org:
                token = OrgAwareRefreshToken.for_user_and_org(
                    user, default_org, profile
                )
            else:
                # User has no orgs - generate token without org context (but with user info)
                token = OrgAwareRefreshToken.for_user_and_org(user, None)

            # Audit log successful login
            audit_log.login_success(user, default_org, request)

            # Get user details with organizations
            user_serializer = serializer.UserDetailSerializer(user)

            response_data = {
                "access_token": str(token.access_token),
                "refresh_token": str(token),
                "user": user_serializer.data,
            }

            # Include current org info if available
            if default_org:
                response_data["current_org"] = {
                    "id": str(default_org.id),
                    "name": default_org.name,
                }

            return Response(response_data, status=status.HTTP_200_OK)

        # Log failed login
        email = request.data.get("email", "unknown")
        audit_log.login_failure(email, str(serializer_obj.errors), request)
        return Response(serializer_obj.errors, status=status.HTTP_400_BAD_REQUEST)


class RegisterView(APIView):
    """
    Register a new user account
    """

    permission_classes = []
    authentication_classes = []

    @extend_schema(
        description="Register a new user account",
        request=serializer.RegisterSerializer,
        responses={
            201: {
                "type": "object",
                "properties": {
                    "message": {"type": "string"},
                    "user_id": {"type": "string"},
                    "email": {"type": "string"},
                },
            }
        },
    )
    def post(self, request):
        serializer_obj = serializer.RegisterSerializer(data=request.data)
        if serializer_obj.is_valid():
            user = serializer_obj.save()
            return Response(
                {
                    "message": "User registered successfully. Please check your email for activation link.",
                    "user_id": str(user.id),
                    "email": user.email,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer_obj.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    """
    Get current authenticated user details
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        description="Get current authenticated user with organizations",
        responses={200: serializer.UserDetailSerializer},
    )
    def get(self, request):
        user_serializer = serializer.UserDetailSerializer(request.user)
        return Response(user_serializer.data, status=status.HTTP_200_OK)


class OrgAwareTokenRefreshView(APIView):
    """
    Custom token refresh that validates org membership.

    When refreshing a token, this view:
    1. Validates the refresh token
    2. Checks that user still has access to the org in the token
    3. Issues new tokens with the same org context

    If membership was revoked, returns 403 and user must login again.
    """

    permission_classes = []
    authentication_classes = []

    @extend_schema(
        description="Refresh access token with org membership validation",
        request=inline_serializer(
            name="OrgAwareTokenRefreshRequest",
            fields={"refresh": serializers.CharField(help_text="Refresh token")},
        ),
        responses={
            200: inline_serializer(
                name="OrgAwareTokenRefreshResponse",
                fields={
                    "access": serializers.CharField(),
                    "refresh": serializers.CharField(),
                },
            )
        },
    )
    def post(self, request):
        from rest_framework_simplejwt.exceptions import TokenError
        from rest_framework_simplejwt.tokens import RefreshToken as BaseRefreshToken

        from common.audit_log import audit_log

        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response(
                {"error": "Refresh token is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            # Decode and validate refresh token
            token = BaseRefreshToken(refresh_token)
            user_id = token["user_id"]
            org_id = token.get("org_id")

            # Get user
            user = User.objects.get(id=user_id)

            if not user.is_active:
                return Response(
                    {"error": "User account is disabled"},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # If token has org context, validate membership
            if org_id:
                try:
                    profile = Profile.objects.get(
                        user=user, org_id=org_id, is_active=True
                    )
                    org = profile.org
                except Profile.DoesNotExist:
                    # Membership revoked - user must login again
                    audit_log.token_revoked(
                        user, None, f"Membership revoked for org {org_id}", request
                    )
                    return Response(
                        {
                            "error": "Organization membership revoked. Please login again."
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )

                # Generate new tokens with same org context (include profile for role)
                new_token = OrgAwareRefreshToken.for_user_and_org(user, org, profile)
                audit_log.token_refresh(user, org, request)
            else:
                # No org context - refresh with user info only
                new_token = OrgAwareRefreshToken.for_user_and_org(user, None)
                audit_log.token_refresh(user, None, request)

            return Response(
                {"access": str(new_token.access_token), "refresh": str(new_token)},
                status=status.HTTP_200_OK,
            )

        except TokenError:
            return Response(
                {"error": "Invalid or expired token"},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_401_UNAUTHORIZED
            )


class OrgSwitchView(APIView):
    """
    Switch to a different organization and get new JWT tokens.

    This endpoint validates that the user has access to the target
    organization and issues new tokens with the org_id claim.
    """

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    @extend_schema(
        description="Switch to a different organization and get new JWT tokens",
        request=inline_serializer(
            name="OrgSwitchRequest",
            fields={
                "org_id": serializers.UUIDField(help_text="Target organization ID")
            },
        ),
        responses={
            200: inline_serializer(
                name="OrgSwitchResponse",
                fields={
                    "access_token": serializers.CharField(),
                    "refresh_token": serializers.CharField(),
                    "current_org": serializers.DictField(),
                    "profile": serializers.DictField(),
                },
            )
        },
    )
    def post(self, request):
        from common.audit_log import audit_log

        org_id = request.data.get("org_id")

        if not org_id:
            return Response(
                {"error": "org_id is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        # Get current org for audit logging
        from_org = getattr(request, "org", None)

        # Validate user has access to the target org
        try:
            profile = Profile.objects.get(
                user=request.user, org_id=org_id, is_active=True
            )
        except Profile.DoesNotExist:
            audit_log.permission_denied(
                request.user, from_org, "ORG_SWITCH", f"org:{org_id}", request
            )
            return Response(
                {"error": "User does not have access to this organization"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Generate new tokens with the target org (include profile for role)
        token = OrgAwareRefreshToken.for_user_and_org(
            request.user, profile.org, profile
        )

        # Audit log the org switch
        audit_log.org_switch(request.user, from_org, profile.org, request)

        return Response(
            {
                "access_token": str(token.access_token),
                "refresh_token": str(token),
                "current_org": {"id": str(profile.org.id), "name": profile.org.name},
                "profile": {
                    "id": str(profile.id),
                    "role": profile.role,
                    "is_organization_admin": profile.is_organization_admin,
                },
            },
            status=status.HTTP_200_OK,
        )
