from rest_framework.routers import DefaultRouter
from django.urls import path,include

from .views import supplierLogin,getLoggedInSupplier,UpdateSupplierProfile,getDashboardData,changeSupplierPassword

router = DefaultRouter()
router.register('s/updateProfile',UpdateSupplierProfile,'UpdateSupplierProfile')

urlpatterns = [
    path('',include(router.urls)),
    path('s/login',supplierLogin,name="supplierLogin"),
    path('s/loggedInSupplier',getLoggedInSupplier,name="getLoggedInSupplier"),
    path('s/changePassword',changeSupplierPassword,name="changeSupplierPassword"),
    path('s/dashboard',getDashboardData,name="getDashboardData"),
]