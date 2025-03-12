from django.contrib import admin

# Register your models here.
from .models import Sale, Order, Delivery, SalesReceipt, DeliveryReceipt, SalesDetail, OrderDetail, DeliveryDetail

admin.site.register(Sale)
admin.site.register(Order)
admin.site.register(Delivery)
admin.site.register(SalesReceipt)
admin.site.register(DeliveryReceipt)
admin.site.register(SalesDetail)
admin.site.register(OrderDetail)
admin.site.register(DeliveryDetail)