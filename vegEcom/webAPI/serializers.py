from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Sum

from .models import Invoice,InvoiceItem,UserCreditLedger,ServiceLocation,InvoiceCharges 
from mobileAPI.serializers import UserSerializer,ProductMediaSerializer
from mobileAPI.models import Order,Product,Type

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=InvoiceItem
        fields='__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    invoiceItems = serializers.SerializerMethodField(method_name="getInvoiceItems")
    invoiceCharges = serializers.SerializerMethodField(method_name="getInvoiceCharges")
    user = UserSerializer()

    def getInvoiceItems(self,obj):
        invItems = InvoiceItem.objects.filter(invoice=obj)
        return InvoiceItemSerializer(invItems,many=True).data 
    
    def getInvoiceCharges(self,obj):
        invCharges = InvoiceCharges.objects.filter(invoice=obj)
        return InvoiceChargesSerializer(invCharges,many=True).data 

    class Meta:
        model = Invoice
        fields = ('id','invoiceID','shippingAddress','billingAddress','total','discount','grandTotal','paid','balance','status','invoiceItems','invoiceCharges','user','created_at')

class InvoiceChargesSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvoiceCharges
        fields = '__all__'

class CreateInvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)
    charges = InvoiceChargesSerializer(many=True)
    fullname = serializers.CharField(max_length=80,write_only=True,allow_blank=True)
    phoneNo = serializers.CharField(max_length=15,write_only=True)
    orderId = serializers.CharField(max_length=15,write_only=True,required=False)
    user = UserSerializer(read_only=True,required=False)

    def create(self, validated_data):
        invoice_items = validated_data.pop('items')
        invoice_charges = validated_data.pop('charges')
        fullname = validated_data.pop('fullname')
        phoneNo = validated_data.pop('phoneNo')
        try:
            orderId = validated_data.pop('orderId')
            Order.objects.filter(id=orderId).update(isInvoiceCreated=True)
        except:
            pass

        user,_ = User.objects.get_or_create(username=phoneNo)
        user.first_name = fullname
        user.save()
        invoice = Invoice.objects.create(user=user,**validated_data)
        if invoice.balance:
            UserCreditLedger.objects.create(user=user,refId=invoice.invoiceID,description="Amount Due Towards Bill# "+invoice.invoiceID,amount=invoice.balance)
        for invoice_item in invoice_items:
            InvoiceItem.objects.create(invoice=invoice, **invoice_item)
        for invoice_charge in invoice_charges:
            InvoiceCharges.objects.create(invoice=invoice, **invoice_charge)
        return invoice
    
    class Meta:
        model = Invoice
        fields = ('id','invoiceID','shippingAddress','billingAddress','total','discount','grandTotal','paid','balance','status','items','fullname','phoneNo','charges','orderId','user')

class UpdateInvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)
    charges = InvoiceChargesSerializer(many=True)
    fullname = serializers.CharField(max_length=80,write_only=True,allow_blank=True)
    phoneNo = serializers.CharField(max_length=15,write_only=True)
    invoiceId = serializers.CharField(max_length=15,write_only=True)

    def create(self, validated_data):
        invoice_items = validated_data.pop('items')
        invoice_charges = validated_data.pop('charges')
        fullname = validated_data.pop('fullname')
        phoneNo = validated_data.pop('phoneNo')
        invoiceId = validated_data.pop('invoiceId')

        user,_ = User.objects.get_or_create(username=phoneNo)
        user.first_name = fullname
        user.save()
        Invoice.objects.filter(id=invoiceId).update(**validated_data)
        invoice = Invoice.objects.get(id=invoiceId)
        invoice.user = user
        invoice.save()
        UserCreditLedger.objects.filter(refId=invoice.invoiceID).delete()
        InvoiceItem.objects.filter(invoice=invoice).delete()
        InvoiceCharges.objects.filter(invoice=invoice).delete()

        if invoice.balance:
            UserCreditLedger.objects.create(user=user,refId=invoice.invoiceID,description="Amount Due Towards Bill# "+invoice.invoiceID,amount=invoice.balance)
        for invoice_item in invoice_items:
            InvoiceItem.objects.create(invoice=invoice, **invoice_item)
        for invoice_charge in invoice_charges:
            InvoiceCharges.objects.create(invoice=invoice, **invoice_charge)
        return invoice
    
    class Meta:
        model = Invoice
        fields = ('id','invoiceID','shippingAddress','billingAddress','total','discount','grandTotal','paid','balance','status','items','fullname','phoneNo','charges','invoiceId')


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self,data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid Username/Password!")


class UserTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserCreditLedger
        fields = ('id','description','refId','transactionType','amount','formattedTransactionDateTime')

class ServiceLocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceLocation
        fields = '__all__'

class ProductTypeSeraizer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields=('id','name','rPrice','gPrice','hPrice','rPriceQuantity','gPriceQuantity','hPriceQuantity','avlQty')

class ProductSerializer(serializers.ModelSerializer):
    types=ProductTypeSeraizer(many=True,read_only=True)
    typesJson = serializers.JSONField(write_only=True)
    media = ProductMediaSerializer(read_only=True,many=True)

    def create(self,validated_data):
        productTypes = validated_data.pop('typesJson')
        product = Product.objects.create(**validated_data)

        for pt in productTypes["types"]:
            productType = Type.objects.create(**pt)
            product.types.add(productType)
        
        return product
    
    def update(self,instance,validated_data):
        productTypes = validated_data.pop("typesJson")
        for attr,value in validated_data.items():
            if attr == "image" and value is not None:
                setattr(instance,attr,value)
        
        instance.types.all().delete()

        for pt in productTypes["types"]:
            productType = Type.objects.create(**pt)
            instance.types.add(productType)
        
        instance.save()
        return instance

    class Meta:
        model = Product
        fields = ('id','image','name','description','types','typesJson','media')

class UpdateProductSerializer(serializers.ModelSerializer):
    types=ProductTypeSeraizer(many=True,read_only=True)
    typesJson = serializers.JSONField(write_only=True)
    id = serializers.IntegerField()

    def create(self,validated_data):
        id = validated_data.pop('id')
        productTypes = validated_data.pop('typesJson')
        product =Product.objects.get(id=id)
        product.types.all().delete()
        product.delete()
        product = Product.objects.create(**validated_data)

        for pt in productTypes["types"]:
            productType = Type.objects.create(**pt)
            product.types.add(productType)
        
        return product

    class Meta:
        model = Product
        fields = ('id','image','name','description','types','typesJson')

