from django.db.models import fields
from rest_framework import serializers
from django.contrib.auth.models import User

from .models import SupplierProfile,SupplierProduct,SupplierOrder

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','password','first_name')
        extra_kwargs = {'password':{'write_only':True,'required':False}}

class SupplierProductSerializer(serializers.ModelSerializer):
    class Meta:
        model =SupplierProduct
        fields ='__all__'

class SupplierSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    products = SupplierProductSerializer(many=True)

    def create(self,validated_data):
        user = validated_data.pop("user")
        products = validated_data.pop("products")
        user = User.objects.create_user(**user)
        supplierProfile = SupplierProfile.objects.create(user=user,**validated_data)
        for product in products:
            SupplierProduct.objects.create(supplier=supplierProfile,**product)
        return supplierProfile

    class Meta:
        model = SupplierProfile
        fields = ('id','user','products','address','pincode')

class UpdateSupplierSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    products = SupplierProductSerializer(many=True)

    def create(self,validated_data):
        user = self.context.get("request").user

        try:
            supplierProfile = user.SupplierProfile
        except SupplierProfile.DoesNotExist:
            raise serializers.ValidationError("Invalid token.")

        products = validated_data.pop("products")

        for attr,value in validated_data["user"].items():
            setattr(user,attr,value)
        
        user.save()

        supplierProfile.address = validated_data["address"]
        supplierProfile.pincode = validated_data["pincode"]
        supplierProfile.save()

        supplierProfile.products.all().delete()
        
        for product in products:
            SupplierProduct.objects.create(supplier=supplierProfile,**product)
        return supplierProfile

    class Meta:
        model = SupplierProfile
        fields = ('id','user','products','address','pincode')

