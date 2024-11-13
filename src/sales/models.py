from django.db import models
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
    quantity = models.PositiveIntegerField(default=1)
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
    warehouse = models.ForeignKey('management.Warehouse', related_name='orders', on_delete=models.CASCADE)
    provider = models.ForeignKey('management.Provider', related_name='orders', on_delete=models.CASCADE)
    expected_delivery_date = models.DateField()
    actual_delivery_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=ORDER_CHOICES, default=PENDING)
    inventory_updated = models.BooleanField(default=False)
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
    quantity = models.PositiveIntegerField(default=1)
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
    warehouse = models.ForeignKey('management.Warehouse', related_name='deliveries', on_delete=models.CASCADE)
    customer = models.ForeignKey('accounts.User', related_name='deliveries', blank=True, null=True, on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=100, blank=True, null=True)
    expected_delivery_date = models.DateField()
    actual_delivery_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=ORDER_CHOICES, default=PENDING)
    inventory_updated = models.BooleanField(default=False)
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
    quantity = models.PositiveIntegerField(default=1)
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
    customer = models.ForeignKey('accounts.User', related_name='sales', blank=True, null=True, on_delete=models.CASCADE)
    payment_method = models.CharField(max_length=100, blank=True, null=True)
    customer_name = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(max_length=20, choices=ORDER_CHOICES, default=PENDING)
    inventory_updated = models.BooleanField(default=False)
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
        """ return {
            'receipt_id': self.id,
            'date': self.created_at,
            'customer_name': self.sale.customer_name,
            'amount': self.amount,
        } """

        return {
            'company': {
                'name': 'East Repair Inc.',
                'address': '1912 Harvest Lane',
                'city': 'New York, NY 12210'
            },
            'bill_to': {
                'name': 'John Smith',
                'address': '2 Court Square',
                'city': 'New York, NY 12210'
            },
            'ship_to': {
                'name': 'John Smith',
                'address': '3787 Pineview Drive',
                'city': 'Cambridge, MA 12210'
            },
            'receipt': {
                'number': 'US-001',
                'date': '11/02/2019',
                'po_number': '2312/2019',
                'due_date': '26/02/2019'
            },
            'items': [
                {'qty': 1, 'description': 'Front and rear brake cables', 'unit_price': 100.00, 'amount': 100.00},
                {'qty': 2, 'description': 'New set of pedal arms', 'unit_price': 15.00, 'amount': 30.00},
                {'qty': 3, 'description': 'Labor 3hrs', 'unit_price': 5.00, 'amount': 15.00}
            ],
            'subtotal': 145.00,
            'tax': 9.06,
            'total': 154.06,
            'signature': 'John Smith'
        }

    def __str__(self):
        return f'{self.sale.customer_name or "Unknown Customer"} - Sale {self.sale.id} - {self.amount}'


class DeliveryReceipt(models.Model):
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






