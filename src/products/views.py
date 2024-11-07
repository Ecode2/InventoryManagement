from rest_framework import viewsets, permissions, pagination, filters, parsers
from django_filters.rest_framework import DjangoFilterBackend
from django.utils.decorators import method_decorator

from core.permissions import IsAdminUser, IsAdminOrStaff
#from core.mixins import CacheResponseMixin

from .filters import InventoryFilter, ProductFileFilter
from .models import Category, Product, ProductFile, Inventory
from .serializers import CategorySerializer, ProductSerializer, ProductFileSerializer, InventorySerializer


# Create your views here.
class CategoryViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = pagination.PageNumberPagination
    filterset_fields = ['name', 'created_at']
    ordering_fields = ['name', 'created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


class ProductViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = pagination.PageNumberPagination
    filterset_fields = [
        'sku', 'bar_code', 'name', 'category', 'recorder_quantity', 'recorder_quantity_name',
        'cost_price', 'selling_price', 'weight', 'height', 'width', 'depth', 'refriderated', 
        'is_active', 'created_at', 'updated_at'
    ]
    ordering_fields = ['name', 'cost_price', 'selling_price', 'created_at', 'updated_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


class ProductFileViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
    queryset = ProductFile.objects.all()
    serializer_class = ProductFileSerializer
    pagination_class = pagination.PageNumberPagination
    #parser_classes = (parsers.MultiPartParser, parsers.FormParser)
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_class = ProductFileFilter #, 'created_at', 'updated_at']
    ordering_fields = ['product', 'file']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


class InventoryViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    pagination_class = pagination.PageNumberPagination
    filterset_class = InventoryFilter
    ordering_fields = ['min_stock', 'max_stock', 'products__cost_price', 'products__selling_price', 'created_at', 'updated_at']
    search_fields = ["product__name", "product__sku", "id", "product__bar_code", "product__description"]

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]




""" @action(detail=False, methods=['get', 'post'])
    def custom_method(self, request):
        # Your custom method logic here
        if request.method == 'GET':
            data = {'message': 'This is a GET custom method response'}
            return self.cache_custom_method(request, data=data)
        elif request.method == 'POST':
            # Custom method logic for POST
            data = {'message': 'This is a POST custom method response'}
            self.clear_cache()
            return Response(data) """

""" @method_decorator(cache_page(CACHE_TTL))
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @method_decorator(cache_page(CACHE_TTL))
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        cache.clear()
        return response

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        cache.clear()
        return response

    def destroy(self, request, *args, **kwargs):
        response = super().destroy(request, *args, **kwargs)
        cache.clear()
        return response """