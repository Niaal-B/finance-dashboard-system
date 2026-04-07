from rest_framework import viewsets, permissions
from django.db import transaction
from .models import FinancialRecord
from .serializers import FinancialRecordSerializer
from .filters import FinancialRecordFilter
from core.permissions import IsAnalyst


class FinancialRecordViewSet(viewsets.ModelViewSet):
    """
    ViewSet for the shared financial ledger.

    All authenticated users can view all records (shared internal tool).
    Only Analysts and Admins can create, update, or delete records.
    The `user` field tracks who entered each record (audit trail).
    """
    serializer_class = FinancialRecordSerializer
    filterset_class = FinancialRecordFilter
    search_fields = ['description', 'category']
    ordering_fields = ['date', 'amount', 'created_at']
    ordering = ['-date']

    def get_queryset(self):
        # Shared ledger — all users see the same pool of records
        return FinancialRecord.objects.all()

    def get_permissions(self):
        """
        - Write actions (create/update/delete) require Analyst or Admin role.
        - Read actions (list/retrieve) require only authentication.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAnalyst()]
        return [permissions.IsAuthenticated()]

    @transaction.atomic
    def perform_create(self, serializer):
        # Track who entered the record (audit trail) but don't restrict visibility
        serializer.save(user=self.request.user)

    @transaction.atomic
    def perform_update(self, serializer):
        serializer.save()

    @transaction.atomic
    def perform_destroy(self, instance):
        instance.delete()
