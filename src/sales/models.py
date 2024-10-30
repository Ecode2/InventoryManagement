from django.db import models


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
    

class DelieveryDetail(models.Model):
    product = models.ForeignKey('products.Product', related_name='delivery_details', on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)

    unit_price = models.DecimalField(max_digits=1000, decimal_places=2, blank=True, default=0.00)
    bulk_price = models.DecimalField(max_digits=1000, decimal_places=2, blank=True, default=0.00)

    delievery = models.ForeignKey('Delievery', related_name='delivery_details', on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.unit_price:
            self.unit_price = self.product.selling_price
        if not self.bulk_price:
            self.bulk_price = self.unit_price * self.quantity
            
        return super().save(*args, **kwargs)


class Delievery(models.Model):
    
    warehouse = models.ForeignKey('management.Warehouse', related_name='delievery', on_delete=models.CASCADE)
    customer = models.ForeignKey('accounts.User', related_name='delievery', blank=True, null=True, on_delete=models.CASCADE)
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
        
        delivery = models.ForeignKey('Delievery', related_name='receipts', on_delete=models.CASCADE)
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
            return f'{self.sale.customer_name}- {self.sale.id} - {self.amount}'