from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field, OpenApiTypes
from .models import Category, Product, ProductFile, Inventory

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'created_at']
        read_only_fields = ['id', 'created_at']


class ProductFileSerializer(serializers.ModelSerializer):
    file = serializers.FileField()

    @extend_schema_field(OpenApiTypes.BINARY)
    def get_file(self, obj):
        return obj.file
    
    class Meta:
        model = ProductFile
        fields = ['id', 'product', 'file']
        read_only_fields = ['id']


class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(many=True, read_only=True)
    category_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Category.objects.all(), write_only=True, source='category'
    )
    files = ProductFileSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id',
            'sku', 'bar_code', 'name', 'description',
            'recorder_quantity', 'recorder_quantity_name', 'cost_price', 
            'selling_price', 'weight', 'height', 'width', 'depth', 
            'refriderated', 'is_active', 'files','category', 'category_ids'
        ]

    def create(self, validated_data):
        categories = validated_data.pop('category')
        product = Product.objects.create(**validated_data)
        product.category.set(categories)
        return product

    def update(self, instance, validated_data):
        categories = validated_data.pop('category', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if categories is not None:
            instance.category.set(categories)
        instance.save()
        return instance


class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ['id',
            'product', 'warehouse', 'stock', 'min_stock', 
            'max_stock', 'alert_level'
        ]

