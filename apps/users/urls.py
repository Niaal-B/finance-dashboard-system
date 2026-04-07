from django.urls import path
from .views import (
    CustomTokenObtainPairView,
    CustomTokenRefreshView,
    RegisterView,
    LogoutView,
    UserListView,
    UserRoleUpdateView,
    UserStatusUpdateView,
)

urlpatterns = [
    path('', UserListView.as_view(), name='user_list'),
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', LogoutView.as_view(), name='auth_logout'),
    path('<int:pk>/role/', UserRoleUpdateView.as_view(), name='user_role_update'),
    path('<int:pk>/status/', UserStatusUpdateView.as_view(), name='user_status_update'),
]
