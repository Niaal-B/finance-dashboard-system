from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .services import AnalyticsService
from finance.models import FinancialRecord
from finance.serializers import FinancialRecordSerializer

class DashboardSummaryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        summary = AnalyticsService.get_user_summary(request.user)
        return Response(summary)

class RecentActivityView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = FinancialRecordSerializer

    def get_queryset(self):
        # Return last 5 records across the system for this user
        return FinancialRecord.objects.filter(user=self.request.user).order_by('-date', '-created_at')[:5]
