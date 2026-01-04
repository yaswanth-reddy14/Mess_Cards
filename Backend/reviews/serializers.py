from rest_framework import serializers
from .models import Review, Favorite


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"
        read_only_fields = ("id", "student", "mess", "created_at")


class FavoriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorite
        fields = "__all__"
        read_only_fields = ("student",)
