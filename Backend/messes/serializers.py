from rest_framework import serializers
from .models import Mess, Menu
from users.models import User



# MENU SERIALIZER (FIXED)

class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = [
            "id",
            "day",          #  REQUIRED for day-wise filtering
            "meal_type",
            "name",
            "price",
        ]



# OWNER SERIALIZER

class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "phone"]



# MESS SERIALIZER

class MessSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(read_only=True)
    menu_items = MenuSerializer(
        source="menus",
        many=True,
        read_only=True
    )

    class Meta:
        model = Mess
        fields = [
            "id",
            "name",
            "address",
            "location",
            "food_type",
            "monthly_price",
            "meals_included",
            "image",
            "owner",
            "menu_items",
            "is_open",
            "created_at",
        ]
