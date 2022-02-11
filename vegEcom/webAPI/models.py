from email.policy import default
from unicodedata import decimal
from django.db import models
from django.contrib.auth.models import User
from django.db.models import Max
from django.utils import timezone
from datetime import datetime 

def generateInvoiceID():
    import datetime
    now = datetime.datetime.now()
    uid = Invoice.objects.aggregate(Max('id'))
    uid = uid['id__max'] 
    if uid == None:
        uid = 0 
    return 'VBI'+ str(now.year) + str(uid+1)

def generateQuotationNo():
    import datetime
    now = datetime.datetime.now()
    uid = Quotation.objects.aggregate(Max('id'))
    uid = uid['id__max'] 
    if uid == None:
        uid = 0 
    return 'VBQ'+ str(now.year) + str(uid+1)


class Quotation(models.Model):
    quotationNo = models.CharField(max_length=15,default=generateQuotationNo)
    name = models.CharField(max_length=120)
    email = models.CharField(max_length=120,null=True,blank=True)
    phoneNumber = models.CharField(max_length=15)
    address = models.TextField(null=True,blank=True)
    total = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    discount = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    totalCharges = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    grandTotal = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)

    created_at=models.DateField(auto_now_add=True)

    def __str__(self):
        return self.quotationNo

class QuotationItem(models.Model):
    quotation = models.ForeignKey(Quotation,on_delete=models.CASCADE,related_name="QuotationItems",null=True,blank=True)
    item = models.CharField(max_length=120)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    qty = models.DecimalField(max_digits=10,decimal_places=2)
    unit = models.CharField(max_length=120)
    total = models.DecimalField(max_digits=10,decimal_places=2)

    def __str__(self):
        return self.item

class QuotationCharges(models.Model):
    quotation = models.ForeignKey(Quotation,on_delete=models.CASCADE,related_name="QuotationCharges",null=True,blank=True)
    chargeName = models.CharField(max_length=20)
    chargeAmount = models.DecimalField(max_digits=10,decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



class Invoice(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="Invoices",null=True,blank=True)
    invoiceID = models.CharField(max_length=20,default=generateInvoiceID)
    shippingAddress = models.TextField(null=True,blank=True)
    billingAddress = models.TextField(null=True,blank=True)
    total = models.DecimalField(decimal_places=2,max_digits=20,default=0.00)
    discount = models.DecimalField(decimal_places=2,max_digits=20,default=0.00)
    grandTotal = models.DecimalField(decimal_places=2,max_digits=20,default=0.00)
    paid = models.DecimalField(decimal_places=2,max_digits=20,default=0.00)
    balance = models.DecimalField(decimal_places=2,max_digits=20,default=0.00)
    status = models.CharField(max_length=15)

    created_at = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return self.invoiceID

class InvoiceItem(models.Model):
    invoice = models.ForeignKey(Invoice,on_delete=models.CASCADE,related_name="items",null=True,blank=True)
    item = models.CharField(max_length=120)
    price = models.DecimalField(max_digits=10,decimal_places=2)
    qty = models.DecimalField(max_digits=10,decimal_places=2)
    unit = models.CharField(max_length=120)
    total = models.DecimalField(max_digits=10,decimal_places=2)

    def __str__(self):
        return self.item

class InvoiceCharges(models.Model):
    invoice = models.ForeignKey(Invoice,on_delete=models.CASCADE,related_name="charges",null=True,blank=True)
    chargeName = models.CharField(max_length=20)
    chargeAmount = models.DecimalField(max_digits=10,decimal_places=2)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class UserCreditLedger(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="transactions")
    refId = models.CharField(max_length=120,default="N/A")
    description = models.TextField(null=True,blank=True)
    transactionType = models.CharField(max_length=1,default='D')
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    transactionDateTime = models.DateField(default=timezone.now)

    @property
    def formattedTransactionDateTime(self):
        return self.transactionDateTime

    def __str__(self):
        return self.user.username + self.transactionType + ' ' + str(self.transactionDateTime)
    
class ServiceLocation(models.Model):
    pincode = models.CharField(max_length=10)

    def __str__(self):
        return self.pincode





