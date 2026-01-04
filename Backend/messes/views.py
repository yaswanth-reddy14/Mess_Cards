from rest_framework import viewsets, permissions
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import PermissionDenied

from .models import Mess, Menu
from .serializers import MessSerializer, MenuSerializer
from .permissions import IsOwner


class MessViewSet(viewsets.ModelViewSet):
    serializer_class = MessSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Mess.objects.all()

        # OWNER sees only his messes
        if user.role == "OWNER":
            return queryset.filter(owner=user)

        # STUDENT: optional location search
        location = self.request.query_params.get("location")

        if location:
            queryset = queryset.filter(
                location__icontains=location
            ) | queryset.filter(
                address__icontains=location
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return [permissions.IsAuthenticated(), IsOwner()]
        return [permissions.IsAuthenticated()]


class MenuViewSet(viewsets.ModelViewSet):
    serializer_class = MenuSerializer

    def get_queryset(self):
        return Menu.objects.filter(mess_id=self.kwargs["mess_id"])

    def perform_create(self, serializer):
        mess = get_object_or_404(Mess, id=self.kwargs["mess_id"])
        serializer.save(mess=mess)

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [permissions.IsAuthenticated(), IsOwner()]
        return [permissions.IsAuthenticated()]