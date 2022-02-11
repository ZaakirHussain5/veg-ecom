from rest_framework import routers
from django.urls import path,include

from .views import QuotationsAPI, getGraphData, AdminUsersAPI, LoginAPI,UserInvoiceAPI,AdminInvoiceAPI, AdminPaymentList, AdminDueList, invoice,UserLedgerAPI,UserPaymentAPI,AdminOrderAPI,AdminCustomerAPI,ProductAPI,addProductMedia, quotation,removeProductMedia,UpdateInvoiceAPI,getTodaysIncome,ServicesLocationAPI

router = routers.DefaultRouter()
router.register('invoices',UserInvoiceAPI,'invoices')
router.register('w/invoices',AdminInvoiceAPI,'adminInvoices')
router.register('w/UpdateInvoice',UpdateInvoiceAPI,'adminInvoices')
router.register('w/payments',AdminPaymentList,'adminpayments')
router.register('w/dues',AdminDueList,'admindues')
router.register('newPayment',UserPaymentAPI,'newPayment')
router.register('w/AdminOrder',AdminOrderAPI,'AdminOrder')
router.register('w/AdminCustomer',AdminCustomerAPI,'AdminCustomer')
router.register('w/product',ProductAPI,'product')
router.register('w/pincodes',ServicesLocationAPI,'pincodes')
router.register('w/users',AdminUsersAPI,'users')
router.register('w/quotations',QuotationsAPI,'Quotations')

urlpatterns = [
    path('',include(router.urls)),
    path('invoice',invoice,name='invoice'),
    path('quotation',quotation,name='quotation'),
    path('w/getGraphData',getGraphData,name='getGraphData'),
    path('w/getTodaysIncome',getTodaysIncome,name='getTodaysIncome'),
    path('CreditLedger',UserLedgerAPI.as_view(),name='CreditLedger'),
    path('w/login',LoginAPI.as_view(),name='login'),
    path('w/addProductMedia',addProductMedia,name='addProductMedia'),
    path('w/removeProductMedia/<int:id>/',removeProductMedia,name='removeProductMedia'),
]