from rest_framework import permissions

class BaseRolePermission(permissions.BasePermission):
    """
    Base class for role-based permissions.
    """
    REQUIRED_ROLES = []

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        return request.user.role in self.REQUIRED_ROLES

class IsAdminOnly(BaseRolePermission):
    REQUIRED_ROLES = ['ADMIN']

class IsAnalyst(BaseRolePermission):
    REQUIRED_ROLES = ['ADMIN', 'ANALYST']

class IsViewer(BaseRolePermission):
    REQUIRED_ROLES = ['ADMIN', 'ANALYST', 'VIEWER']

class IsOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