""" from django.db import models


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

# Create your models here.
class OrderDetail(models.Model):

    product = models.ForeignKey('products.Product', related_name='order_details', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    unit_price = models.DecimalField(max_digits=1000, decimal_places=2, blank=True, default=0.00)
    bulk_price = models.DecimalField(max_digits=1000, decimal_places=2, blank=True, default=0.00)

    order = models.ForeignKey('Order', related_name='order_details', on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.unit_price:
            self.unit_price = self.product.cost_price
        if not self.bulk_price:
            self.bulk_price = self.unit_price * self.quantity
            
        return super().save(*args, **kwargs)
    

class Order(models.Model):

    warehouse = models.ForeignKey('management.Warehouse', related_name='orders', on_delete=models.CASCADE)
    provider = models.ForeignKey('management.Provider', related_name='orders', on_delete=models.CASCADE)
    
    expected_delivery_date = models.DateField(auto_now=False, auto_now_add=False)
    actual_delivery_date = models.DateField(auto_now=False, auto_now_add=False, null=True, blank=True)
    status = models.CharField(max_length=100, blank=True, choices=ORDER_CHOICES, default=PENDING)

    inventory_updated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):

        if self.status == 'DELIVERED' and not self.inventory_updated:
            for order_detail in self.order_details.all():
                product = order_detail.product
                warehouse = self.warehouse
                inventory = product.inventories.get(warehouse=warehouse)
                inventory.increase_stock(order_detail.quantity)
            self.inventory_updated = True

        if self.status == 'RETURNED' and self.inventory_updated:
            for order_detail in self.order_details.all():
                product = order_detail.product
                warehouse = self.warehouse
                inventory = product.inventories.get(warehouse=warehouse)
                inventory.reduce_stock(order_detail.quantity)
            self.inventory_updated = False

        if self.status == 'CANCELLED' and self.inventory_updated:
            for order_detail in self.order_details.all():
                product = order_detail.product
                warehouse = self.warehouse
                inventory = product.inventories.get(warehouse=warehouse)
                inventory.reduce_stock(order_detail.quantity)
            self.inventory_updated = False
        
        return super().save(*args, **kwargs)

    def update_status(self, status):
        self.status = status
        self.save()
        return self.status
    

class DeliveryDetail(models.Model):
    product = models.ForeignKey('products.Product', related_name='delivery_details', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    unit_price = models.DecimalField(max_digits=1000, decimal_places=2, blank=True, default=0.00)
    bulk_price = models.DecimalField(max_digits=1000, decimal_places=2, blank=True, default=0.00)

    delivery = models.ForeignKey('Delivery', related_name='delivery_details', on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.unit_price:
            self.unit_price = self.product.selling_price
        if not self.bulk_price:
            self.bulk_price = self.unit_price * self.quantity
            
        return super().save(*args, **kwargs)


class Delivery(models.Model):
    
    warehouse = models.ForeignKey('management.Warehouse', related_name='delivery', on_delete=models.CASCADE)
    customer = models.ForeignKey('accounts.User', related_name='delivery', blank=True, null=True, on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=100, blank=True, null=True)
    
    expected_delivery_date = models.DateField(auto_now=False, auto_now_add=False)
    actual_delivery_date = models.DateField(auto_now=False, auto_now_add=False, null=True, blank=True)
    status = models.CharField(max_length=100, blank=True, choices=ORDER_CHOICES, default=PENDING)

    inventory_updated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.customer_name and self.customer:
            self.customer_name = self.customer.get_full_name()

        if self.status == 'DELIVERED' and not self.inventory_updated:
            for delivery_detail in self.delivery_details.all():
                product = delivery_detail.product
                warehouse = self.warehouse
                inventory = product.inventories.get(warehouse=warehouse)
                inventory.reduce_stock(delivery_detail.quantity)
            self.inventory_updated = True

        if self.status == 'RETURNED' and self.inventory_updated:
            for delivery_detail in self.delivery_details.all():
                product = delivery_detail.product
                warehouse = self.warehouse
                inventory = product.inventories.get(warehouse=warehouse)
                inventory.increase_stock(delivery_detail.quantity)
            self.inventory_updated = False

        if self.status == 'CANCELLED' and self.inventory_updated:
            for delivery_detail in self.delivery_details.all():
                product = delivery_detail.product
                warehouse = self.warehouse
                inventory = product.inventories.get(warehouse=warehouse)
                inventory.increase_stock(delivery_detail.quantity)
            self.inventory_updated = False

        return super().save(*args, **kwargs)
    
    def update_status(self, status):
        self.status = status
        self.save()
        return self.status


class SalesDetail(models.Model):
    product = models.ForeignKey('products.Product', related_name='sale_details', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    unit_price = models.DecimalField(max_digits=1000, decimal_places=2, blank=True, default=0.00)
    bulk_price = models.DecimalField(max_digits=1000, decimal_places=2, blank=True, default=0.00)

    sale = models.ForeignKey('Sale', related_name='sale_details', on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.unit_price:
            self.unit_price = self.product.selling_price
        if not self.bulk_price:
            self.bulk_price = self.unit_price * self.quantity
            
        return super().save(*args, **kwargs)


class Sale(models.Model):
    
    warehouse = models.ForeignKey('management.Warehouse', related_name='sale', on_delete=models.CASCADE)
    customer = models.ForeignKey('accounts.User', related_name='sale', blank=True, null=True, on_delete=models.CASCADE)
    customer_name = models.CharField(max_length=100, blank=True, null=True)
    
    status = models.CharField(max_length=100, blank=True, choices=ORDER_CHOICES, default=PENDING)

    inventory_updated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.customer_name and self.customer:
            self.customer_name = self.customer.get_full_name()

        if self.status == 'DELIVERED' and not self.inventory_updated:
            for sale_detail in self.sale_details.all():
                product = sale_detail.product
                warehouse = self.warehouse
                inventory = product.inventories.get(warehouse=warehouse)
                inventory.reduce_stock(sale_detail.quantity)
            self.inventory_updated = True

        if self.status == 'RETURNED' and self.inventory_updated:
            for sale_detail in self.sale_details.all():
                product = sale_detail.product
                warehouse = self.warehouse
                inventory = product.inventories.get(warehouse=warehouse)
                inventory.increase_stock(sale_detail.quantity)
            self.inventory_updated = False

        if self.status == 'CANCELLED' and self.inventory_updated:
            for sale_detail in self.sale_details.all():
                product = sale_detail.product
                warehouse = self.warehouse
                inventory = product.inventories.get(warehouse=warehouse)
                inventory.increase_stock(sale_detail.quantity)
            self.inventory_updated = False

        super().save(*args, **kwargs)
    
    def update_status(self, status):
        self.status = status
        self.save()
        return self.status


class SalesReceipt(models.Model):
    
    sale = models.ForeignKey('Sale', related_name='receipts', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=1000, decimal_places=2, blank=True, default=0.00)
    payment_method = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.amount:
            self.amount = self.sale.sale_details.aggregate(total=models.Sum('bulk_price')).get('total', 0)
            
        super().save(*args, **kwargs)

        if self.sale.status != 'DELIVERED' and not self.sale.inventory_updated:
            self.sale.update_status(DELIVERED)
        
    def __str__(self):
        return f'{self.sale.customer_name} - {self.sale.id} - {self.amount}'
    
class DelieveredReceipt(models.Model):
        
        delivery = models.ForeignKey('Delivery', related_name='receipts', on_delete=models.CASCADE)
        amount = models.DecimalField(max_digits=1000, decimal_places=2, blank=True, default=0.00)
        payment_method = models.CharField(max_length=100, blank=True, null=True)
    
        created_at = models.DateTimeField(auto_now_add=True)
        updated_at = models.DateTimeField(auto_now=True)
    
        def save(self, *args, **kwargs):
            if not self.amount:
                self.amount = self.delivery.delivery_details.aggregate(total=models.Sum('bulk_price')).get('total', 0)
                
            super().save(*args, **kwargs)
    
            if self.delivery.status != 'DELIVERED' and not self.delivery.inventory_updated:
                self.delivery.update_status(DELIVERED)
            
        def __str__(self):
            return f'{self.delivery.customer_name} - {self.delivery.id} - {self.amount}'
    
    
class SalesReturn(models.Model):
        
        sale = models.ForeignKey('Sale', related_name='returns', on_delete=models.CASCADE)
        amount = models.DecimalField(max_digits=1000, decimal_places=2, blank=True, default=0.00)
        reason = models.TextField(blank=True, null=True)
    
        created_at = models.DateTimeField(auto_now_add=True)
        updated_at = models.DateTimeField(auto_now=True)
    
        def save(self, *args, **kwargs):
            if not self.amount:
                self.amount = self.sale.receipts.aggregate(total=models.Sum('amount')).get('total', 0)
                
            super().save(*args, **kwargs)
    
            self.sale.update_status(RETURNED)
            for sale_detail in self.sale.sale_details.all():
                product = sale_detail.product
                warehouse = self.sale.warehouse
                inventory = product.inventories.get(warehouse=warehouse)
                inventory.increase_stock(sale_detail.quantity)
            
        def __str__(self):
            return f'{self.sale.customer_name}- {self.sale.id} - {self.amount}' """

