from django.db import models
from django.contrib.auth.models import User

from mobileAPI.models import Order

class SupplierProfile(models.Model):
    user = models.OneToOneField(User,related_name="SupplierProfile",on_delete=models.CASCADE)
    address = models.TextField()
    pincode = models.CharField(max_length=10)

    created_at=models.DateField(auto_now_add=True)
    update_at=models.DateField(auto_now=True)

    def __str__(self):
        return self.user.username

class SupplierProduct(models.Model):
    supplier = models.ForeignKey(SupplierProfile,related_name="products",on_delete=models.CASCADE,null=True,blank=True)
    name = models.CharField(max_length=120)

    created_at=models.DateField(auto_now_add=True)
    update_at=models.DateField(auto_now=True)

class SupplierOrder(models.Model):
    supplier = models.ForeignKey(SupplierProfile,related_name="orders",on_delete=models.CASCADE)
    order = models.ForeignKey(Order,on_delete=models.CASCADE)
    is_accepted = models.BooleanField(default=False)
    is_completed = models.BooleanField(default=False)

    created_at=models.DateField(auto_now_add=True)
    update_at=models.DateField(auto_now=True)


