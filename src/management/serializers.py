from rest_framework import serializers
from .models import Location, Warehouse, Transfer, Provider

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'address', 'city', 'state', 'country', 'zip_code']
        read_only_fields = ['id']


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Warehouse
        fields = ['id', 'name', 'phone_number', 'email', 'is_refrigerated', 'address', 'location', 'is_active', 'created_at']
        read_only_fields = ['id', 'created_at']


class TransferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transfer
        fields = ['id', 'product', 'quantity', 'sent_date', 'received_date', 'from_warehouse', 
                  'to_warehouse', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class ProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Provider
        fields = ['id', 'name', 'email', 'phone', 'address', 'location']
        read_only_fields = ['id']
