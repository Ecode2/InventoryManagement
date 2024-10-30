from rest_framework import serializers
from .models import Category, Product, ProductFile, Inventory

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']


class ProductFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductFile
        fields = ['product', 'file']


class ProductSerializer(serializers.ModelSerializer):
    files = ProductFileSerializer(many=True, read_only=True)
    categories = serializers.StringRelatedField(many=True, read_only=True)

    class Meta:
        model = Product
        fields = [
            'sku', 'bar_code', 'name', 'description', 'categories', 
            'recorder_quantity', 'recorder_quantity_name', 'cost_price', 
            'selling_price', 'weight', 'height', 'width', 'depth', 
            'refriderated', 'is_active', 'files'
        ]


class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = [
            'product', 'warehouse', 'stock', 'min_stock', 
            'max_stock', 'alert_level'
        ]

