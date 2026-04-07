from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal
from datetime import date

User = get_user_model()


def create_user(username, role='VIEWER'):
    user = User.objects.create_user(username=username, password='testpass123', email=f'{username}@test.com')
    user.role = role
    user.status = 'ACTIVE'
    user.save()
    return user


def auth_client(client, username):
    response = client.post('/api/users/login/', {'username': username, 'password': 'testpass123'})
    client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
    return client


RECORD_PAYLOAD = {
    'amount': '500.00',
    'record_type': 'INCOME',
    'category': 'Salary',
    'date': str(date.today()),
    'currency': 'USD',
}


class ViewerRBACTest(TestCase):
    """Viewers can read records but cannot create, update, or delete them."""

    def setUp(self):
        self.client = APIClient()
        self.viewer = create_user('viewer1', role='VIEWER')

    def test_viewer_can_list_records(self):
        auth_client(self.client, 'viewer1')
        response = self.client.get('/api/finance/records/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_viewer_cannot_create_record(self):
        auth_client(self.client, 'viewer1')
        response = self.client.post('/api/finance/records/', RECORD_PAYLOAD)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class AnalystRBACTest(TestCase):
    """Analysts can create, update, and delete their own records."""

    def setUp(self):
        self.client = APIClient()
        self.analyst = create_user('analyst1', role='ANALYST')

    def test_analyst_can_create_record(self):
        auth_client(self.client, 'analyst1')
        response = self.client.post('/api/finance/records/', RECORD_PAYLOAD)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_analyst_can_delete_own_record(self):
        auth_client(self.client, 'analyst1')
        create_response = self.client.post('/api/finance/records/', RECORD_PAYLOAD)
        record_id = create_response.data['id']
        delete_response = self.client.delete(f'/api/finance/records/{record_id}/')
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)


class FilteringTest(TestCase):
    """Records can be filtered by type, category, and date."""

    def setUp(self):
        from finance.models import FinancialRecord
        self.client = APIClient()
        self.analyst = create_user('analystfilter', role='ANALYST')
        auth_client(self.client, 'analystfilter')
        # Create two records
        self.client.post('/api/finance/records/', RECORD_PAYLOAD)
        self.client.post('/api/finance/records/', {**RECORD_PAYLOAD, 'record_type': 'EXPENSE', 'amount': '200.00', 'category': 'Rent'})

    def test_filter_by_type(self):
        response = self.client.get('/api/finance/records/?record_type=INCOME')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        for rec in response.data['results']:
            self.assertEqual(rec['record_type'], 'INCOME')

    def test_search_by_category(self):
        response = self.client.get('/api/finance/records/?search=Rent')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response.data['results']), 0)
