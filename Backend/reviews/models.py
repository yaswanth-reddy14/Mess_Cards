import uuid
from django.db import models
from users.models import User
from messes.models import Mess


class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    mess = models.ForeignKey(Mess, on_delete=models.CASCADE, related_name="reviews")
    rating = models.IntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "mess")

    def __str__(self):
        return f"{self.rating} - {self.mess.name}"


class Favorite(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    mess = models.ForeignKey(Mess, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("student", "mess")
