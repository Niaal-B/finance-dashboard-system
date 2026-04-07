from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal
from datetime import date
from finance.models import FinancialRecord

User = get_user_model()


def create_analyst(username='analyst_analytics'):
    user = User.objects.create_user(username=username, password='testpass123', email=f'{username}@test.com')
    user.role = 'ANALYST'
    user.status = 'ACTIVE'
    user.save()
    return user


class AnalyticsSummaryTest(TestCase):
    """Dashboard summary returns correct totals and includes trends data."""

    def setUp(self):
        self.client = APIClient()
        self.user = create_analyst()
        # Create sample records
        FinancialRecord.objects.create(
            user=self.user, amount=Decimal('1000.00'),
            record_type='INCOME', category='Salary', date=date.today()
        )
        FinancialRecord.objects.create(
            user=self.user, amount=Decimal('300.00'),
            record_type='EXPENSE', category='Rent', date=date.today()
        )
        response = self.client.post('/api/users/login/', {'username': self.user.username, 'password': 'testpass123'})
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")

    def test_summary_totals_are_correct(self):
        response = self.client.get('/api/analytics/dashboard/summary/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertEqual(Decimal(str(data['total_income'])), Decimal('1000.00'))
        self.assertEqual(Decimal(str(data['total_expenses'])), Decimal('300.00'))
        self.assertEqual(Decimal(str(data['net_balance'])), Decimal('700.00'))

    def test_summary_includes_trends(self):
        response = self.client.get('/api/analytics/dashboard/summary/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.data
        self.assertIn('monthly_trends', data)
        self.assertIn('weekly_trends', data)
        self.assertIn('category_breakdown', data)

    def test_summary_monthly_trends_structure(self):
        response = self.client.get('/api/analytics/dashboard/summary/')
        monthly = response.data['monthly_trends']
        self.assertIsInstance(monthly, list)
        if monthly:
            self.assertIn('month', monthly[0])
            self.assertIn('record_type', monthly[0])
            self.assertIn('total', monthly[0])
