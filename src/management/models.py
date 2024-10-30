from django.db import models

# Create your models here.
class Location(models.Model):
    address = models.CharField(max_length=200)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    zip_code = models.CharField(max_length=100, null=True, blank=True)


class Warehouse(models.Model):
    name = models.CharField(max_length=100)
    is_refrigerated = models.BooleanField(default=False, null=True, blank=True)

    address = models.CharField(max_length=200)
    location = models.ForeignKey(Location, related_name='warehouses', null=True, blank=True, default=None, on_delete=models.CASCADE)

    is_active = models.BooleanField(default=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Transfer(models.Model):
    product = models.ForeignKey('products.Product', related_name='transfers', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    sent_date = models.DateField(auto_now=False, auto_now_add=False)
    received_date = models.DateField(auto_now=False, auto_now_add=False, null=True, blank=True)

    from_warehouse = models.ForeignKey('Warehouse', related_name='transfers_sent', on_delete=models.CASCADE)
    to_warehouse = models.ForeignKey('Warehouse', related_name='transfers_received', on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Provider(models.Model):
    name = models.CharField(max_length=100)

    email = models.EmailField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=100, null=True, blank=True)

    address = models.CharField(max_length=200, null=True, blank=True)
    location = models.ForeignKey(Location, related_name='providers', null=True, blank=True, default=None, on_delete=models.CASCADE)


