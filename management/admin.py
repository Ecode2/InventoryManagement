from django.contrib import admin

# Register your models here.
from .models import Warehouse, Provider, Transfer, Location

admin.site.register(Warehouse)
admin.site.register(Provider)
admin.site.register(Transfer)
admin.site.register(Location)