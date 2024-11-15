from django.shortcuts import render
from rest_framework import response, status, permissions, viewsets, pagination, mixins, generics
from rest_framework.decorators import api_view, action
from django_notification.models.notification import Notification
from django_notification.models.helper.enums.status_choices import NotificationStatus

from core.permissions import IsAdminOrStaff, IsAdminUser, IsAuthor
from management.serializers import WarehouseSerializer

from .models import User
from .serializers import UserSerializer

# Create your views here.

class UserActions(viewsets.ViewSet):


    @action(detail=False, methods=['get'])
    def role(self, request):
        """ # Define the actor and recipients
        actor = User.objects.filter(role="admin")[0]
        recipient = self.request.user

        # Create a new notification
        Notification.queryset.create_notification(
            verb="Logged in to Admin panel",
            actor=actor,
            recipients=[recipient],
            description="User logged in to admin area.",
            status=NotificationStatus.INFO,
            public=True,
            link="https://example.com/admin/dashboard",
            is_sent=True,
        ) """
        return response.Response(data={"role": self.request.user.role}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], permission_classes=[IsAdminOrStaff])
    def store(self, request):
        warehouse = WarehouseSerializer(self.request.user.store)
        return response.Response(data=warehouse.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'])
    def info(self, request):
        user_info = UserSerializer(self.request.user)
        return response.Response(data=user_info.data, status=status.HTTP_200_OK)
    
    @action(detail=True, methods=['put'], permission_classes=[IsAdminOrStaff, IsAuthor])
    def info_update(self, request, pk=None):
        user = self.request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return response.Response(data=serializer.data, status=status.HTTP_200_OK)
    
""" class UserView(mixins.ListModelMixin,
               mixins.RetrieveModelMixin,
               mixins.UpdateModelMixin,
               viewsets.GenericViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = pagination.PageNumberPagination
    filterset_fields = ['store', 'role', 'is_active']
    ordering_fields = ['username', 'last_login', 'date_joined']
    search_fields = ["user_uuid", "email", "username", "id"]
    ordering = ['-date_joined']

    def get_permissions(self):
        permission_classes = [IsAdminUser]
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        print("something \n")
        return super().list(request, *args, **kwargs) """
    
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    pagination_class = pagination.PageNumberPagination
    filterset_fields = ['store', 'role', 'is_active']
    ordering_fields = ['username', 'last_login', 'date_joined']
    search_fields = ["user_uuid", "email", "username", "id"]
    ordering = ['-date_joined']
    permission_classes = [IsAdminUser]

class UserDetailView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]