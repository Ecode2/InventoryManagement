from django_filters import rest_framework as filters
from django.db import models
from .models import ProductFile

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
