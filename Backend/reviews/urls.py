from django.urls import path
from .views import ReviewViewSet, FavoriteViewSet

urlpatterns = [
    # Reviews for a mess
    path(
        "messes/<uuid:mess_id>/reviews/",
        ReviewViewSet.as_view({
            "get": "list",
            "post": "create",
        }),
        name="mess-reviews",
    ),

    # Add favorite (POST)
    path(
        "messes/<uuid:mess_id>/favorites/",
        FavoriteViewSet.as_view({
            "post": "create",
        }),
        name="mess-favorite",
    ),

    # List my favorites (GET)
    path(
        "favorites/",
        FavoriteViewSet.as_view({
            "get": "list",
        }),
        name="my-favorites",
    ),

    # Remove favorite (DELETE)
    path(
        "favorites/<int:pk>/",
        FavoriteViewSet.as_view({
            "delete": "destroy",
        }),
        name="remove-favorite",
    ),
]
