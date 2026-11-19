"""Query helpers for commission visibility.

Sales users see only entries credited to their own Profile. Admins see all
entries in the org. The admin behaviour will be refined later when the user
confirms detailed requirements; for now admins retain full visibility.
"""

from commission.models import CommissionEntry


def visible_entries(request):
    queryset = CommissionEntry.objects.filter(org=request.profile.org)
    role = getattr(request.profile, "role", "USER")
    is_admin = role == "ADMIN" or getattr(request.user, "is_superuser", False)
    if not is_admin:
        queryset = queryset.filter(profile=request.profile)
    return queryset
