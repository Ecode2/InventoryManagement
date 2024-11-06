
from django_filters import rest_framework as filters
from django.db import models
from .models import Sale


class SalesFilter(filters.FilterSet):
    created_at_range = filters.DateFromToRangeFilter(field_name='created_at')
    updated_at_range = filters.DateFromToRangeFilter(field_name='updated_at')

    class Meta:
        model = Sale
        fields = [
            'warehouse', 
            'customer', 
            'customer_name', 
            'status', 
            'created_at', 
            'updated_at', 
            'created_at_range',
            'updated_at_range',
        ]


""" ^	istartswith	Starts-with search.
=	iexact	Exact matches.
$	iregex	Regex search.
@	search	Full-text search (Currently only supported Django's PostgreSQL backend).
None	icontains	Contains search (Default). """