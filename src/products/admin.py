from django.contrib import admin

# Register your models here.
from .models import Product, ProductFile, Inventory, Category

admin.site.register(Product)
admin.site.register(ProductFile)
admin.site.register(Inventory)
admin.site.register(Category)