from django.contrib import admin

from .models import Invoice,InvoiceItem, ServiceLocation,UserCreditLedger,ServiceLocation,InvoiceCharges

# Register your models here.
admin.site.register((Invoice,InvoiceItem,UserCreditLedger,ServiceLocation,InvoiceCharges))
