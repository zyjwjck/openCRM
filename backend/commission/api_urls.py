from django.urls import path

from commission import api_views

app_name = "api_commission"

urlpatterns = [
    path("policies/", api_views.CommissionPolicyListView.as_view(), name="policy_list"),
    path(
        "policies/<uuid:pk>/",
        api_views.CommissionPolicyDetailView.as_view(),
        name="policy_detail",
    ),
    path("entries/", api_views.CommissionEntryListView.as_view(), name="entry_list"),
    path("summary/", api_views.CommissionSummaryView.as_view(), name="summary"),
    path(
        "invoices/<uuid:invoice_id>/recalculate/",
        api_views.CommissionRecalculateView.as_view(),
        name="recalculate",
    ),
]
