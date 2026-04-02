from django.db.models import Sum, Q
from decimal import Decimal
from finance.models import FinancialRecord

class AnalyticsService:
    @staticmethod
    def get_user_summary(user):
        """
        Calculate total income, expenses, net balance, and category breakdown for a user.
        """
        records = FinancialRecord.objects.filter(user=user)
        
        # Aggregate totals
        aggregates = records.aggregate(
            total_income=Sum('amount', filter=Q(record_type='INCOME'), default=Decimal('0.00')),
            total_expenses=Sum('amount', filter=Q(record_type='EXPENSE'), default=Decimal('0.00'))
        )
        
        total_income = aggregates['total_income']
        total_expenses = aggregates['total_expenses']
        net_balance = total_income - total_expenses
        
        # Category Breakdown
        category_data = (
            records.values('category', 'record_type')
            .annotate(total=Sum('amount'))
            .order_by('-total')
        )
        
        return {
            "total_income": total_income,
            "total_expenses": total_expenses,
            "net_balance": net_balance,
            "category_breakdown": list(category_data)
        }
