from rest_framework import serializers
from .models import Delivery, DeliveryDetail, Order, OrderDetail, Sale, SalesDetail, SalesReceipt, DeliveryReceipt

class SalesDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = SalesDetail
        fields = "__all__"

class SaleSerializer(serializers.ModelSerializer):
    sales_details = SalesDetailSerializer(many=True, read_only=True)

    class Meta:
        model = Delivery
        fields = ['id', "warehouse", "customer", "customer_name", "sales_details"]

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
    class Meta:
        model = SalesReceipt
        fields = "__all__"

class DeliveryReceiptSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryReceipt
        fields = "__all__"


