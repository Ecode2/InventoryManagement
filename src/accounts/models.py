from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

# Create your models here.

class User(AbstractUser):
    ADMIN = 'admin'
    STAFF = 'staff'
    CUSTOMER = 'customer'

    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (STAFF, 'Staff'),
        (CUSTOMER, 'Customer'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=CUSTOMER)
    phone_number = models.CharField(max_length=100, null=True, blank=True)
    user_uuid = models.UUIDField(default=uuid.uuid1, editable=False, unique=True)
    store = models.ForeignKey("management.Warehouse", null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.username

    def get_full_name(self):
        if self.first_name or self.last_name:
            return f'{self.first_name} {self.last_name}'
        
        elif self.username:
            return self.username
        
        else:
            return self.email
        
    