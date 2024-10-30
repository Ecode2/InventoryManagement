from django.http import HttpResponse
from django.template.loader import get_template
from rest_framework.decorators import action
from rest_framework import viewsets, permissions, pagination
from weasyprint import HTML

from core.permissions import IsAdminUser, IsAdminOrStaff
from core.mixins import CacheResponseMixin

from .models import (Delivery, DeliveryDetail, Order, OrderDetail, 
                      SalesDetail, Sale, SalesReceipt, DeliveryReceipt)
from .serializers import (DeliverySerializer, DeliveryDetailSerializer, 
                          OrderSerializer, OrderDetailSerializer,
                          SalesDetailSerializer, SaleSerializer,
                          SalesReceiptSerializer, DeliveryReceiptSerializer)



# Create your views here.
class SalesDetailViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = SalesDetail.objects.all()
    serializer_class = SalesDetailSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


class SaleViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class DeliveryDetailViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = DeliveryDetail.objects.all()
    serializer_class = DeliveryDetailSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class DeliveryViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class OrderDetailViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = OrderDetail.objects.all()
    serializer_class = OrderDetailSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class OrderViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


## TODO: integrate the GeneratePDF class to the post request of the receipt viewset

class SalesReceiptViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = SalesReceipt.objects.all()
    serializer_class = SalesReceiptSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrStaff])
    def generate_pdf(self, request, pk=None):
        receipt = self.get_object()
        template = get_template('sales_receipt_template.html')
        context = {
            'receipt_id': receipt.receipt_id,
            'date': receipt.date,
            'customer_name': receipt.customer.name,
            'amount': receipt.total_amount,
            # Add more context variables as needed
        }
        html = template.render(context)
        pdf = HTML(string=html).write_pdf()

        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="sales_receipt_{receipt.receipt_id}.pdf"'
        return response

class DeliveryReceiptViewSet(CacheResponseMixin, viewsets.ModelViewSet):
    queryset = DeliveryReceipt.objects.all()
    serializer_class = DeliveryReceiptSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['post'], permission_classes=[IsAdminOrStaff])
    def generate_pdf(self, request, pk=None):
        receipt = self.get_object()
        template = get_template('delivery_receipt_template.html')
        context = {
            'receipt_id': receipt.receipt_id,
            'date': receipt.date,
            'customer_name': receipt.customer.name,
            'amount': receipt.total_amount,
            # Add more context variables as needed
        }
        html = template.render(context)
        pdf = HTML(string=html).write_pdf()

        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="delivery_receipt_{receipt.receipt_id}.pdf"'
        return response
    


""" class GeneratePDF(APIView):
    def get(self, request, *args, **kwargs):
        template = get_template('receipt_template.html')
        context = {
            'receipt_id': 123,
            'date': '2024-10-29',
            'customer_name': 'John Doe',
            'amount': 100.00,
            # Add more context variables as needed
        }
        html = template.render(context)
        pdf = HTML(string=html).write_pdf()

        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="receipt.pdf"'
        return response """