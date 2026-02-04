from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from django.shortcuts import get_object_or_404
from django.db.models import Q

from .models import Mess, Menu
from .serializers import MessSerializer, MenuSerializer
from .permissions import IsOwner

# MESS

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
                Q(location__icontains=location) |
                Q(address__icontains=location)
            )

        return queryset

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return [permissions.IsAuthenticated(), IsOwner()]
        return [permissions.IsAuthenticated()]

# MENU (DAY + MEAL BASED)

class MenuViewSet(viewsets.ModelViewSet):
    serializer_class = MenuSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Menu.objects.filter(
            mess_id=self.kwargs["mess_id"]
        )

    def perform_create(self, serializer):
        mess = get_object_or_404(
            Mess,
            id=self.kwargs["mess_id"],
            owner=self.request.user
        )
        serializer.save(mess=mess)

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [permissions.IsAuthenticated(), IsOwner()]
        return [permissions.IsAuthenticated()]

# TOGGLE MESS OPEN / CLOSED

class ToggleMessStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, mess_id):
        try:
            mess = Mess.objects.get(
                id=mess_id,
                owner=request.user
            )
        except Mess.DoesNotExist:
            return Response(
                {"error": "Mess not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        mess.is_open = not mess.is_open
        mess.save(update_fields=["is_open"])

        return Response(
            {
                "message": "Mess status updated",
                "is_open": mess.is_open,
            },
            status=status.HTTP_200_OK
        )
