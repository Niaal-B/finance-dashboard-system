from django.db import models
from django.conf import settings
from core.mixins import TimestampMixin

class FinancialRecord(TimestampMixin):
    class Type(models.TextChoices):
        INCOME = 'INCOME', 'Income'
        EXPENSE = 'EXPENSE', 'Expense'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='financial_records'
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    record_type = models.CharField(max_length=10, choices=Type.choices)
    date = models.DateField()
    category = models.CharField(max_length=100)
    currency = models.CharField(max_length=3, default='USD')
    description = models.TextField(blank=True, null=True)

    class Meta:
        indexes = [
            models.Index(fields=['date'], name='date_idx'),
            models.Index(fields=['category'], name='category_idx'),
        ]

    def __str__(self):
        return f"{self.record_type} - {self.amount} {self.currency} ({self.date})"
