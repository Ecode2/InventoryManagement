from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

action_router = DefaultRouter()
action_router.register(r'actions', views.UserActions, basename='user_actions')

""" crud_router = DefaultRouter()
crud_router.register(r'', views.UserView, basename="user_crud") """

urlpatterns = [
    path('users/', views.UserListView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path("", include(action_router.urls)),
    #path("", include(crud_router.urls)),
]