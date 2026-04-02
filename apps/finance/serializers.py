from rest_framework import serializers
from .models import FinancialRecord

class FinancialRecordSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = FinancialRecord
        fields = [
            'id', 'user', 'amount', 'currency', 'category', 
            'record_type', 'description', 'date', 
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_amount(self, value):
        """
        Check that the amount is positive.
        """
        if value <= 0:
            raise serializers.ValidationError("Amount must be greater than zero.")
        return value

    def validate_date(self, value):
        """
        Prevent future-dated entries.
        """
        from datetime import date
        if value > date.today():
            raise serializers.ValidationError("Transaction date cannot be in the future.")
        return value
