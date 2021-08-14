from django.db.models import query
from django.shortcuts import render
from rest_framework import viewsets,mixins,permissions,status
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from knox.models import AuthToken
from django.contrib.auth import authenticate

from .models import SupplierProfile,SupplierProduct,SupplierOrder
from .serializers import UserSerializer,SupplierSerializer,SupplierProduct,UpdateSupplierSerializer

@api_view(["POST"])
def supplierLogin(request):
    username = request.data.get("username")
    password = request.data.get("password")
    error = {}
    if username is None:
        error["username"] = ["This field is required"]
    if password is None:
        error["password"] = ["This field is required"]

    if len(error) > 0:
        return Response(error,status=status.HTTP_400_BAD_REQUEST)
    
    user = authenticate(username=username,password=password)
    
    if user is None:
        return Response({"error":"Login Failed! Invalid username/password"},status=status.HTTP_400_BAD_REQUEST)
    try:
        userData = SupplierSerializer(user.SupplierProfile).data
    except SupplierProfile.DoesNotExist:
        return Response({"error":"Login Failed! Invalid username/password"},status=status.HTTP_400_BAD_REQUEST)

    return Response({
        "user" : userData,
        "token":AuthToken.objects.create(user)[1]
    })

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def getLoggedInSupplier(request):
    try:
        return Response({
            "user":SupplierSerializer(request.user.SupplierProfile).data
        })
    except SupplierProfile.DoesNotExist:
        return Response({
            "detail":"Invalid Token."
        },status=status.HTTP_401_UNAUTHORIZED)

@api_view(["POST"])
@permission_classes([permissions.IsAuthenticated])
def changeSupplierPassword(request):
    oldPassword = request.data.get("oldPassword")
    newPassword = request.data.get("newPassword")
    error={}
    if oldPassword is None:
        error["oldPassword"] = ["This field is required"]
    if newPassword is None:
        error["newPassword"] = ["This field is required"]

    if len(error) > 0:
        return Response(error,status=status.HTTP_400_BAD_REQUEST)

    user = request.user

    if user.check_password(oldPassword):
        user.set_password(newPassword)
        user.save()
        return Response({
            "message":"password updated successfully."
        })
    else:
        return Response({
            "error":"Invalid old Password."
        },status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def getDashboardData(request):
    try:
        return Response({
            "pendingOrders":request.user.SupplierProfile.orders.filter(is_accepted=False).count(),
            "acceptedOrders":request.user.SupplierProfile.orders.filter(is_accepted=True).count(),
            "completedOrders":request.user.SupplierProfile.orders.filter(is_completed=True).count(),
            "totalDueAmount":0,
        })
    except SupplierProfile.DoesNotExist:
        return Response({
            "detail":"Invalid Token."
        },status=status.HTTP_401_UNAUTHORIZED)
    
class UpdateSupplierProfile(mixins.CreateModelMixin,viewsets.GenericViewSet):
    serializer_class = UpdateSupplierSerializer
    permission_classes = [permissions.IsAuthenticated]
    queryset = SupplierProfile.objects.all()




