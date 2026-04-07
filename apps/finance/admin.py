from django.contrib import admin
from .models import FinancialRecord


@admin.register(FinancialRecord)
class FinancialRecordAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'record_type', 'amount', 'currency', 'category', 'date', 'created_at']
    list_filter = ['record_type', 'currency', 'category']
    search_fields = ['user__username', 'category', 'description']
    ordering = ['-date']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'date'
