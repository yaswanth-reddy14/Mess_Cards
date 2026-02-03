import uuid
import random
from datetime import timedelta

from django.db import models
from django.utils import timezone
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    Group,
    Permission
)
from .manager import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ("STUDENT", "Student"),
        ("OWNER", "Owner"),
    )

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)

    # OPTIONAL — NOT USED FOR OTP ANYMORE
    phone = models.CharField(max_length=10, blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)

    groups = models.ManyToManyField(Group, blank=True)
    user_permissions = models.ManyToManyField(Permission, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["name", "role"]

    objects = UserManager()

    def __str__(self):
        return self.email



# EMAIL OTP MODEL

class EmailOTP(models.Model):
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        """
        OTP valid for 5 minutes
        """
        return timezone.now() > self.created_at + timedelta(minutes=5)

    def __str__(self):
        return f"{self.email} - {self.otp}"



# OTP GENERATOR

def generate_otp():
    return str(random.randint(100000, 999999))
