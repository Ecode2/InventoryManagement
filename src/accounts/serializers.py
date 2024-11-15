from datetime import datetime
from django.db.models import Sum
from rest_framework import serializers
from django.conf import settings

from .models import User

class UserSerializer(serializers.ModelSerializer):
    store_detail = serializers.SerializerMethodField()
    sales_data = serializers.SerializerMethodField()

    class Meta:
        model = User

        fields = ['id', 'user_uuid', 'phone_number', 'username', 'email', 'role', 'store', 'store_detail', 'sales_data', 'last_login', 'is_active', 'date_joined']
        read_only_fields = ['id', 'user_uuid', 'store_detail', 'last_login', 'date_joined']

    def get_store_detail(self, obj):
        if obj.store:
            return {
                "name": obj.store.name,
                "address": obj.store.address
            }
        return None
    
    def get_sales_data(self, obj):
        sales = obj.sales.all()
        today = datetime.today().date()

        # Filter sales for today and calculate daily sales and revenue
        daily_sales = sales.filter(created_at__date=today).count()
        daily_revenue = sales.filter(created_at__date=today).annotate(total_amount=Sum('sale_details__bulk_price')).aggregate(Sum('total_amount'))['total_amount__sum'] or 0

        # Calculate total sales and total revenue
        total_sales = sales.count()
        total_revenue = sales.annotate(total_amount=Sum('sale_details__bulk_price')).aggregate(Sum('total_amount'))['total_amount__sum'] or 0

        # Calculate the number of days since the user joined
        days_since_joined = (today - obj.date_joined.date()).days

        # Avoid division by zero
        average_sales_per_day = total_sales / days_since_joined if days_since_joined > 0 else 0
        average_sales_per_month = total_sales / (days_since_joined / 30) if days_since_joined > 0 else 0

        return {
            'daily_sales': daily_sales,
            'daily_revenue': daily_revenue,
            'total_sales': total_sales,
            'total_revenue': total_revenue,
            'average_sales_per_day': average_sales_per_day,
            'average_sales_per_month': average_sales_per_month
        }