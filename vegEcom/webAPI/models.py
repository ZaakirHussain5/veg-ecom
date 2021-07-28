from django.db import models
from django.contrib.auth.models import User
from django.db.models import Max
from datetime import datetime 

def generateInvoiceID():
    import datetime
    now = datetime.datetime.now()
    uid = Invoice.objects.aggregate(Max('id'))
    uid = uid['id__max'] 
    if uid == None:
        uid = 0 
    return 'VBI'+ str(now.year) + str(uid+1)

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

class UserCreditLedger(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="transactions")
    refId = models.CharField(max_length=120,default="N/A")
    description = models.TextField(null=True,blank=True)
    transactionType = models.CharField(max_length=1,default='D')
    amount = models.DecimalField(max_digits=10,decimal_places=2)
    transactionDateTime = models.DateTimeField(auto_now_add=True)

    @property
    def formattedTransactionDateTime(self):
        return datetime.strftime(self.transactionDateTime,"%Y-%m-%d %I:%M %p")

    def __str__(self):
        return self.user.username + self.transactionType
    
class ServiceLocation(models.Model):
    pincode = models.CharField(max_length=10)

    def __str__(self):
        return self.pincode





