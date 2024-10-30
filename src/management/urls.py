# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LocationViewSet, WarehouseViewSet, TransferViewSet, ProviderViewSet

router = DefaultRouter()
router.register(r'locations', LocationViewSet, basename="location")
router.register(r'warehouses', WarehouseViewSet, basename="warehouse")
router.register(r'transfers', TransferViewSet, basename="transfer")
router.register(r'providers', ProviderViewSet, basename="provider")

urlpatterns = [
    path('', include(router.urls)),
]
