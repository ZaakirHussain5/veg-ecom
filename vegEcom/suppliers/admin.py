from django.contrib import admin
from .models import SupplierProfile,SupplierProduct,SupplierOrder

admin.site.register((SupplierProfile,SupplierProduct,SupplierOrder))

# Register your models here.
