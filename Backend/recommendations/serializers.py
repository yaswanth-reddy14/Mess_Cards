from rest_framework import serializers
from messes.models import Mess


class MessMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mess
        fields = [
            "id",
            "name",
            "address",
            "food_type",
            "monthly_price",
            "location",

        ]

class RankedMessSerializer(serializers.Serializer):
    mess = serializers.ModelSerializer(model=Mess, fields="__all__")
    score = serializers.FloatField()
    explanation = serializers.DictField()
