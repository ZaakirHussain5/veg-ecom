from django.db.models import fields
from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db.models import Sum

from .models import Invoice,InvoiceItem,UserCreditLedger,ServiceLocation 
from mobileAPI.serializers import UserSerializer

class InvoiceItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=InvoiceItem
        fields='__all__'

class InvoiceSerializer(serializers.ModelSerializer):
    invoiceItems = serializers.SerializerMethodField(method_name="getInvoiceItems")
    user = UserSerializer()

    def getInvoiceItems(self,obj):
        invItems = InvoiceItem.objects.filter(invoice=obj)
        return InvoiceItemSerializer(invItems,many=True).data 

    class Meta:
        model = Invoice
        fields = ('id','invoiceID','shippingAddress','billingAddress','total','discount','grandTotal','paid','balance','status','invoiceItems','user','created_at')


class CreateInvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)
    fullname = serializers.CharField(max_length=80,write_only=True)
    phoneNo = serializers.CharField(max_length=15,write_only=True)
    user = UserSerializer(read_only=True)

    def create(self, validated_data):
        invoice_items = validated_data.pop('items')
        fullname = validated_data.pop('fullname')
        phoneNo = validated_data.pop('phoneNo')

        user,_ = User.objects.get_or_create(username=phoneNo)
        user.first_name = fullname
        user.save()
        invoice = Invoice.objects.create(user=user,**validated_data)
        if invoice.balance:
            UserCreditLedger.objects.create(refId=invoice.invoiceID,description="Amount Due Towards Bill# "+invoice.invoiceID,amount=invoice.balance)
        for invoice_item in invoice_items:
            InvoiceItem.objects.create(invoice=invoice, **invoice_item)
        return invoice
    
    def update(self, instance, validated_data):
        instance.shippingAddress = validated_data.get('shippingAddress', instance.shippingAddress)
        instance.billingAddress = validated_data.get('billingAddress', instance.billingAddress)
        instance.total = validated_data.get('total', instance.total)
        instance.discount = validated_data.get('discount', instance.discount)
        instance.grandTotal = validated_data.get('grandTotal', instance.grandTotal)
        instance.paid = validated_data.get('paid', instance.paid)
        instance.balance = validated_data.get('balance', instance.balance)
        instance.status = validated_data.get('status', instance.status)
        
        user,_ = User.objects.get_or_create(username=validated_data.get('phoneNo'))
        user.first_name = validated_data.get('fullname')
        user.save()
        
        instance.save()

        items = validated_data.get('items')

        InvoiceItem.objects.filter(invoice=instance).delete()

        for item in items:
            InvoiceItem.objects.create(invoice=instance, **item)

        return instance
    
    class Meta:
        model = Invoice
        fields = ('invoiceID','shippingAddress','billingAddress','total','discount','grandTotal','paid','balance','status','items','fullname','phoneNo','user')


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
