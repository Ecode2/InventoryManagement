from rest_framework import serializers
from .models import Location, Warehouse, Transfer, Provider

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['address', 'city', 'state', 'country', 'zip_code']


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['name', 'is_refrigerated', 'address', 'location', 'is_active', 'created_at']


class TransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transfer
        fields = ['product', 'quantity', 'sent_date', 'received_date', 'from_warehouse', 'to_warehouse', 'created_at', 'updated_at']


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = ['name', 'email', 'phone', 'address', 'location']
