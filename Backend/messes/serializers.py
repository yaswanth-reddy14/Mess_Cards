from rest_framework import serializers
from .models import Mess, Menu, WeeklyMenu
from users.models import User   


class MenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = Menu
        fields = ["id", "name", "price", "meal_type"]


class OwnerSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "name", "email", "phone"]


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


# ============================
# WEEKLY MENU SERIALIZER (NEW)
# ============================

class WeeklyMenuSerializer(serializers.ModelSerializer):
    class Meta:
        model = WeeklyMenu
        fields = [
            "id",
            "day",
            "meal_type",
            "items",
            "price",
        ]
        read_only_fields = ["id"]
