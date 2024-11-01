from django.db import models
from django.conf import settings
import uuid

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    sku = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    bar_code = models.SlugField(unique=True, default=None, null=True)

    name = models.CharField(max_length=200)
    description = models.TextField(null=True, blank=True)
    category = models.ManyToManyField(Category, related_name='products', default=None)

    recorder_quantity = models.IntegerField(blank=True, default=1)
    recorder_quantity_name = models.CharField(max_length=100, null=True, default=None)

    cost_price = models.DecimalField(max_digits=100, decimal_places=2, default=0.00)
    selling_price  = models.DecimalField(max_digits=100, decimal_places=2, default=0.00)

    weight = models.DecimalField(max_digits=100, decimal_places=2, null=True, default=None)
    height = models.DecimalField(max_digits=100, decimal_places=2, null=True, default=None)
    width = models.DecimalField(max_digits=100, decimal_places=2, null=True, default=None)
    depth = models.DecimalField(max_digits=100, decimal_places=2, null=True, default=None)
    refriderated = models.DecimalField(max_digits=100, decimal_places=2, null=True, default=None)

    is_active = models.BooleanField(default=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def display_name(self):
        return self.name

    @property
    def display_price(self):
        return self.price
    
    def __str__(self):
        return self.name
    


def handle_product_attachment_upload(instance, filename):
    return f"products/{instance.product.name}/files/{filename}"

class ProductFile(models.Model):
    product = models.ForeignKey(Product, related_name='files', on_delete=models.CASCADE)
    file = models.FileField(upload_to=handle_product_attachment_upload)

    def __str__(self):
        return f'{self.product.name} - {self.file.name}'


class Inventory(models.Model):
    product = models.ForeignKey(Product, related_name='inventories', on_delete=models.CASCADE)
    warehouse = models.ForeignKey('management.Warehouse', related_name='inventories', on_delete=models.CASCADE)

    stock = models.IntegerField(default=1)
    min_stock = models.IntegerField(default=1)
    max_stock = models.IntegerField(default=1)

    alert_level = models.IntegerField(default=0, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.product.name} - {self.warehouse.name}'
    
    def save(self, *args, **kwargs):
        if self.alert_level == 0:
            self.alert_level = int(self.min_stock + 0.25 * (self.max_stock - self.min_stock))

        if self.stock < self.alert_level:
            # send email and notification
            pass
        return super().save(*args, **kwargs)


    def reduce_stock(self, quantity):
        self.stock -= quantity
        self.save()
        return self.stock
    
    def increase_stock(self, quantity):
        self.stock += quantity
        self.save()
        return self.stock
    
    def update_stock(self, quantity):
        self.stock = quantity
        self.save()
        return self.stock
    
    def update_alert_level(self, alert_level):
        self.alert_level = alert_level
        self.save()
        return self.alert_level
    
    def update_stock_levels(self, min_stock=None, max_stock=None):
        self.min_stock = min_stock if min_stock and min_stock < max_stock else self.min_stock
        self.max_stock = max_stock if max_stock and max_stock > min_stock else self.max_stock
        self.save()
        return self.min_stock, self.max_stock