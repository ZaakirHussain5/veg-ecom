from django.contrib import admin

from .models import Unit,Product,Type,ProductMedia,OrderAddress,OrderItem,Cart,CartItem,Order

# Register your models here.
admin.site.register((Unit,Product,Type,ProductMedia,OrderAddress,OrderItem,Cart,CartItem,Order))

