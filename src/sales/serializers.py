from rest_framework import serializers
from django.shortcuts import get_object_or_404
from products.serializers import ProductSerializer
from products.models import Product
from .models import Delivery, DeliveryDetail, Order, OrderDetail, Sale, SalesDetail, SalesReceipt, DeliveryReceipt

class SalesDetailSerializer(serializers.ModelSerializer):
    product_detail = serializers.SerializerMethodField()
    class Meta:
        model = SalesDetail
        fields = ["id", "sale", "product", "quantity", "unit_price", "bulk_price", "product_detail", "created_at"]

    def get_product_detail(self, obj):
        product = get_object_or_404(Product, id=obj.product.id)
        serialized_data = ProductSerializer(product).data
        return serialized_data

class SaleSerializer(serializers.ModelSerializer):
    #sales_details = SalesDetailSerializer(many=True, read_only=True)
    sales_details = serializers.SerializerMethodField()

    class Meta:
        model = Sale
        fields = ['id', "sale_uuid", "warehouse", "customer", "customer_name", "payment_method", "sales_details", "status", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_sales_details(self, obj):
        sales_data = SalesDetail.objects.filter(sale=obj)
        serialized_data = SalesDetailSerializer(sales_data, many=True).data
        return serialized_data

class DeliveryDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryDetail
        fields = "__all__"

class DeliverySerializer(serializers.ModelSerializer):
    delivery_details = DeliveryDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Delivery
        fields = ['id', "warehouse", "customer", "customer_name", "expected_delivery_date", "actual_delivery_date", "delivery_details"]

class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetail
        fields = "__all__"

class OrderSerializer(serializers.ModelSerializer):
    order_details = OrderDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = fields = ['id', "warehouse", "provider", "expected_delivery_date", "actual_delivery_date", "order_details"]

class SalesReceiptSerializer(serializers.ModelSerializer):
    #sales = serializers.SerializerMethodField()
    sale = SaleSerializer(many=False, read_only=True)
    class Meta:
        model = SalesReceipt
        fields = ["id", "sale", "amount", "payment_method", "created_at"] #sales", 
        read_only_fields = ["id", "created_at"]
        
    """ def get_sales(self, obj):
        sales_data = Sale.objects.get(id=obj.sale.id)
        serialized_data = SaleSerializer(sales_data).data
        return serialized_data """

class DeliveryReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryReceipt
        fields = "__all__"
