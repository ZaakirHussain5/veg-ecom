from django.shortcuts import render
from rest_framework import viewsets,generics,mixins,permissions
from knox.models import AuthToken
from rest_framework.response import Response
from django.db.models import Sum
from decimal import Decimal
from django.contrib.auth.models import User

from .serializers import LoginSerializer,InvoiceSerializer,UserTransactionSerializer,CreateInvoiceSerializer
from .models import Invoice,UserCreditLedger
from mobileAPI.serializers import OrderSerializer, OrderListSerialiizer,UserSerializer
from mobileAPI.models import Order


def invoice(request):
    invoiceID = request.GET.get('invoice')
    context = {}
    if invoiceID is None:
        context["Error"] = "400! Invoice ID Not Found in the url"
        return render(request,'invoice.html',context)
    try:
        invoice = Invoice.objects.get(invoiceID=invoiceID)
        context["invoice"] = invoice
    except Invoice.DoesNotExist:
        context["Error"] = "404! No Invoice Found for id "+invoiceID
    return render(request,'invoice.html',context)

class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        _, token = AuthToken.objects.create(user)
        return Response({
            "token": token
        })

class UserInvoiceAPI(mixins.ListModelMixin,mixins.RetrieveModelMixin,viewsets.GenericViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [
        permissions.IsAuthenticated
    ]

    def get_queryset(self):
        return self.request.user.Invoices.all()

class AdminInvoiceAPI(viewsets.ModelViewSet):
    serializer_class = CreateInvoiceSerializer
    permission_classes = [
        permissions.IsAdminUser
    ]

    def get_queryset(self):
        self.serializer_class = InvoiceSerializer
        return Invoice.objects.all().order_by('-created_at')
        

class UserLedgerAPI(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        dues = user.transactions.filter(transactionType='D').aggregate(Sum('amount'))
        payments = user.transactions.filter(transactionType='P').aggregate(Sum('amount'))
        dues = dues["amount__sum"] if dues["amount__sum"] else Decimal(0.00) 
        payments = payments["amount__sum"] if payments["amount__sum"] else Decimal(0.00)

        balance = dues - payments

        return Response({
            "balance":balance,
            "dues":UserTransactionSerializer(user.transactions.filter(transactionType='D'),many=True).data,
            "payments":UserTransactionSerializer(user.transactions.filter(transactionType='P'),many=True).data
        })

class UserPaymentAPI(mixins.CreateModelMixin,viewsets.GenericViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserTransactionSerializer

    def perform_create(self,serializer):
        return serializer.save(user=self.request.user)

class AdminOrderAPI(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [
        permissions.IsAdminUser
    ]
    
    def get_queryset(self):
        self.serializer_class = OrderListSerialiizer
        return Order.objects.all().order_by('-created_at')

class AdminCustomerAPI(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [
        permissions.IsAdminUser
    ]

    def get_queryset(self):
        return User.objects.filter(is_superuser=False,is_staff=False)




