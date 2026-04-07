from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    BasicUserSerializer,
)
from core.permissions import IsAdminOnly
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True))
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class CustomTokenRefreshView(TokenRefreshView):
    @method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=True))
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

    @method_decorator(ratelimit(key='ip', rate='3/h', method='POST', block=True))
    def post(self, request, *args, **kwargs):
        return super().post(request, *args, **kwargs)


class LogoutView(APIView):
    """
    Blacklists the provided refresh token, effectively logging the user out.
    Client should also discard the access token locally.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {"error": "A refresh token is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserListView(generics.ListAPIView):
    """
    List all users. Admin only.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = BasicUserSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOnly]


class UserRoleUpdateView(generics.UpdateAPIView):
    """
    Allow admins to update a user's role.
    """
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdminOnly]

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        new_role = request.data.get('role')
        valid_roles = [choice[0] for choice in User.Role.choices]
        if new_role not in valid_roles:
            return Response(
                {"error": f"Invalid role. Must be one of: {valid_roles}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.role = new_role
        user.save(update_fields=['role', 'updated_at'])
        return Response({"status": "role updated", "role": user.role})


class UserStatusUpdateView(generics.UpdateAPIView):
    """
    Allow admins to activate or deactivate a user account.
    """
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdminOnly]

    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        new_status = request.data.get('status')
        valid_statuses = [choice[0] for choice in User.Status.choices]
        if new_status not in valid_statuses:
            return Response(
                {"error": f"Invalid status. Must be one of: {valid_statuses}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.status = new_status
        # Also sync Django's built-in is_active flag
        user.is_active = (new_status == 'ACTIVE')
        user.save(update_fields=['status', 'is_active', 'updated_at'])
        return Response({"status": "user status updated", "new_status": user.status})
