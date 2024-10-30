from rest_framework import viewsets, permissions, generics, pagination
from django.utils.decorators import method_decorator

from core.permissions import IsAdminUser, IsAdminOrStaff
from core.mixins import CachedViewSetMixin,  AdminStaffRequiredMixin, CacheResponseMixin

from .models import Category, Product, ProductFile, Inventory
from .serializers import CategorySerializer, ProductSerializer, ProductFileSerializer, InventorySerializer


# Create your views here.
class CategoryViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [IsAdminOrStaff]
        elif self.action == 'retrieve':
            permission_classes = [IsAdminOrStaff]
        elif self.action in ['create', 'update', 'partial_update']:
            permission_classes = [IsAdminUser]
        elif self.action == 'destroy':
            permission_classes = [IsAdminUser]
        elif self.action == 'custom_method':
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]



class ProductViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [IsAdminOrStaff]
        elif self.action == 'retrieve':
            permission_classes = [IsAdminOrStaff]
        elif self.action in ['create', 'update', 'partial_update']:
            permission_classes = [IsAdminUser]
        elif self.action == 'destroy':
            permission_classes = [IsAdminUser]
        elif self.action == 'custom_method':
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class ProductFileViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = ProductFile.objects.all()
    serializer_class = ProductFileSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [IsAdminOrStaff]
        elif self.action == 'retrieve':
            permission_classes = [IsAdminOrStaff]
        elif self.action in ['create', 'update', 'partial_update']:
            permission_classes = [IsAdminUser]
        elif self.action == 'destroy':
            permission_classes = [IsAdminUser]
        elif self.action == 'custom_method':
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


class InventoryViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = Inventory.objects.all()
    serializer_class = InventorySerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action == 'list':
            permission_classes = [IsAdminOrStaff]
        elif self.action == 'retrieve':
            permission_classes = [IsAdminOrStaff]
        elif self.action in ['create', 'update', 'partial_update']:
            permission_classes = [IsAdminUser]
        elif self.action == 'destroy':
            permission_classes = [IsAdminUser]
        elif self.action == 'custom_method':
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