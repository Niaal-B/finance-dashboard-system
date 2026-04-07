from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['role'] = user.role
        token['username'] = user.username
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Block inactive users from receiving tokens
        if self.user.status == 'INACTIVE':
            raise serializers.ValidationError(
                "This account has been deactivated. Please contact an administrator."
            )
        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    role = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']

    def create(self, validated_data):
        # Force default role to VIEWER — roles are only assignable by Admins
        validated_data['role'] = 'VIEWER'
        user = User.objects.create_user(**validated_data)
        return user


class BasicUserSerializer(serializers.ModelSerializer):
    """
    Read-only serializer for listing users. Used by admin endpoints.
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'status', 'is_active', 'date_joined']
