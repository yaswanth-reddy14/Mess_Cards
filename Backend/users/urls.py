from django.urls import path
from .views import (
    RegisterView,
    MeView,
    ChangePasswordView,
    SendEmailOTPView,
    VerifyEmailOTPRegisterView,
)

urlpatterns = [
    # AUTH / PROFILE
    path("register/", RegisterView.as_view()),   # optional / admin use
    path("me/", MeView.as_view()),
    path("change-password/", ChangePasswordView.as_view()),

    # EMAIL OTP FLOW (PUBLIC)
    path("send-otp/", SendEmailOTPView.as_view()),
    path("verify-otp-register/", VerifyEmailOTPRegisterView.as_view()),
]
