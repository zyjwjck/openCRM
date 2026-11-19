from rest_framework import serializers

from commission.models import CommissionCreditRule, CommissionEntry, CommissionPolicy, CommissionTier


class CommissionTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionTier
        fields = ("id", "min_amount", "max_amount", "rate", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class CommissionCreditRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionCreditRule
        fields = ("id", "role", "share_percent", "created_at", "updated_at")
        read_only_fields = ("id", "created_at", "updated_at")


class CommissionPolicySerializer(serializers.ModelSerializer):
    tiers = CommissionTierSerializer(many=True, read_only=True)
    credit_rules = CommissionCreditRuleSerializer(many=True, read_only=True)

    class Meta:
        model = CommissionPolicy
        fields = (
            "id",
            "name",
            "code",
            "scope",
            "product",
            "category",
            "base_type",
            "customer_scope",
            "rate",
            "use_tiers",
            "min_base_amount",
            "cap_amount",
            "floor_amount",
            "exclude_negative_margin",
            "priority",
            "is_active",
            "effective_from",
            "effective_to",
            "notes",
            "tiers",
            "credit_rules",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")


class CommissionPolicyWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionPolicy
        fields = (
            "name",
            "code",
            "scope",
            "product",
            "category",
            "base_type",
            "customer_scope",
            "rate",
            "use_tiers",
            "min_base_amount",
            "cap_amount",
            "floor_amount",
            "exclude_negative_margin",
            "priority",
            "is_active",
            "effective_from",
            "effective_to",
            "notes",
        )


class TierWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionTier
        fields = ("min_amount", "max_amount", "rate")


class CreditRuleWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionCreditRule
        fields = ("role", "share_percent")


class CommissionEntrySerializer(serializers.ModelSerializer):
    profile_name = serializers.SerializerMethodField()
    invoice_number = serializers.CharField(source="invoice.invoice_number", read_only=True)

    class Meta:
        model = CommissionEntry
        fields = (
            "id",
            "invoice",
            "invoice_number",
            "invoice_item",
            "payment",
            "profile",
            "profile_name",
            "role",
            "stage",
            "status",
            "policy_name_snapshot",
            "base_amount",
            "rate",
            "gross_amount",
            "share_percent",
            "amount",
            "currency",
            "customer_type",
            "reason",
            "created_at",
        )
        read_only_fields = fields

    def get_profile_name(self, obj):
        if not obj.profile:
            return ""
        return obj.profile.user.username if obj.profile.user_id else str(obj.profile.id)
