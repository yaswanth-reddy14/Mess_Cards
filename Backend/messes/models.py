import uuid
from django.db import models
from users.models import User
from cloudinary.models import CloudinaryField

class Mess(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    owner = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="owned_messes"
    )

    name = models.CharField(max_length=200)
    address = models.TextField()
    location = models.CharField(max_length=255)

    image = CloudinaryField("image", null=True, blank=True)

    FOOD_CHOICES = (
        ("VEG", "Veg"),
        ("NON_VEG", "Non-Veg"),
        ("BOTH", "Both"),
    )

    food_type = models.CharField(max_length=10, choices=FOOD_CHOICES)
    monthly_price = models.IntegerField()
    meals_included = models.CharField(max_length=50)

    created_at = models.DateTimeField(auto_now_add=True)
    is_open = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Menu(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    mess = models.ForeignKey(
        Mess,
        on_delete=models.CASCADE,
        related_name="menus"
    )

    DAY_CHOICES = (
        ("MONDAY", "Monday"),
        ("TUESDAY", "Tuesday"),
        ("WEDNESDAY", "Wednesday"),
        ("THURSDAY", "Thursday"),
        ("FRIDAY", "Friday"),
        ("SATURDAY", "Saturday"),
        ("SUNDAY", "Sunday"),
    )

    day = models.CharField(max_length=10, choices=DAY_CHOICES)

    MEAL_CHOICES = (
        ("BREAKFAST", "Breakfast"),
        ("LUNCH", "Lunch"),
        ("DINNER", "Dinner"),
    )

    meal_type = models.CharField(max_length=10, choices=MEAL_CHOICES)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)

    class Meta:
        ordering = ["day", "meal_type"]

    def __str__(self):
        return f"{self.day} - {self.name} ({self.meal_type})"



class MessPlan(models.Model):
    id = models.BigAutoField(primary_key=True)

    mess = models.ForeignKey(
        "Mess",
        related_name="plans",
        on_delete=models.CASCADE
    )

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    price = models.DecimalField(max_digits=8, decimal_places=2)

    # PLAN STRUCTURE
    days = models.JSONField(default=list)  
    # ["MONDAY", "TUESDAY", "WEDNESDAY"]

    meals = models.JSONField(default=list)
    # ["BREAKFAST", "LUNCH"]

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.mess.name}"


class PlanMenuItem(models.Model):
    plan = models.ForeignKey(
        MessPlan,
        on_delete=models.CASCADE,
        related_name="plan_items"
    )
    day = models.CharField(max_length=10, choices=Menu.DAY_CHOICES)
    meal_type = models.CharField(max_length=10, choices=Menu.MEAL_CHOICES)
    name = models.CharField(max_length=100)

    class Meta:
        ordering = ["day", "meal_type", "name"]

    def __str__(self):
        return f"{self.plan.name} - {self.day} - {self.meal_type}: {self.name}"
