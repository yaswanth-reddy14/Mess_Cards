from django.urls import path
from .views import (
    MessViewSet,
    MenuViewSet,
    ToggleMessStatusView,
    WeeklyMenuViewSet,
)

urlpatterns = [
    # ======================
    # MESS CRUD
    # ======================
    path(
        "",
        MessViewSet.as_view({
            "get": "list",
            "post": "create"
        })
    ),
    path(
        "<uuid:pk>/",
        MessViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy"
        })
    ),

    # ======================
    # TOGGLE MESS OPEN / CLOSED
    # ======================
    path(
        "<uuid:mess_id>/toggle-status/",
        ToggleMessStatusView.as_view()
    ),

    # ======================
    # DAILY MENU ITEMS
    # ======================
    path(
        "<uuid:mess_id>/menus/",
        MenuViewSet.as_view({
            "get": "list",
            "post": "create"
        })
    ),
    path(
        "<uuid:mess_id>/menus/<uuid:pk>/",
        MenuViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy"
        })
    ),

    # ======================
    # WEEKLY SCHEDULE (NEW)
    # ======================
    path(
        "<uuid:mess_id>/weekly-menu/",
        WeeklyMenuViewSet.as_view({
            "get": "list",
            "post": "create"
        })
    ),
    path(
        "<uuid:mess_id>/weekly-menu/<uuid:pk>/",
        WeeklyMenuViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy"
        })
    ),
]
