from django.urls import path
from .views import DashboardSummaryView, RecentActivityView

urlpatterns = [
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
    path('dashboard/recent-activity/', RecentActivityView.as_view(), name='recent-activity'),
]
