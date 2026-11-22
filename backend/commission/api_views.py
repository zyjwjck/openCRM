"""Commission API.

Visibility: sales people (non-admin) can only see entries credited to their
own Profile. Admin can see everything (to be refined when requirements are
confirmed).

Policy mutations (create/update/delete) and recalculation are restricted to
org admins; non-admins get HTTP 403. Dangerous actions (delete / recalculate)
additionally require explicit confirmation (confirm=true).
"""

import json
from decimal import Decimal, InvalidOperation

from django.db import transaction
from django.db.models import Q, Sum
from drf_spectacular.utils import extend_schema
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from common.permissions import HasOrgContext

from commission.api_helpers import visible_entries
from commission.constants import CONFIRM_REQUIRED_ACTIONS
from commission.models import CommissionCreditRule, CommissionEntry, CommissionPolicy, CommissionTier
from commission.serializers import (
    CommissionCreditRuleSerializer,
    CommissionEntrySerializer,
    CommissionPolicySerializer,
    CommissionPolicyWriteSerializer,
    CommissionTierSerializer,
)
from commission.services import recalculate_invoice


def _confirm_ok(request, action):
    if action not in CONFIRM_REQUIRED_ACTIONS:
        return True
    value = request.data.get("confirm") or request.query_params.get("confirm")
    return str(value).lower() in ("1", "true", "yes")


def _is_admin(request):
    """Only org admins may modify commission policies."""
    return request.profile.role == "ADMIN" or getattr(request.user, "is_superuser", False)


def _deny_if_not_admin(request):
    return Response(
        {"error": True, "message": "Only administrators can modify commission policies"},
        status=status.HTTP_403_FORBIDDEN,
    ) if not _is_admin(request) else None


def _check_credit_splits(data):
    """Each role share must be 0-100 and a policy's shares must total 100."""
    rules = data.get("credit_rules", [])
    if isinstance(rules, str):
        try:
            rules = json.loads(rules)
        except (ValueError, TypeError):
            return Response({"error": True, "message": "Invalid credit rules format"}, status=400)
    if not isinstance(rules, list) or not rules:
        return None

    total = Decimal("0")
    for rule in rules:
        if not isinstance(rule, dict):
            return Response({"error": True, "message": "Invalid credit rule"}, status=400)
        try:
            share = Decimal(str(rule.get("share_percent", 0)))
        except (InvalidOperation, TypeError, ValueError):
            return Response({"error": True, "message": "Invalid share percent"}, status=400)
        if share < 0 or share > 100:
            return Response(
                {"error": True, "message": "Each share percent must be between 0 and 100"},
                status=400,
            )
        total += share

    if total != Decimal("100"):
        return Response(
            {"error": True, "message": f"Credit rule shares must total 100% (currently {total}%)"},
            status=400,
        )
    return None


class CommissionPolicyListView(APIView, LimitOffsetPagination):
    permission_classes = (IsAuthenticated, HasOrgContext)

    @extend_schema(tags=["Commission"], operation_id="commission_policies_list")
    def get(self, request):
        queryset = CommissionPolicy.objects.filter(org=request.profile.org).select_related("product")
        if request.query_params.get("is_active"):
            flag = request.query_params.get("is_active").lower() == "true"
            queryset = queryset.filter(is_active=flag)
        search = request.query_params.get("search")
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(code__icontains=search))
        results = self.paginate_queryset(queryset, request, view=self)
        return Response(
            {
                "count": self.count,
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "results": CommissionPolicySerializer(results, many=True).data,
            }
        )

    @extend_schema(tags=["Commission"], operation_id="commission_policies_create")
    def post(self, request):
        denied = _deny_if_not_admin(request)
        if denied:
            return denied
        serializer = CommissionPolicyWriteSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": True, "errors": serializer.errors}, status=400)
        invalid = _check_credit_splits(request.data)
        if invalid:
            return invalid
        with transaction.atomic():
            policy = serializer.save(org=request.profile.org)
            self._sync_children(policy, request.data)
        return Response(
            {"error": False, "message": "Policy created",
             "policy": CommissionPolicySerializer(policy).data},
            status=status.HTTP_201_CREATED,
        )

    @staticmethod
    def _sync_children(policy, data):
        tiers = data.get("tiers", [])
        if isinstance(tiers, list):
            CommissionTier.objects.filter(policy=policy).delete()
            for tier in tiers:
                CommissionTier.objects.create(policy=policy, **tier)

        rules = data.get("credit_rules", [])
        if isinstance(rules, list):
            CommissionCreditRule.objects.filter(policy=policy).delete()
            for rule in rules:
                CommissionCreditRule.objects.create(policy=policy, **rule)


