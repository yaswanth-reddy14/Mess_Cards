from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import EmailTokenObtainPairView   #  IMPORTANT

urlpatterns = [
    path("admin/", admin.site.urls),

    # JWT auth (EMAIL BASED LOGIN)
    path("api/auth/login/", EmailTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/auth/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # User registration
    path("api/auth/", include("users.urls")),

    # Messes
    path("api/messes/", include("messes.urls")),

    # Reviews & favorites
    path("api/", include("reviews.urls")),

    # Recommendations
    path("api/recommendations/", include("recommendations.urls")),
    
]
