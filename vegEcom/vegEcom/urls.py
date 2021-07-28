
from django.contrib import admin
from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework.schemas import get_schema_view
from django.views.generic import TemplateView
from rest_framework.documentation import include_docs_urls

schema_view = get_schema_view(title='Veg Bags API')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('frontend.urls')),
    path('api/', include('mobileAPI.urls')),
    path('api/', include('webAPI.urls')),
    path('docs/', include_docs_urls(title='VegBags API')),
]

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)