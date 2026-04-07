"""
Management command: seed_data

Creates demo users (Admin / Analyst / Viewer) and sample financial records
so reviewers can explore the system immediately after deployment.

Usage:
    python manage.py seed_data

The command is idempotent — safe to run multiple times.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from finance.models import FinancialRecord
from decimal import Decimal
from datetime import date, timedelta
import random

User = get_user_model()

DEMO_USERS = [
    {
        'username': 'admin_demo',
        'email': 'admin@zorvyn.demo',
        'password': 'Admin@1234',
        'role': 'ADMIN',
        'status': 'ACTIVE',
        'is_staff': True,
        'is_superuser': True,
    },
    {
        'username': 'analyst_demo',
        'email': 'analyst@zorvyn.demo',
        'password': 'Analyst@1234',
        'role': 'ANALYST',
        'status': 'ACTIVE',
        'is_staff': False,
        'is_superuser': False,
    },
    {
        'username': 'viewer_demo',
        'email': 'viewer@zorvyn.demo',
        'password': 'Viewer@1234',
        'role': 'VIEWER',
        'status': 'ACTIVE',
        'is_staff': False,
        'is_superuser': False,
    },
]

SAMPLE_RECORDS = [
    # Income
    ('Salary', 'INCOME', Decimal('5000.00'), 'Monthly salary payment'),
    ('Freelance', 'INCOME', Decimal('1200.00'), 'UI design project'),
    ('Dividends', 'INCOME', Decimal('340.50'), 'Quarterly stock dividends'),
    ('Bonus', 'INCOME', Decimal('800.00'), 'Q1 performance bonus'),
    ('Rent Income', 'INCOME', Decimal('950.00'), 'Apartment rental income'),
    # Expenses
    ('Rent', 'EXPENSE', Decimal('1500.00'), 'Monthly apartment rent'),
    ('Groceries', 'EXPENSE', Decimal('220.75'), 'Weekly grocery shopping'),
    ('Utilities', 'EXPENSE', Decimal('85.00'), 'Electricity and water bill'),
    ('Transport', 'EXPENSE', Decimal('60.00'), 'Monthly metro pass'),
    ('Internet', 'EXPENSE', Decimal('45.00'), 'Fiber broadband subscription'),
    ('Dining', 'EXPENSE', Decimal('130.00'), 'Restaurants this month'),
    ('Subscriptions', 'EXPENSE', Decimal('32.99'), 'Streaming and software'),
    ('Healthcare', 'EXPENSE', Decimal('200.00'), 'Doctor visit and medicines'),
    ('Insurance', 'EXPENSE', Decimal('150.00'), 'Health insurance premium'),
    ('Shopping', 'EXPENSE', Decimal('275.00'), 'Clothing and accessories'),
]


class Command(BaseCommand):
    help = 'Seed the database with demo users and sample financial records.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.MIGRATE_HEADING('\n🌱 Seeding demo data...\n'))

        created_users = []

        for data in DEMO_USERS:
            user, created = User.objects.get_or_create(
                username=data['username'],
                defaults={'email': data['email']}
            )
            # Always sync role, status, password and flags regardless of whether user was just created
            user.email = data['email']
            user.role = data['role']
            user.status = data['status']
            user.is_staff = data['is_staff']
            user.is_superuser = data['is_superuser']
            user.set_password(data['password'])
            user.save()
            if created:
                self.stdout.write(self.style.SUCCESS(f'  ✅ Created user: {user.username} ({user.role})'))
            else:
                self.stdout.write(f'  ⚡ Updated user: {user.username} ({user.role})')

            created_users.append(user)

        # Seed one shared pool of records — ONLY if the table is empty
        # This makes the command safe to use as a build command or cron job
        admin_user = next(u for u in created_users if u.role == 'ADMIN')
        today = date.today()

        if FinancialRecord.objects.exists():
            count = FinancialRecord.objects.count()
            self.stdout.write(f'  ⚡ Skipping records — {count} already exist in shared ledger')
        else:
            for i, (category, rtype, base_amount, desc) in enumerate(SAMPLE_RECORDS):
                days_ago = random.randint(0, 180)
                record_date = today - timedelta(days=days_ago)
                amount = base_amount + Decimal(str(round(random.uniform(-20, 20), 2)))
                FinancialRecord.objects.create(
                    user=admin_user,
                    amount=abs(amount),
                    record_type=rtype,
                    category=category,
                    date=record_date,
                    description=desc,
                    currency='USD',
                )
            self.stdout.write(self.style.SUCCESS(
                f'  ✅ Created {len(SAMPLE_RECORDS)} shared records (visible to all users)'
            ))

        self.stdout.write(self.style.SUCCESS('\n✅ Seeding complete!\n'))
        self.stdout.write(self.style.WARNING('Demo credentials:'))
        for u in DEMO_USERS:
            self.stdout.write(f"  {u['role']:<10}  username: {u['username']:<16}  password: {u['password']}")
        self.stdout.write('')
