from rest_framework import viewsets, permissions
from django.db import transaction
from .models import FinancialRecord
from .serializers import FinancialRecordSerializer
from .filters import FinancialRecordFilter
from core.permissions import IsOwner

class FinancialRecordViewSet(viewsets.ModelViewSet):
    """
    ViewSet for viewing and editing financial records.
    Only the owner of a record can see or modify it.
    """
    serializer_class = FinancialRecordSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]
    filterset_class = FinancialRecordFilter
    search_fields = ['description', 'category']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date']

    def get_queryset(self):
        # Ensure users only see their own records
        return FinancialRecord.objects.filter(user=self.request.user)

    @transaction.atomic
    def perform_create(self, serializer):
        # Automatically set the user to the current authenticated user
        serializer.save(user=self.request.user)

    @transaction.atomic
    def perform_update(self, serializer):
        serializer.save()

    @transaction.atomic
    def perform_destroy(self, instance):
        instance.delete()
