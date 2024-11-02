from django.db import models
from django.db.models import Sum, F
from django.utils.timezone import now, timedelta
from django.db.models.functions import TruncMonth, TruncDay
import uuid

from sales.models import SalesDetail


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
    min_stock = models.IntegerField(blank=True)
    max_stock = models.IntegerField(blank=True)

    alert_level = models.IntegerField(default=0, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.product.name} - {self.warehouse.name}'
    
    def save(self, *args, **kwargs):

        self.min_stock = self.stock // 2 if not self.min_stock else self.min_stock
        self.max_stock = int(self.stock * 1.5) if not self.max_stock else self.max_stock

        if self.alert_level == 0:
            self.alert_level = int(((self.max_stock - self.min_stock) * 0.25) + self.min_stock)

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
    
    def get_sales_data(self):
        today = now().date()
        six_months_ago = today - timedelta(days=180)
        start_of_month = today.replace(day=1)
        
        sales = SalesDetail.objects.filter(
            product=self.product,
            created_at__gte=six_months_ago
        ).aggregate(
            sales_day=Sum('quantity', filter=models.Q(created_at__date=today)),
            sales_month=Sum('quantity', filter=models.Q(created_at__gte=start_of_month)),
            total_sales=Sum('quantity'),
            revenue=Sum(F('quantity') * F('unit_price'))
        )
        
        # Calculate average sales per day and per month over the last six months
        daily_sales = SalesDetail.objects.filter(
            product=self.product,
            created_at__gte=six_months_ago
        ).annotate(day=TruncDay('created_at')).values('day').annotate(daily_total=Sum('quantity')).order_by()
        
        monthly_sales = SalesDetail.objects.filter(
            product=self.product,
            created_at__gte=six_months_ago
        ).annotate(month=TruncMonth('created_at')).values('month').annotate(monthly_total=Sum('quantity')).order_by()
        
        total_days = (today - six_months_ago).days
        total_months = 6
        
        average_sales_day = sum([sale['daily_total'] for sale in daily_sales]) / total_days if total_days > 0 else 0
        average_sales_month = sum([sale['monthly_total'] for sale in monthly_sales]) / total_months if total_months > 0 else 0
        
        sales.update({
            'average_sales_day': average_sales_day,
            'average_sales_month': average_sales_month
        })
        
        return sales