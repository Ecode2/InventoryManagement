from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

sale_router = DefaultRouter()
sale_router.register(r'detail', views.SalesDetailViewSet, basename="sale_detail")
sale_router.register(r'cart', views.SaleViewSet, basename="sale")
sale_router.register(r'receipt', views.SalesReceiptViewSet, basename="sale_receipt")

order_router = DefaultRouter()
order_router.register(r'detail', views.OrderDetailViewSet, basename="order_detail")
order_router.register(r'cart', views.OrderViewSet, basename="order")
#order_router.register(r'receipt', views., basename="")

detail_router = DefaultRouter()
detail_router.register(r'detail', views.DeliveryDetailViewSet, basename="delivery_detail")
detail_router.register(r'cart', views.DeliveryViewSet, basename="delievery")
detail_router.register(r'receipt', views.DeliveryReceiptViewSet, basename="delivery_receipt")

urlpatterns = [
    path('order/', include(order_router.urls)),
    path('delivery/', include(detail_router.urls)),
    path('test-receipt/', views.receipt_view, name='receipt'),
    path('', include(sale_router.urls)),
]