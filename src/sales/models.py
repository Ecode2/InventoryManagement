from django.db import models
from django.conf import settings
import uuid


# Order status choices
PENDING = 'pending'
DELIVERED = 'delivered'
CANCELLED = 'cancelled'
RETURNED = 'returned'

ORDER_CHOICES = [
    (PENDING, 'Pending'),
    (DELIVERED, 'Delivered'),
    (CANCELLED, 'Cancelled'),
    (RETURNED, 'Returned'),
]

class OrderDetail(models.Model):
    product = models.ForeignKey('products.Product', related_name='order_details', on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=0.00)
    bulk_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=0.00)
    order = models.ForeignKey('Order', related_name='order_details', on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.unit_price:
            self.unit_price = self.product.cost_price
        if not self.bulk_price:
            self.bulk_price = self.unit_price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.product.name} - {self.quantity} units'


class Order(models.Model):
    order_uuid = models.UUIDField(default=uuid.uuid1, editable=False, unique=True)
    warehouse = models.ForeignKey('management.Warehouse', related_name='orders', on_delete=models.CASCADE)
    provider = models.ForeignKey('management.Provider', related_name='order_providers', on_delete=models.CASCADE)
    expected_delivery_date = models.DateField()
    actual_delivery_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=ORDER_CHOICES, default=PENDING)
    inventory_updated = models.BooleanField(default=False)

    staff = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='orders')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if self.status == DELIVERED and not self.inventory_updated:
            self.update_inventory(increase=True)
        elif self.status in [RETURNED, CANCELLED] and self.inventory_updated:
            self.update_inventory(increase=False)
        super().save(*args, **kwargs)

    def update_inventory(self, increase=True):
        for order_detail in self.order_details.all():
            product = order_detail.product
            warehouse = self.warehouse
            inventory = product.inventories.get(warehouse=warehouse)
            if increase:
                inventory.increase_stock(order_detail.quantity)
            else:
                inventory.reduce_stock(order_detail.quantity)
        self.inventory_updated = increase

    def update_status(self, status):
        self.status = status
        self.save()
        return self.status

    def __str__(self):
        return f'Order {self.id} - {self.provider.name}'


class DeliveryDetail(models.Model):
    product = models.ForeignKey('products.Product', related_name='delivery_details', on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=0.00)
    bulk_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=0.00)
    delivery = models.ForeignKey('Delivery', related_name='delivery_details', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.unit_price:
            self.unit_price = self.product.selling_price
        if not self.bulk_price:
            self.bulk_price = self.unit_price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.product.name} - {self.quantity} units'


class Delivery(models.Model):
    delivery_uuid = models.UUIDField(default=uuid.uuid1, editable=False, unique=True)
    warehouse = models.ForeignKey('management.Warehouse', related_name='deliveries', on_delete=models.CASCADE)
    customer = models.ForeignKey('accounts.User', related_name='customer_deliveries', blank=True, null=True, on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=100, blank=True, null=True)
    expected_delivery_date = models.DateField()
    actual_delivery_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=ORDER_CHOICES, default=PENDING)
    inventory_updated = models.BooleanField(default=False)

    staff = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='deliveries')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.customer_name and self.customer:
            self.customer_name = self.customer.get_full_name()

        if self.status == DELIVERED and not self.inventory_updated:
            self.update_inventory(decrease=True)
        elif self.status in [RETURNED, CANCELLED] and self.inventory_updated:
            self.update_inventory(decrease=False)
        super().save(*args, **kwargs)

    def update_inventory(self, decrease=True):
        for delivery_detail in self.delivery_details.all():
            product = delivery_detail.product
            warehouse = self.warehouse
            inventory = product.inventories.get(warehouse=warehouse)
            if decrease:
                inventory.reduce_stock(delivery_detail.quantity)
            else:
                inventory.increase_stock(delivery_detail.quantity)
        self.inventory_updated = decrease

    def update_status(self, status):
        self.status = status
        self.save()
        return self.status

    def __str__(self):
        return f'Delivery {self.id} - {self.customer_name or "Unknown Customer"}'


