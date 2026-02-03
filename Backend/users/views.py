import random
from datetime import timedelta

from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

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

# =========================
# AUTH: CURRENT USER
# =========================

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


# =========================
# EMAIL LOGIN (JWT)
# =========================

class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer
    permission_classes = [AllowAny]


# =========================
# DIRECT REGISTER (ADMIN / OPTIONAL)
# =========================

class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


# =========================
# CHANGE PASSWORD
# =========================

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")

        if not old_password or not new_password:
            return Response({"error": "Old password and new password required"}, status=400)

        if not user.check_password(old_password):
            return Response({"error": "Old password is incorrect"}, status=400)

        if len(new_password) < 8:
            return Response({"error": "New password must be at least 8 characters"}, status=400)

        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully"})


# =========================
# SEND EMAIL OTP
# =========================

class SendEmailOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")

        if not email:
            return Response({"error": "Email is required"}, status=400)

        otp = str(random.randint(100000, 999999))

        EmailOTP.objects.update_or_create(
            email=email,
            defaults={
                "otp": otp,
                "created_at": timezone.now()
            }
        )

        try:
            send_mail(
                subject="Your OTP for Registration",
                message=f"Your OTP is {otp}. It is valid for 5 minutes.",
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            # IMPORTANT: log real error on Render
            print("EMAIL ERROR:", e)
            return Response(
                {"error": "Failed to send OTP email"},
                status=500
            )

        return Response({"message": "OTP sent successfully"})


# =========================
# VERIFY EMAIL OTP + REGISTER
# =========================

class VerifyEmailOTPRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        otp = request.data.get("otp")

        if not email or not otp:
            return Response({"error": "Email and OTP are required"}, status=400)

        try:
            record = EmailOTP.objects.get(email=email)
        except EmailOTP.DoesNotExist:
            return Response({"error": "OTP not found. Request again."}, status=400)

        # ⏱ OTP expiry check (5 minutes)
        if timezone.now() > record.created_at + timedelta(minutes=5):
            record.delete()
            return Response({"error": "OTP expired. Request again."}, status=400)

        if record.otp != otp:
            return Response({"error": "Invalid OTP"}, status=400)

        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        # single-use OTP
        record.delete()

        return Response({"message": "Registration successful"}, status=201)
