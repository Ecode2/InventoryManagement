from django_filters import rest_framework as filters
from django.db import models
from .models import ProductFile, Inventory

class ProductFileFilter(filters.FilterSet):
    class Meta:
        model = ProductFile
        fields = {
            'product': ['exact'],
            'file': ['exact'],
        }
        filter_overrides = {
            models.FileField: {
                'filter_class': filters.CharFilter
            }
        }
        
        
class InventoryFilter(filters.FilterSet):
    min_stock_gte = filters.NumberFilter(field_name='min_stock', lookup_expr='gte')
    max_stock_lte = filters.NumberFilter(field_name='max_stock', lookup_expr='lte')
    cost_price_range = filters.RangeFilter(field_name='products__cost_price')
    selling_price_range = filters.RangeFilter(field_name='products__selling_price')
    created_at_range = filters.DateFromToRangeFilter(field_name='created_at')
    updated_at_range = filters.DateFromToRangeFilter(field_name='updated_at')

    class Meta:
        model = Inventory
        fields = [
            'product', 'warehouse', 'stock', 'min_stock', 
            'max_stock', 'alert_level', 'min_stock_gte',
            'max_stock_lte', 'cost_price_range',
            'selling_price_range', 'created_at_range',
            'updated_at_range'
        ]
