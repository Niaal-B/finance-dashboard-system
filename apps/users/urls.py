from django.urls import path
from .views import CustomTokenObtainPairView, CustomTokenRefreshView, RegisterView, UserRoleUpdateView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('<int:pk>/role/', UserRoleUpdateView.as_view(), name='user_role_update'),
]
