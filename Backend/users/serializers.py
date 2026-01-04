from rest_framework import serializers
from .models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("id", "name", "email", "password", "role")

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            name=validated_data["name"],
            role=validated_data["role"],
            password=validated_data["password"],
        )
        return user

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = "email"

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "name", "email", "role", "phone" , "location")
        read_only_fields = ("email", "role")