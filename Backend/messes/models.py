import uuid
from django.db import models
from users.models import User


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

    image = models.ImageField(upload_to="messes/", null=True, blank=True)

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