class SalesDetail(models.Model):
    product = models.ForeignKey('products.Product', related_name='sale_details', on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=1)
    unit_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=0.00)
    bulk_price = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=0.00)
    sale = models.ForeignKey('Sale', related_name='sale_details', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.unit_price:
            self.unit_price = self.product.selling_price
        if not self.bulk_price:
            self.bulk_price = self.unit_price * self.quantity
        super().save(*args, **kwargs)

    def __str__(self):
        return f'{self.product.name} - {self.quantity} units'


class Sale(models.Model):
    sale_uuid = models.UUIDField(default=uuid.uuid1, editable=False, unique=True)
    warehouse = models.ForeignKey('management.Warehouse', related_name='sales', on_delete=models.CASCADE)
    customer = models.ForeignKey('accounts.User', related_name='customer_sales', blank=True, null=True, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=100, blank=True, null=True)
    customer_name = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=ORDER_CHOICES, default=PENDING)
    inventory_updated = models.BooleanField(default=False)

    staff = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sales')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.customer_name and self.customer:
            self.customer_name = self.customer.get_full_name()

        if self.status == DELIVERED and not self.inventory_updated:
            self.update_inventory(decrease=True)
        elif self.status in [RETURNED, CANCELLED] and self.inventory_updated:
            self.update_inventory(decrease=False)
        super().save(*args, **kwargs)

    def update_inventory(self, decrease=True):
        for sale_detail in self.sale_details.all():
            product = sale_detail.product
            warehouse = self.warehouse
            inventory = product.inventories.get(warehouse=warehouse)
            if decrease:
                inventory.reduce_stock(sale_detail.quantity)
            else:
                inventory.increase_stock(sale_detail.quantity)
        self.inventory_updated = decrease

    def update_status(self, status):
        self.status = status
        self.save()
        return self.status

    def __str__(self):
        return f'Sale {self.id} - {self.customer_name or "Unknown Customer"}'


class SalesReceipt(models.Model):
    receipt_uuid = models.UUIDField(default=uuid.uuid1, editable=False, unique=True)
    sale = models.ForeignKey('Sale', related_name='receipts', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, default=0.00)
    payment_method = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.amount:
            self.amount = self.sale.sale_details.aggregate(total=models.Sum('bulk_price')).get('total', 0.00)
        super().save(*args, **kwargs)
        if self.sale.status != DELIVERED and not self.sale.inventory_updated:
            self.sale.update_status(DELIVERED)

    def get_receipt_data(self):

        data = {
            'receipt': {
                'number': str(self.receipt_uuid)[:8],
                'date': self.created_at,
                'sale': str(self.sale.sale_uuid)[:8]
            },
            'info': {
                'name': self.sale.customer_name,
                'staff': str(self.sale.staff.user_uuid)[:8],
            },
            
            'sold_at': {
                'name': self.sale.warehouse.name,
                'address': self.sale.warehouse.address,
                'number': self.sale.warehouse.phone_number,
                'email': self.sale.warehouse.email,
            },
            'detail': {
                'total': self.amount,
                'signature': self.sale.staff.username,
            }
        }

        items = []
        details = SalesDetail.objects.filter(sale=self.sale.id)
        for sale_detail in details:
            items .append(
                {'qty': sale_detail.quantity, 
                 'description': sale_detail.product.name, 
                 'unit_price': sale_detail.unit_price, 
                 'amount': sale_detail.bulk_price},
            )
        
        data['detail']['items'] = items

        return data

    def __str__(self):
        return f'{self.sale.customer_name or "Unknown Customer"} - Sale {self.sale.id} - {self.amount}'


class DeliveryReceipt(models.Model):
    receipt_uuid = models.UUIDField(default=uuid.uuid1, editable=False, unique=True)
    delivery = models.ForeignKey('Delivery', related_name='receipts', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2, blank=True, default=0.00)
    payment_method = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.amount:
            self.amount = self.delivery.delivery_details.aggregate(total=models.Sum('bulk_price')).get('total', 0.00)
        super().save(*args, **kwargs)
        if self.delivery.status != DELIVERED and not self.delivery.inventory_updated:
            self.delivery.update_status(DELIVERED)

    def __str__(self):
        return f'{self.delivery.customer_name or "Unknown Customer"} - Delivery {self.delivery.id} - {self.amount}'
    
    def get_receipt_data(self):

        data = {
            'receipt': {
                'number': str(self.receipt_uuid)[:8],
                'date': self.created_at,
                'sale': str(self.delivery.delivery_uuid)[:8]
            },
            'info': {
                'name': self.delivery.customer_name,
                'staff': str(self.delivery.staff.user_uuid)[:8],
            },
            
            'sold_at': {
                'name': self.delivery.warehouse.name,
                'address': self.delivery.warehouse.address,
                'number': self.delivery.warehouse.phone_number,
                'email': self.delivery.warehouse.email,
            },
            'detail': {
                'total': self.amount,
                'signature': self.delivery.staff.username,
            }
        }

        items = []
        details = DeliveryDetail.objects.filter(delivery=self.delivery.id)
        for delivery_detail in details:
            items .append(
                {'qty': delivery_detail.quantity, 
                 'description': delivery_detail.product.name, 
                 'unit_price': delivery_detail.unit_price, 
                 'amount': delivery_detail.bulk_price},
            )
        
        data['detail']['items'] = items

        return data