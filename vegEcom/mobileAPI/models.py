from django.db import models
from django.contrib.auth.models import User
from django.db.models import Max
from datetime import datetime

class DeliveryType(models.Model):
    user = models.OneToOneField(User,on_delete=models.CASCADE,related_name="DeliveryType")
    deliveryType = models.CharField(max_length=1)

    def __str__(self):
        return self.user.username + self.deliveryType

class Unit(models.Model):
    unit = models.CharField(max_length=20)

    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    def __str__(self):
        return self.unit




class Type(models.Model):
    name = models.CharField(max_length=120)
    rPrice = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    gPrice = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    hPrice = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    rPriceQuantity = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    gPriceQuantity = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    hPriceQuantity = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    avlQty = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)

    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    @property
    def RestrauntPrice(self):
        return str(self.rPrice) + ' / ' + str(self.rPriceQuantity) + ' KGS' 

    @property
    def GeneralStorePrice(self):
        return str(self.gPrice) + ' / ' + str(self.gPriceQuantity) + ' KGS' 

    @property
    def HouseHoldPrice(self):
        return str(self.hPrice) + ' / ' + str(self.hPriceQuantity) + ' KGS' 

    @property
    def AvailableQty(self):
        return str(self.avlQty) + ' KGS' 

    def __str__(self):
        return self.name

class ProductMedia(models.Model):
    mediaType = models.CharField(max_length=1,choices=(('V','V'),('I','I')))
    mediaUrl = models.FileField(upload_to='ProductMedia/')

    def __str__(self):
        return self.mediaType

class Product(models.Model):
    image =  models.ImageField(upload_to='category/')
    name = models.CharField(max_length=120)
    description = models.TextField(null=True,blank=True)
    types = models.ManyToManyField(Type,related_name="productTypes")
    media = models.ManyToManyField(ProductMedia,related_name="productMedia")

    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    @property
    def total_Qty(self):
        queryset = self.types.all().aggregate(
            total_qty=models.Sum('avlQty'))
        return queryset["total_qty"]

    def __str__(self):
        return self.name


class CartItem(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE,related_name="CartProducts")
    productType = models.ForeignKey(Type,on_delete=models.CASCADE,related_name="CartProductTypes")
    qty = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    unit = models.CharField(max_length=25,default="BAGS")

    

    def __str__(self):
        return self.product.name

class Cart(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="UserCart",null=True,blank=True)
    cartItems = models.ManyToManyField(CartItem,related_name="CartItems")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username

class OrderItem(models.Model):
    product = models.ForeignKey(Product,on_delete=models.CASCADE)
    productType = models.ForeignKey(Type,on_delete=models.CASCADE)
    qty = models.DecimalField(max_digits=10,decimal_places=2,default=0.00)
    unit = models.CharField(max_length=25,default="BAGS")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    

    def __str__(self):
        return self.product.name

def generateOrderId():
    import datetime
    now = datetime.datetime.now()
    uid = Order.objects.aggregate(Max('id'))
    uid = uid['id__max'] 
    if uid == None:
        uid = 0
    return 'VBO'+ str(now.year) + str(uid+1)

class OrderAddress(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="UserAddress",null=True,blank=True)
    contactName = models.CharField(max_length=255)
    phoneNo = models.CharField(max_length=15)
    altPhoneNo = models.CharField(max_length=15,null=True,blank=True)
    address = models.TextField(null=True,blank=True)
    pincode = models.CharField(max_length=15)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    

    def __str__(self):
        return self.contactName



class Order(models.Model):
    user = models.ForeignKey(User,on_delete=models.CASCADE,related_name="UserOrders",null=True,blank=True)
    orderId = models.CharField(max_length=255,default=generateOrderId)
    items = models.ManyToManyField(OrderItem,related_name="OrderItems")
    status = models.CharField(max_length=255,default="Pending")
    shippingAddress = models.ForeignKey(OrderAddress,on_delete=models.SET_NULL,null=True,related_name="ShippingAddress")
    billingAddress = models.ForeignKey(OrderAddress,on_delete=models.SET_NULL,null=True,related_name="BillingAddress")
    isInvoiceCreated = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def formattedCreatedAt(self):
        return datetime.strftime(self.created_at,"%Y-%m-%d %I:%M %p")
    
    @property
    def formattedUpdatedAt(self):
        return datetime.strftime(self.updated_at,"%Y-%m-%d %I:%M %p")

    def __str__(self):
        return self.orderId


