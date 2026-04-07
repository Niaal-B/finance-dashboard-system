from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


def create_user(username, password='testpass123', role='VIEWER', user_status='ACTIVE'):
    user = User.objects.create_user(username=username, password=password, email=f'{username}@test.com')
    user.role = role
    user.status = user_status
    user.save()
    return user


def get_tokens_for_user(client, username, password='testpass123'):
    response = client.post('/api/users/login/', {'username': username, 'password': password})
    return response.data


class InactiveUserLoginTest(TestCase):
    """Inactive users should not be able to obtain tokens."""

    def setUp(self):
        self.client = APIClient()
        self.user = create_user('inactiveuser', user_status='INACTIVE')

    def test_inactive_user_cannot_login(self):
        response = self.client.post('/api/users/login/', {
            'username': 'inactiveuser',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_active_user_can_login(self):
        active_user = create_user('activeuser', user_status='ACTIVE')
        response = self.client.post('/api/users/login/', {
            'username': 'activeuser',
            'password': 'testpass123'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)


class UserRoleManagementTest(TestCase):
    """Admins can update roles; non-admins cannot."""

    def setUp(self):
        self.client = APIClient()
        self.admin = create_user('admin1', role='ADMIN')
        self.viewer = create_user('viewer1', role='VIEWER')

    def _auth(self, user):
        tokens = get_tokens_for_user(self.client, user.username)
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {tokens['access']}")

    def test_admin_can_update_user_role(self):
        self._auth(self.admin)
        response = self.client.patch(f'/api/users/{self.viewer.pk}/role/', {'role': 'ANALYST'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.viewer.refresh_from_db()
        self.assertEqual(self.viewer.role, 'ANALYST')

    def test_viewer_cannot_update_roles(self):
        self._auth(self.viewer)
        response = self.client.patch(f'/api/users/{self.admin.pk}/role/', {'role': 'VIEWER'})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_can_deactivate_user(self):
        self._auth(self.admin)
        response = self.client.patch(f'/api/users/{self.viewer.pk}/status/', {'status': 'INACTIVE'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.viewer.refresh_from_db()
        self.assertEqual(self.viewer.status, 'INACTIVE')
