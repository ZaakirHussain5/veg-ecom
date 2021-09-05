from django.db.models import fields
from .models import Product,Type,ProductMedia,Cart,OrderItem,Order,OrderAddress,CartItem,DeliveryType
from rest_framework import serializers
from django.contrib.auth.models import User

def check_otp(phone,otp):
    return True

class DeliveryTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryType
        fields = '__all__' 

class UserSerializer(serializers.ModelSerializer):
    deliveryType = serializers.SerializerMethodField(method_name="getDeliveryType")
    fullName = serializers.SerializerMethodField(method_name="getFullName")

    class Meta:
        model = User
        fields = ('id','username','first_name','last_name','email','is_active','deliveryType','fullName','date_joined')

    def getDeliveryType(self,obj):
        try:
            result = DeliveryType.objects.get(user=obj).deliveryType
        except DeliveryType.DoesNotExist:
            result = "R"
        return result
    
    def getFullName(self,obj):
        try:
            result = DeliveryType.objects.get(user=obj).name
        except DeliveryType.DoesNotExist:
            result = "Unnamed"
        return result

class UserLogin(serializers.Serializer):
    phone = serializers.CharField()
    otp = serializers.CharField()

    def create(self,data):
        if check_otp(data["phone"],data["otp"]):
            try:
                user = User.objects.get(username=data["phone"])
                return user
            except:
                user = User.objects.create(username=data["phone"])
                return user
        else:
            raise serializers.ValidationError('Error! Invalid OTP Entered')


class TypeSerialiser(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ('id','name','AvailableQty','HouseHoldPrice','GeneralStorePrice','RestrauntPrice','rPrice','gPrice','hPrice','rPriceQuantity','gPriceQuantity','hPriceQuantity')

class ProductMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMedia
        fields = ('mediaType','mediaUrl','id')

class ProductSerializer(serializers.ModelSerializer):
    media = ProductMediaSerializer(read_only=True,many=True)
    types = TypeSerialiser(read_only=True,many=True)

    class Meta:
        model = Product
        fields = ('id','name','description','image','total_Qty','types','media',)

class CartDetailsSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    productType = TypeSerialiser()

    class Meta:
        model = Cart
        fields= '__all__'

class OrderAddressSerialiizer(serializers.ModelSerializer):
    
    class Meta:
        model = OrderAddress
        fields = '__all__'

class OrderItemListSerialiizer(serializers.ModelSerializer):
    product = ProductSerializer()
    productType = TypeSerialiser()
    
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderListSerialiizer(serializers.ModelSerializer):
    items = OrderItemListSerialiizer(read_only=True,many=True)
    user = UserSerializer()
    billingAddress = OrderAddressSerialiizer()
    shippingAddress = OrderAddressSerialiizer()
    
    class Meta:
        model = Order
        fields = ('id','user','items','orderId','status','formattedCreatedAt','formattedUpdatedAt','shippingAddress','billingAddress','isInvoiceCreated','isCashOnDelivery')

class OrderItemSerialiizer(serializers.ModelSerializer):
    
    class Meta:
        model = OrderItem
        fields = '__all__'



class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerialiizer(read_only=False,many=True)

    class Meta:
        model = Order
        fields = '__all__'
    
    def create(self, validated_data):
        items_validated_data = validated_data.pop('items')
        order = Order(**validated_data)
        order.save()
        for each in items_validated_data:
            item = OrderItem.objects.create(**each)
            order.items.add(item)
        order.save()
        return order

class CartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields= '__all__'

class CartItemListSerializer(serializers.ModelSerializer):
    product = ProductSerializer()
    productType = TypeSerialiser()

    class Meta:
        model = CartItem
        fields= '__all__'

class CartListSerializer(serializers.ModelSerializer):
    cartItems = CartItemListSerializer(many=True)
    
    class Meta:
        model = Cart
        fields= '__all__'

class CartSerializer(serializers.Serializer):
    cartItems = CartItemSerializer(many=True)

    class Meta:
        model = Cart
        fields= '__all__'

    def create(self,validated_data):
        items_validated_data = validated_data.pop('cartItems')
        cart,_ = Cart.objects.get_or_create(**validated_data)

        items_serializer = self.fields['cartItems']
        for each in items_validated_data:
            product = each.pop('product')
            productType = each.pop('productType')
            item,created = cart.cartItems.get_or_create(product=product,productType=productType)
            if created:
                item.qty = each.pop('qty')
                item.unit = each.pop('unit')
                item.save()
                cart.cartItems.add(item)
            else:
                item.qty = each.pop('qty')
                item.unit = each.pop('unit')
                item.save()
        cart.save()
        return cart
    
