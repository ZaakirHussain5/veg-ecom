from rest_framework import routers
from django.urls import path,include

from .views import LoginAPI,UserInvoiceAPI,AdminInvoiceAPI, AdminPaymentList, AdminDueList, invoice,UserLedgerAPI,UserPaymentAPI,AdminOrderAPI,AdminCustomerAPI,ProductAPI

router = routers.DefaultRouter()
router.register('invoices',UserInvoiceAPI,'invoices')
router.register('w/invoices',AdminInvoiceAPI,'adminInvoices')
router.register('w/payments',AdminPaymentList,'adminpayments')
router.register('w/dues',AdminDueList,'admindues')
router.register('newPayment',UserPaymentAPI,'newPayment')
router.register('w/AdminOrder',AdminOrderAPI,'AdminOrder')
router.register('w/AdminCustomer',AdminCustomerAPI,'AdminCustomer')
router.register('w/product',ProductAPI,'product')

urlpatterns = [
    path('',include(router.urls)),
    path('invoice',invoice,name='invoice'),
    path('CreditLedger',UserLedgerAPI.as_view(),name='CreditLedger'),
    path('w/login',LoginAPI.as_view(),name='login'),
]