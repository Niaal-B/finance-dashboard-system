from django.contrib import admin
from .models import CustomUser


@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'role', 'status', 'is_active', 'date_joined']
    list_filter = ['role', 'status', 'is_active']
    search_fields = ['username', 'email']
    ordering = ['-date_joined']
    readonly_fields = ['date_joined', 'last_login', 'created_at', 'updated_at']
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Role & Status', {'fields': ('role', 'status', 'is_active')}),
        ('Timestamps', {'fields': ('date_joined', 'last_login', 'created_at', 'updated_at')}),
    )
