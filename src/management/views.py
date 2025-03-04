from rest_framework import viewsets, pagination

from core.permissions import IsAdminUser, IsAdminOrStaff
#from core.mixins import CacheResponseMixin
from .models import Location, Warehouse, Transfer, Provider
from .serializers import LocationSerializer, WarehouseSerializer, TransferSerializer, ProviderSerializer

# Create your views here.

class LocationViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class WarehouseViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
    queryset = Warehouse.objects.all()
    serializer_class = WarehouseSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class TransferViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
    queryset = Transfer.objects.all()
    serializer_class = TransferSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class ProviderViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
    queryset = Provider.objects.all()
    serializer_class = ProviderSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]
