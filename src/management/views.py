from rest_framework import viewsets, pagination
from core.permissions import IsAdminUser, IsAdminOrStaff
from core.mixins import CacheResponseMixin
from .models import Location, Warehouse, Transfer, Provider
from .serializers import LocationSerializer, WarehouseSerializer, TransferSerializer, ProviderSerializer

# Create your views here.

class LocationViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
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
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class WarehouseViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
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
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class TransferViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = Transfer.objects.all()
    serializer_class = TransferSerializer
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
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class ProviderViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer
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
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
