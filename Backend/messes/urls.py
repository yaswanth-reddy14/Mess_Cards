from django.urls import path
from .views import MessViewSet, MenuViewSet

urlpatterns = [
    # mess CRUD
    path("", MessViewSet.as_view({
        "get": "list",
        "post": "create"
    })),
    path("<uuid:pk>/", MessViewSet.as_view({
        "get": "retrieve",
        "put": "update",
        "patch": "partial_update",
        "delete": "destroy"
    })),

    # menu list + create
    path("<uuid:mess_id>/menus/", MenuViewSet.as_view({
        "get": "list",
        "post": "create"
    })),

    #  menu detail 
    path("<uuid:mess_id>/menus/<uuid:pk>/", MenuViewSet.as_view({
        "get": "retrieve",
        "put": "update",
        "patch": "partial_update",
        "delete": "destroy"
    })),
]
