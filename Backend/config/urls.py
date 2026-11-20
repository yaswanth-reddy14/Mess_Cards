from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from users.views import EmailTokenObtainPairView   #  IMPORTANT
from django.conf import settings
from django.conf.urls.static import static

from django.http import JsonResponse
from django.db import connection

def service_home(request):
    return JsonResponse({
        "service": "Mess Cards API",
        "status": "running",
        "mode": "temporary_sqlite_demo" if settings.SQLITE_DEMO_MODE else "postgresql",
        "health": "/health/",
        "messes": "/api/messes/",
        "frontend": "https://mess-cards-xyrg.vercel.app",
    })

def service_health(request):
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            cursor.fetchone()
        return JsonResponse({"api": "ok", "database": "ok"})
    except Exception:
        return JsonResponse({"api": "ok", "database": "unavailable"}, status=503)

urlpatterns = [
    path("", service_home, name="home"),
    path("health/", service_health, name="health"),
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

    path("api/auth/", include("users.urls")),
    
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )