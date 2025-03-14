"""
URL configuration for system project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.conf import settings
from django.urls import path, include

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView
from allauth.account.decorators import secure_admin_login

from . import views

admin.autodiscover()
admin.site.login = secure_admin_login(admin.site.login)

urlpatterns = [
    
    path("home/", include("home.urls")),
    path("admin/", admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path("i18n/", include("django.conf.urls.i18n")),

    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    path('no_permission/', views.no_permission, name='no_permission'),
    path("api/notification/", include("django_notification.api.routers.notification")),

    path("api/accounts/", include("accounts.urls")),
    path("api/shelf/", include("products.urls")),
    path("api/manage/", include("management.urls")),
    path("api/sale/", include("sales.urls")),

    path('', include("dashboard.urls")),
    path('', include('pwa.urls')),
]

if settings.DEBUG:
    from django.conf.urls.static import static
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)