from django.db import models
from django.contrib.auth.models import AbstractUser
from core.mixins import TimestampMixin

class CustomUser(AbstractUser, TimestampMixin):
    class Role(models.TextChoices):
        ADMIN = 'ADMIN', 'Admin'
        ANALYST = 'ANALYST', 'Analyst'
        VIEWER = 'VIEWER', 'Viewer'

    class Status(models.TextChoices):
        ACTIVE = 'ACTIVE', 'Active'
        INACTIVE = 'INACTIVE', 'Inactive'

    role = models.CharField(
        max_length=10,
        choices=Role.choices,
        default=Role.VIEWER
    )
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.ACTIVE
    )

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
