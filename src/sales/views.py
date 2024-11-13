from django.http import HttpResponse
from django.template.loader import get_template
from rest_framework.decorators import action
from rest_framework import viewsets, pagination
from weasyprint import HTML
from django.shortcuts import render

from core.permissions import IsAdminUser, IsAdminOrStaff
from sales.filters import SalesFilter
#from core.mixins import CacheResponseMixin

from .models import (Delivery, DeliveryDetail, Order, OrderDetail, 
                      SalesDetail, Sale, SalesReceipt, DeliveryReceipt)
from .serializers import (DeliverySerializer, DeliveryDetailSerializer, 
                          OrderSerializer, OrderDetailSerializer,
                          SalesDetailSerializer, SaleSerializer,
                          SalesReceiptSerializer, DeliveryReceiptSerializer)



# Create your views here.
class SalesDetailViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
    queryset = SalesDetail.objects.all()
    serializer_class = SalesDetailSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]


class SaleViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
    queryset = Sale.objects.all()
    serializer_class = SaleSerializer
    pagination_class = pagination.PageNumberPagination
    filterset_class = SalesFilter
    search_fields = ['sale_uuid'] #^
    ordering_fields = ['created_at', 'updated_at']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class DeliveryDetailViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
    queryset = DeliveryDetail.objects.all()
    serializer_class = DeliveryDetailSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class DeliveryViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class OrderDetailViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
    queryset = OrderDetail.objects.all()
    serializer_class = OrderDetailSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

class OrderViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
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

class SalesReceiptViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
    queryset = SalesReceipt.objects.all()
    serializer_class = SalesReceiptSerializer
    pagination_class = pagination.PageNumberPagination
    search_fields = ['sale__id', 'sale__sale_uuid']
    ordering_fields = ['created_at']
    ordering = ['-created_at']

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['get'], permission_classes=[IsAdminOrStaff])
    def generate_pdf(self, request, pk=None):
        receipt = self.get_object()
        template = get_template('dashboard/components/receipt_template.html')
        context = {
            'receipt_id': receipt.id,
            'date': receipt.created_at,
            'customer_name': receipt.sale.customer_name,
            'amount': receipt.amount,
            **receipt.get_receipt_data()
        }
        html = template.render(context)
        pdf = HTML(string=html).write_pdf()

        response = HttpResponse(pdf, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="sales_receipt_{receipt.id}.pdf"'
        return response

class DeliveryReceiptViewSet(viewsets.ModelViewSet): #CacheResponseMixin,
    queryset = DeliveryReceipt.objects.all()
    serializer_class = DeliveryReceiptSerializer
    pagination_class = pagination.PageNumberPagination

    def get_permissions(self):
        if self.action in ['list', 'retrieve', "create", "update", "partial_update"]:
            permission_classes = [IsAdminOrStaff]
        else:
            permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['get'], permission_classes=[IsAdminOrStaff])
    def generate_pdf(self, request, pk=None):
        receipt = self.get_object()
        template = get_template('dashboard/components/receipt_template.html')
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
    

def receipt_view(request):
    data = {
        'from_name': 'John Smith',
        'from_address': '4490 Oak Drive',
        'from_city': 'Albany, NY 12210',
        'receipt_number': 'INT-001',
        'receipt_date': '11/02/2019',
        'po_number': '2412/2019',
        'due_date': '26/02/2019',
        'bill_to_name': 'Jessie M Horne',
        'bill_to_address': '4312 Wood Road',
        'bill_to_city': 'New York, NY 10031',
        'ship_to_name': 'Jessie M Horne',
        'ship_to_address': '2019 Redbud Drive',
        'ship_to_city': 'New York, NY 10011',
        'items': [
            {'qty': 1, 'description': 'Front and rear brake cables', 'unit_price': 100.00, 'amount': 100.00},
            {'qty': 2, 'description': 'New set of pedal arms', 'unit_price': 25.00, 'amount': 50.00},
            {'qty': 3, 'description': 'Labor 3hrs', 'unit_price': 15.00, 'amount': 45.00},
        ],
        'subtotal': 195.00,
        'tax_rate': 0.05,
        'tax_amount': 9.75,
        'total': 204.75,
        'terms_conditions': 'Payment is due within 15 days',
        'bank_name': 'Name of Bank',
        'account_number': '1234567890',
        'routing_number': '098765432'
    }
    return render(request, 'dashboard/components/receipt_template.html', data)


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