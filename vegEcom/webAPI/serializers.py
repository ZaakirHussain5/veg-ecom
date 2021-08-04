from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Sum

from .models import Invoice,InvoiceItem,UserCreditLedger,ServiceLocation,InvoiceCharges 
from mobileAPI.serializers import UserSerializer
from mobileAPI.models import Order

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
            UserCreditLedger.objects.create(refId=invoice.invoiceID,description="Amount Due Towards Bill# "+invoice.invoiceID,amount=invoice.balance)
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
        UserCreditLedger.objects.filter(refId=invoice.invoiceID).delete()
        InvoiceItem.objects.filter(invoice=invoice).delete()
        InvoiceCharges.objects.filter(invoice=invoice).delete()

        if invoice.balance:
            UserCreditLedger.objects.create(refId=invoice.invoiceID,description="Amount Due Towards Bill# "+invoice.invoiceID,amount=invoice.balance)
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
