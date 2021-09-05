from django.urls import path,include
from rest_framework.routers import DefaultRouter

from .views import UserLoginAPI,ProductAPI,CartAPI,OrderAPI,OrderAddressAPI,DeleteCartItemAPI,EmptyCart,GetUser,GetServiceAvailablity,changeDeleiveryType,UpdateCustomerProfile

router = DefaultRouter()
router.register('products',ProductAPI,'products')
router.register('cart',CartAPI,'cart')
router.register('order',OrderAPI,'order')
router.register('adresses',OrderAddressAPI,'adresses')
router.register('DeleteCartItem',DeleteCartItemAPI,'DeleteCartItem')

urlpatterns = [
    path('',include(router.urls)),
    path('otp-login',UserLoginAPI.as_view(),name="loginApiView"),
    path('EmptyCart',EmptyCart,name="EmptyCart"),
    path('GetUser',GetUser,name="GetUser"),
    path('GetServiceAvailablity',GetServiceAvailablity,name="GetServiceAvailablity"),
    path('changeDeleiveryType',changeDeleiveryType,name="changeDeleiveryType"),
    path('UpdateCustomerProfile',UpdateCustomerProfile,name="UpdateCustomerProfile"),
]