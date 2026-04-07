from django.db.models import Sum, Q
from django.db.models.functions import TruncMonth, TruncWeek
from decimal import Decimal
from finance.models import FinancialRecord


class AnalyticsService:

    @staticmethod
    def get_summary():
        """
        Shared ledger analytics — aggregates across ALL financial records,
        not scoped to a specific user. Every authenticated user sees the same numbers.
        """
        records = FinancialRecord.objects.all()

        # --- Aggregate totals ---
        aggregates = records.aggregate(
            total_income=Sum('amount', filter=Q(record_type='INCOME'), default=Decimal('0.00')),
            total_expenses=Sum('amount', filter=Q(record_type='EXPENSE'), default=Decimal('0.00'))
        )

        total_income = aggregates['total_income']
        total_expenses = aggregates['total_expenses']
        net_balance = total_income - total_expenses

        # --- Category breakdown ---
        category_data = (
            records.values('category', 'record_type')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )

        # --- Monthly trends ---
        monthly_trends = (
            records.annotate(month=TruncMonth('date'))
            .values('month', 'record_type')
            .annotate(total=Sum('amount'))
            .order_by('month')
        )

        # --- Weekly trends ---
        weekly_trends = (
            records.annotate(week=TruncWeek('date'))
            .values('week', 'record_type')
            .annotate(total=Sum('amount'))
            .order_by('week')
        )

        return {
            "total_income": total_income,
            "total_expenses": total_expenses,
            "net_balance": net_balance,
            "category_breakdown": list(category_data),
            "monthly_trends": list(monthly_trends),
            "weekly_trends": list(weekly_trends),
        }
