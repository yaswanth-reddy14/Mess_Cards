from django.db import models
from users.models import User




class StudentPreference(models.Model):
    student = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="preference"
    )

    monthly_budget = models.IntegerField()
    max_distance_km = models.FloatField()
    food_type = models.CharField(
        max_length=10, choices=(("VEG", "Veg"), ("NON_VEG", "Non-Veg"), ("BOTH", "Both"))
    )
    meals_required = models.CharField(max_length=50)  # B/L/D

    def __str__(self):
        return f"Preference of {self.student.email}"
