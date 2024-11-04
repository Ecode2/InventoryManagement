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
    product = ProductSerializer(many=False, read_only=True)
    sales_day = serializers.SerializerMethodField()
    sales_month = serializers.SerializerMethodField()
    total_sales = serializers.SerializerMethodField()
    revenue = serializers.SerializerMethodField()
    average_sales_day = serializers.SerializerMethodField()
    average_sales_month = serializers.SerializerMethodField()

    class Meta:
        model = Inventory
        fields = ['id',
            'product', 'warehouse', 'stock', 'min_stock', 
            'max_stock', 'alert_level', 'sales_day', 
            'sales_month', 'total_sales', 'revenue', 'average_sales_day',
            'average_sales_month'
        ]

    def get_sales_day(self, obj):
        sales_data = obj.get_sales_data()
        return sales_data.get('sales_day') or 0

    def get_sales_month(self, obj):
        sales_data = obj.get_sales_data()
        return sales_data.get('sales_month') or 0

    def get_total_sales(self, obj):
        sales_data = obj.get_sales_data()
        return sales_data.get('total_sales') or 0

    def get_revenue(self, obj):
        sales_data = obj.get_sales_data()
        return sales_data.get('revenue') or 0.0

    def get_average_sales_day(self, obj):
        sales_data = obj.get_sales_data()
        return sales_data.get('average_sales_day') or 0.0

    def get_average_sales_month(self, obj):
        sales_data = obj.get_sales_data()
        return sales_data.get('average_sales_month') or 0.0
