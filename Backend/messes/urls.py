from django.urls import path
from .views import (
    MessViewSet,
    MenuViewSet,
    ToggleMessStatusView,
    MessPlanViewSet,
)

urlpatterns = [

    
    # MESS CRUD
    

    path(
        "",
        MessViewSet.as_view({
            "get": "list",
            "post": "create",
        }),
    ),

    path(
        "<uuid:pk>/",
        MessViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
    ),

    
    # TOGGLE OPEN / CLOSED
    

    path(
        "<uuid:mess_id>/toggle-status/",
        ToggleMessStatusView.as_view(),
    ),

    
    # DAY-WISE MENUS
    

    path(
        "<uuid:mess_id>/menus/",
        MenuViewSet.as_view({
            "get": "list",
            "post": "create",
        }),
    ),

    path(
        "<uuid:mess_id>/menus/<uuid:pk>/",
        MenuViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
    ),

    
    # MESS PLANS (NEW)
    

    path(
        "<uuid:mess_id>/plans/",
        MessPlanViewSet.as_view({
            "get": "list",
            "post": "create",
        }),
    ),

    path(
        "<uuid:mess_id>/plans/<str:pk>/",
        MessPlanViewSet.as_view({
            "get": "retrieve",
            "put": "update",
            "patch": "partial_update",
            "delete": "destroy",
        }),
    ),
]
