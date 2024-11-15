from rest_framework import serializers
from django.shortcuts import get_object_or_404
from products.serializers import ProductSerializer
from .models import Delivery, DeliveryDetail, Order, OrderDetail, Sale, SalesDetail, SalesReceipt, DeliveryReceipt

class SalesDetailSerializer(serializers.ModelSerializer):
    product_detail = serializers.SerializerMethodField()
    class Meta:
        model = SalesDetail
        fields = ["id", "sale", "product", "quantity", "unit_price", "bulk_price", "product_detail", "created_at"]
        read_only_fields = ['id']

    def get_product_detail(self, obj) -> dict:
        serialized_data = ProductSerializer(obj.product).data
        return serialized_data
    
    def create(self, validated_data):
        sales_detail = SalesDetail(**validated_data)
        if sales_detail.quantity <= 0:
            #raise serializers.ValidationError("Quantity must be greater than zero")
            sales_detail.quantity = 1

        if not sales_detail.unit_price:
            sales_detail.unit_price = sales_detail.product.selling_price
        sales_detail.bulk_price = sales_detail.unit_price * sales_detail.quantity
        sales_detail.save()
        return sales_detail

    def update(self, instance, validated_data):
        instance.quantity = validated_data.get('quantity', instance.quantity)
        instance.unit_price = validated_data.get('unit_price', instance.unit_price) or instance.product.selling_price
        instance.bulk_price = instance.unit_price * instance.quantity
        instance.save()
        return instance

class SaleSerializer(serializers.ModelSerializer):
    staff = serializers.StringRelatedField()
    sales_details = serializers.SerializerMethodField()

    class Meta:
        model = Sale
        fields = ['id', "sale_uuid", "warehouse", "customer", "staff", "customer_name", "payment_method", "sales_details", "status", "created_at"]
        read_only_fields = ["id", "sale_uuid", "staff" "created_at"]

    def get_sales_details(self, obj) -> dict:
        sales_data = SalesDetail.objects.filter(sale=obj)
        serialized_data = SalesDetailSerializer(sales_data, many=True).data
        return serialized_data

class DeliveryDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryDetail
        fields = "__all__"

class DeliverySerializer(serializers.ModelSerializer):
    staff = serializers.StringRelatedField()
    delivery_details = DeliveryDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Delivery
        fields = ['id', "delivery_uuid", "warehouse", "customer", "staff", "customer_name", "expected_delivery_date", "actual_delivery_date", "delivery_details"]
        read_only_fields = ['id', "delivery_uuid", 'staff']

class OrderDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderDetail
        fields = "__all__"

class OrderSerializer(serializers.ModelSerializer):
    staff = serializers.StringRelatedField()
    order_details = OrderDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = fields = ['id', "order_uuid", "warehouse", "provider", "staff", "expected_delivery_date", "actual_delivery_date", "order_details"]
        read_only_fields = ['id', "order_uuid", 'staff']

class SalesReceiptSerializer(serializers.ModelSerializer):
    staff = serializers.StringRelatedField()
    sales = serializers.SerializerMethodField()
    class Meta:
        model = SalesReceipt
        fields = ["id", "receipt_uuid", "sale", "staff", "amount", "payment_method", "created_at", "sales"]
        read_only_fields = ["id", "receipt_uuid", "staff", "created_at"]
        
    def get_sales(self, obj) -> dict:
        sales_data = Sale.objects.get(id=obj.sale.id)
        serialized_data = SaleSerializer(sales_data).data
        return serialized_data

class DeliveryReceiptSerializer(serializers.ModelSerializer):
    staff = serializers.StringRelatedField()
    deliveries = serializers.SerializerMethodField()
    class Meta:
        model = DeliveryReceipt
        fields = ["id", "receipt_uuid", "delivery", "staff", "amount", "payment_method", "created_at", "deliveries"]
        read_only_fields = ["id", "receipt_uuid", "staff", "created_at"]

    def get_deliveries(self, obj) -> dict:
        delivery_data = Delivery.objects.get(id=obj.delivery.id)
        serialized_data = DeliverySerializer(delivery_data).data
        return serialized_data