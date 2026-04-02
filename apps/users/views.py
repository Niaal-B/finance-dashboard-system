from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework import generics, permissions
from rest_framework.response import Response
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
from .serializers import CustomTokenObtainPairSerializer, UserRegistrationSerializer
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

class UserRoleUpdateView(generics.UpdateAPIView):
    """
    Allow admins to update user roles.
    """
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdminOnly]
    
    def patch(self, request, *args, **kwargs):
        user = self.get_object()
        new_role = request.data.get('role')
        if new_role not in ['ADMIN', 'ANALYST', 'VIEWER']:
            return Response({"error": "Invalid role"}, status=400)
        user.role = new_role
        user.save()
        return Response({"status": "role updated", "role": user.role})
