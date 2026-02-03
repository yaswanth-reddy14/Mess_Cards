import random
from django.core.mail import send_mail

from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import CreateAPIView
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import User, EmailOTP
from .serializers import (
    RegisterSerializer,
    EmailTokenObtainPairSerializer,
    UserSerializer,
)


# AUTH: CURRENT USER
 
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request):
        request.user.delete()
        return Response({"message": "Account deleted successfully"})



# EMAIL LOGIN (JWT)
 
class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
    permission_classes = [AllowAny]



# DIRECT REGISTER (OPTIONAL / ADMIN USE)

class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]



# CHANGE PASSWORD

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return Response(
                {"error": "Old password and new password required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(old_password):
            return Response(
                {"error": "Old password is incorrect"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return Response(
                {"error": "New password must be at least 8 characters"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully"})



# SEND EMAIL OTP

from django.core.mail import send_mail
from django.conf import settings

class SendEmailOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required"}, status=400)

        otp = str(random.randint(100000, 999999))

        EmailOTP.objects.update_or_create(
            email=email,
            defaults={"otp": otp}
        )

        try:
            send_mail(
                subject="Your OTP for Registration",
                message=f"Your OTP is {otp}",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            return Response(
                {"error": "Email service not configured"},
                status=500
            )

        return Response({"message": "OTP sent"})




# VERIFY EMAIL OTP + REGISTER

class VerifyEmailOTPRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response(
                {"error": "Email and OTP are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            record = EmailOTP.objects.get(email=email)
        except EmailOTP.DoesNotExist:
            return Response(
                {"error": "OTP not found. Please request OTP again."},
                status=status.HTTP_400_BAD_REQUEST
            )

        #  IMPORTANT: validate OTP FIRST
        if record.otp != otp:
            return Response(
                {"error": "Invalid OTP"},
                status=status.HTTP_400_BAD_REQUEST
            )

        #  OTP is correct → now register user
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # OTP must be single-use
        record.delete()

        return Response(
            {"message": "Registration successful"},
            status=status.HTTP_201_CREATED
        )