class CommissionPolicyDetailView(APIView):
    permission_classes = (IsAuthenticated, HasOrgContext)

    def get_object(self, pk, request):
        return CommissionPolicy.objects.filter(pk=pk, org=request.profile.org).first()

    @extend_schema(tags=["Commission"], operation_id="commission_policies_retrieve")
    def get(self, request, pk):
        policy = self.get_object(pk, request)
        if not policy:
            return Response({"error": True, "message": "Policy not found"}, status=404)
        return Response(CommissionPolicySerializer(policy).data)

    @extend_schema(tags=["Commission"], operation_id="commission_policies_update")
    def put(self, request, pk):
        denied = _deny_if_not_admin(request)
        if denied:
            return denied
        policy = self.get_object(pk, request)
        if not policy:
            return Response({"error": True, "message": "Policy not found"}, status=404)
        serializer = CommissionPolicyWriteSerializer(policy, data=request.data, partial=True)
        if not serializer.is_valid():
            return Response({"error": True, "errors": serializer.errors}, status=400)
        invalid = _check_credit_splits(request.data)
        if invalid:
            return invalid
        with transaction.atomic():
            policy = serializer.save()
            CommissionPolicyListView._sync_children(policy, request.data)
        return Response(
            {"error": False, "message": "Policy updated",
             "policy": CommissionPolicySerializer(policy).data}
        )

    @extend_schema(tags=["Commission"], operation_id="commission_policies_delete")
    def delete(self, request, pk):
        denied = _deny_if_not_admin(request)
        if denied:
            return denied
        if not _confirm_ok(request, "delete"):
            return Response(
                {"error": True, "message": "Deletion requires confirmation (confirm=true)"},
                status=400,
            )
        policy = self.get_object(pk, request)
        if not policy:
            return Response({"error": True, "message": "Policy not found"}, status=404)
        with transaction.atomic():
            CommissionTier.objects.filter(policy=policy).delete()
            CommissionCreditRule.objects.filter(policy=policy).delete()
            policy.delete()
        return Response({"error": False, "message": "Policy deleted"})


class CommissionEntryListView(APIView, LimitOffsetPagination):
    permission_classes = (IsAuthenticated, HasOrgContext)

    @extend_schema(tags=["Commission"], operation_id="commission_entries_list")
    def get(self, request):
        queryset = visible_entries(request)
        stage = request.query_params.get("stage")
        if stage:
            queryset = queryset.filter(stage=stage)
        profile_id = request.query_params.get("profile")
        if profile_id:
            queryset = queryset.filter(profile_id=profile_id)
        invoice_id = request.query_params.get("invoice")
        if invoice_id:
            queryset = queryset.filter(invoice_id=invoice_id)
        start = request.query_params.get("start_date")
        end = request.query_params.get("end_date")
        if start:
            queryset = queryset.filter(created_at__date__gte=start)
        if end:
            queryset = queryset.filter(created_at__date__lte=end)

        results = self.paginate_queryset(queryset, request, view=self)
        return Response(
            {
                "count": self.count,
                "next": self.get_next_link(),
                "previous": self.get_previous_link(),
                "results": CommissionEntrySerializer(results, many=True).data,
            }
        )


class CommissionSummaryView(APIView):
    permission_classes = (IsAuthenticated, HasOrgContext)

    @extend_schema(tags=["Commission"], operation_id="commission_summary")
    def get(self, request):
        queryset = visible_entries(request).filter(status="ACTIVE")
        totals = queryset.aggregate(
            provisional=Sum("amount", filter=Q(stage="PROVISIONAL")),
            earned=Sum("amount", filter=Q(stage="EARNED")),
        )
        return Response(
            {
                "provisional": totals["provisional"] or 0,
                "earned": totals["earned"] or 0,
                "total": (totals["provisional"] or 0) + (totals["earned"] or 0),
                "currency": request.profile.org.default_currency or "USD",
            }
        )


class CommissionRecalculateView(APIView):
    permission_classes = (IsAuthenticated, HasOrgContext)

    @extend_schema(tags=["Commission"], operation_id="commission_recalculate")
    def post(self, request, invoice_id):
        denied = _deny_if_not_admin(request)
        if denied:
            return denied
        if not _confirm_ok(request, "recalculate"):
            return Response(
                {"error": True, "message": "Recalculation requires confirmation (confirm=true)"},
                status=400,
            )
        from invoices.models import Invoice

        invoice = Invoice.objects.filter(id=invoice_id, org=request.profile.org).first()
        if not invoice:
            return Response({"error": True, "message": "Invoice not found"}, status=404)
        try:
            created = recalculate_invoice(invoice, confirm=True)
        except ValueError as exc:
            return Response({"error": True, "message": str(exc)}, status=400)
        return Response({"error": False, "created": created})
