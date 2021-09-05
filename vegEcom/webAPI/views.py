from django.shortcuts import render
from datetime import date as dateObj
from rest_framework import viewsets,generics,mixins,permissions,status
from knox.models import AuthToken
from rest_framework.response import Response
from django.db.models import Sum
from decimal import Decimal
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view,permission_classes

from .serializers import AdminUserSerializer, LoginSerializer,InvoiceSerializer,UserTransactionSerializer,CreateInvoiceSerializer,UpdateInvoiceSerializer,ProductSerializer,UpdateProductSerializer
from .models import Invoice,UserCreditLedger
from mobileAPI.serializers import OrderSerializer, OrderListSerialiizer,UserSerializer,ProductMediaSerializer
from mobileAPI.models import Order,Product,ProductMedia


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
        
        orders=[]
        if(('from_date' in self.request.query_params) or ('to_date' in self.request.query_params)):
            if('from_date' in self.request.query_params):
                from_date = self.request.query_params['from_date']
                orders = Invoice.objects.filter(created_at__gte=from_date).order_by('-created_at')
                print(orders)
            if ('to_date' in self.request.query_params):
                to_date = self.request.query_params['to_date']
                orders = Invoice.objects.filter(created_at__lte=to_date).order_by('-created_at')
                print('d', orders)
        else: 
            date = dateObj.today()
            orders = Invoice.objects.filter(created_at=date).order_by('-created_at')
        return orders
    
    def retrieve(self, request, pk=None):
        queryset = Invoice.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = InvoiceSerializer(user)
        return Response(serializer.data)
        


class AdminDueList(mixins.ListModelMixin,viewsets.GenericViewSet):
    serializer_class = UserTransactionSerializer
    permission_classes = [
        permissions.IsAdminUser
    ]

    def get_queryset(self):
        
        orders=[]
        if(('from_date' in self.request.query_params) or ('to_date' in self.request.query_params)):
            if('from_date' in self.request.query_params):
                from_date = self.request.query_params['from_date']
                orders = UserCreditLedger.objects.filter(transactionType="D", transactionDateTime__date__gte=from_date).order_by('-transactionDateTime')
                print('From date', orders)
            if ('to_date' in self.request.query_params):
                to_date = self.request.query_params['to_date']
                orders = UserCreditLedger.objects.filter(transactionType="D", transactionDateTime__date__lte=to_date).order_by('-transactionDateTime')
                print('To date', orders)
        else: 
            date = dateObj.today()
            orders = UserCreditLedger.objects.filter(transactionType="D", transactionDateTime__date=date).order_by('-transactionDateTime')
        return orders


class AdminPaymentList(mixins.ListModelMixin,viewsets.GenericViewSet):
    serializer_class = UserTransactionSerializer
    permission_classes = [
        permissions.IsAdminUser
    ]

    def get_queryset(self):
        
        orders=[]
        if(('from_date' in self.request.query_params) or ('to_date' in self.request.query_params)):
            if('from_date' in self.request.query_params):
                from_date = self.request.query_params['from_date']
                orders = UserCreditLedger.objects.filter(transactionType="P", transactionDateTime__date__gte=from_date).order_by('-transactionDateTime')
            if ('to_date' in self.request.query_params):
                to_date = self.request.query_params['to_date']
                orders = UserCreditLedger.objects.filter(transactionType="P", transactionDateTime__date__lte=to_date).order_by('-transactionDateTime')
        else: 
            date = dateObj.today()
            orders = UserCreditLedger.objects.filter(transactionType="P", transactionDateTime__date=date).order_by('-transactionDateTime')
        return orders
        




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
        date = dateObj.today()
        orders = []
        if(('from_date' in self.request.query_params) or ('to_date' in self.request.query_params)):
            if('from_date' in self.request.query_params):
                from_date = self.request.query_params['from_date']
                orders = Order.objects.filter(created_at__date__gte=from_date).order_by('-created_at')
                print('From date', orders)
            if ('to_date' in self.request.query_params):
                to_date = self.request.query_params['to_date']
                orders = orders.filter(created_at__date__lte=to_date).order_by('-created_at')
                print('To date', orders)
        elif 'today' in self.request.query_params:
            orders = Order.objects.filter(created_at__date=date).order_by('-created_at')
        else:
            orders = Order.objects.all()
        # print(orders)
        return orders
    
    def retrieve(self, request, pk=None):
        queryset = Order.objects.all()
        user = get_object_or_404(queryset, pk=pk)
        serializer = OrderListSerialiizer(user)
        return Response(serializer.data)

class AdminCustomerAPI(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [
        permissions.IsAdminUser
    ]

    def get_queryset(self):
        return User.objects.filter(is_superuser=False,is_staff=False)

class ProductAPI(viewsets.ModelViewSet):
    serializer_class = ProductSerializer
    permission_classes=[permissions.IsAdminUser]
    queryset=Product.objects.all()

class UpdateInvoiceAPI(viewsets.ModelViewSet):
    serializer_class = UpdateInvoiceSerializer
    permission_classes=[permissions.IsAdminUser]
    queryset=Invoice.objects.all()

@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def addProductMedia(request):
    err = {}
    if request.FILES["mediaUrl"] is None:
        err["mediaUrl"] = ["This Field is reuired."]
    
    if request.data.get("mediaType") is None:
        err["mediaType"] = ["This Field is reuired."]
    
    if request.data.get("productId") is None:
        err["productId"] = ["This Field is reuired."]
    
    if len(err) > 0:
        return Response(err,status=status.HTTP_400_BAD_REQUEST)
    
    serializer = ProductMediaSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    productMedia = serializer.save()

    product = Product.objects.get(id=request.data.get("productId"))
    product.media.add(productMedia)
    product.save()

    return Response(ProductMediaSerializer(productMedia).data)

@api_view(['DELETE'])
@permission_classes([permissions.IsAdminUser])
def removeProductMedia(request,id):
    ProductMedia.objects.filter(id=id).delete()
    return Response({})

class AdminUsersAPI(viewsets.ModelViewSet):
    serializer_class = AdminUserSerializer
    permission_classes = [permissions.IsAdminUser]
    queryset = User.objects.filter(is_superuser=True)

    









