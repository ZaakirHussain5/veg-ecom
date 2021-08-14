from django.shortcuts import render
from rest_framework import viewsets,generics,mixins,permissions,status
from rest_framework.response import Response
from knox.models import AuthToken
from rest_framework.decorators import api_view,permission_classes

from .serializers import UserLogin,ProductSerializer,CartSerializer,CartDetailsSerializer,OrderSerializer,OrderAddressSerialiizer,CartItemSerializer,CartListSerializer,OrderListSerialiizer,UserSerializer
from .models import DeliveryType, Product,OrderAddress,CartItem
from webAPI.serializers import ServiceLocationSerializer
from webAPI.models import ServiceLocation

class UserLoginAPI(generics.GenericAPIView):
    serializer_class = UserLogin

    def post(self,request,*args,**kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        _, token = AuthToken.objects.create(user)
        return Response({
            "user":UserSerializer(user, context=self.get_serializer_context()).data,
            "token": token
        })

class ProductAPI(mixins.ListModelMixin,mixins.RetrieveModelMixin,viewsets.GenericViewSet):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

class DeleteCartItemAPI(mixins.DestroyModelMixin,viewsets.GenericViewSet):
    serializer_class = CartItemSerializer
    queryset = CartItem.objects.all()

class OrderAddressAPI(viewsets.ModelViewSet):
    serializer_class = OrderAddressSerialiizer
    
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        
        return self.request.user.UserAddress.all()
    
    def perform_create(self,serializer):
        return serializer.save(user=self.request.user)


class CartAPI(viewsets.ModelViewSet):
    serializer_class = CartSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        self.serializer_class = CartListSerializer
        return self.request.user.UserCart.all()
    
    def perform_create(self,serializer):
        return serializer.save(user=self.request.user)
    

class OrderAPI(viewsets.ModelViewSet):
    serializer_class = OrderSerializer

    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        self.serializer_class = OrderListSerialiizer
        return self.request.user.UserOrders.all()
    
    def perform_create(self,serializer):
        return serializer.save(user=self.request.user)


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def EmptyCart(request):
    request.user.UserCart.all().first().cartItems.all().delete()
    return Response({
        "message":"Cart is now Empty!"
    }) 

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def changeDeleiveryType(request):
    if request.data.get('type') is None:
        return Response({
            "type":"This field is Required"
        },status=status.HTTP_400_BAD_REQUEST)
    if request.data.get('name') is None:
        return Response({
            "name":"This field is Required"
        },status=status.HTTP_400_BAD_REQUEST)
    try:
        dt = request.user.DeliveryType
        dt.deliveryType = request.data.get('type')
        dt.name = request.data.get('name')
        dt.save()
    except DeliveryType.DoesNotExist:
        dt = DeliveryType.objects.create(user=request.user,deliveryType=request.data.get('type'),name=request.data.get('name'))
    return Response({
        "message":"Delivery Type Updated Successfully"
    }) 

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def GetUser(request):
    return Response({
        "user":UserSerializer(request.user).data
    })

@api_view(['GET'])
def GetServiceAvailablity(request):
    pincode = request.query_params.get('code')
    if pincode is None:
        return Response({
            "error":"code parameter missing in the url."
        },status=status.HTTP_400_BAD_REQUEST)
    try:
        ServiceLocation.objects.get(pincode=pincode)
        return Response({
            "message":"Service Avalible at your Location."
        })
    except ServiceLocation.DoesNotExist:
        return Response({
            "error":"Sorry!! Service Not Available in your Location at the moment."
        },status=status.HTTP_404_NOT_FOUND)
     