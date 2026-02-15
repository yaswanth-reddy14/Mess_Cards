from rest_framework import serializers
from .models import Mess, Menu, MessPlan, PlanMenuItem
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


class MessPlanSerializer(serializers.ModelSerializer):
    plan_items = serializers.ListSerializer(
        child=serializers.DictField(),
        required=False,
        write_only=True,
    )
    items = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = MessPlan
        fields = [
            "id",
            "mess",
            "name",
            "description",
            "price",
            "days",
            "meals",
            "is_active",
            "created_at",
            "plan_items",
            "items",
        ]
        read_only_fields = ["id", "mess", "created_at"]

    def get_items(self, obj):
        return PlanMenuItemSerializer(obj.plan_items.all(), many=True).data

    def validate_plan_items(self, value):
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError("plan_items must be a non-empty list.")

        valid_days = {choice[0] for choice in Menu.DAY_CHOICES}
        valid_meals = {choice[0] for choice in Menu.MEAL_CHOICES}
        cleaned_items = []

        for idx, item in enumerate(value, start=1):
            day = str(item.get("day", "")).upper()
            meal_type = str(item.get("meal_type", "")).upper()
            name = str(item.get("name", "")).strip()

            if day not in valid_days:
                raise serializers.ValidationError(
                    f"Item {idx}: invalid day '{item.get('day')}'."
                )
            if meal_type not in valid_meals:
                raise serializers.ValidationError(
                    f"Item {idx}: invalid meal_type '{item.get('meal_type')}'."
                )
            if not name:
                raise serializers.ValidationError(f"Item {idx}: name is required.")

            cleaned_items.append(
                {"day": day, "meal_type": meal_type, "name": name}
            )

        return cleaned_items

    def validate_days(self, value):
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError("days must be a non-empty list.")

        valid_days = {choice[0] for choice in Menu.DAY_CHOICES}
        invalid_days = [day for day in value if day not in valid_days]
        if invalid_days:
            raise serializers.ValidationError(
                f"Invalid day values: {', '.join(invalid_days)}"
            )
        return value

    def validate_meals(self, value):
        if not isinstance(value, list) or not value:
            raise serializers.ValidationError("meals must be a non-empty list.")

        valid_meals = {choice[0] for choice in Menu.MEAL_CHOICES}
        invalid_meals = [meal for meal in value if meal not in valid_meals]
        if invalid_meals:
            raise serializers.ValidationError(
                f"Invalid meal values: {', '.join(invalid_meals)}"
            )
        return value

    def validate(self, attrs):
        items = attrs.get("plan_items")

        # If plan_items are provided, derive days/meals from them unless explicitly set.
        if items:
            item_days = sorted({item["day"] for item in items})
            item_meals = sorted({item["meal_type"] for item in items})

            if not attrs.get("days"):
                attrs["days"] = item_days
            if not attrs.get("meals"):
                attrs["meals"] = item_meals

        return attrs

    def create(self, validated_data):
        plan_items = validated_data.pop("plan_items", [])
        plan = MessPlan.objects.create(**validated_data)

        if plan_items:
            PlanMenuItem.objects.bulk_create(
                [PlanMenuItem(plan=plan, **item) for item in plan_items]
            )

        return plan

    def update(self, instance, validated_data):
        plan_items = validated_data.pop("plan_items", None)

        for field, value in validated_data.items():
            setattr(instance, field, value)
        instance.save()

        if plan_items is not None:
            instance.plan_items.all().delete()
            if plan_items:
                PlanMenuItem.objects.bulk_create(
                    [PlanMenuItem(plan=instance, **item) for item in plan_items]
                )

        return instance


class PlanMenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanMenuItem
        fields = ["id", "day", "meal_type", "name"]



# MESS SERIALIZER

class MessSerializer(serializers.ModelSerializer):
    owner = OwnerSerializer(read_only=True)
    menu_items = MenuSerializer( source="menus", many=True, read_only=True)
    package_options = serializers.SerializerMethodField()
    image = serializers.ImageField(required=False, allow_null=True)
    
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
            "package_options",
            "is_open",
            "created_at",
        ]

    def get_package_options(self, obj):
        request = self.context.get("request")
        plans = obj.plans.all()

        # Students and non-owners should only see active plans.
        if not (
            request
            and request.user.is_authenticated
            and request.user.role == "OWNER"
            and obj.owner_id == request.user.id
        ):
            plans = plans.filter(is_active=True)

        return MessPlanSerializer(plans, many=True).data
