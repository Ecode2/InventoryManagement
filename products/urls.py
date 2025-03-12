from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet, basename="categories")
router.register(r'products', views.ProductViewSet, basename="product")
router.register(r'product-files', views.ProductFileViewSet, basename="file_product")
router.register(r'inventories', views.InventoryViewSet, basename="inventory")

urlpatterns = [
    path('', include(router.urls)),
]