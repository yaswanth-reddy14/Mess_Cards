from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .permissions import IsReviewOwner

from .models import Review, Favorite
from .serializers import ReviewSerializer, FavoriteSerializer

from messes.models import Mess


class ReviewViewSet(viewsets.ModelViewSet):
    """
    Students can review messes.
    One review per student per mess.
    """
    serializer_class = ReviewSerializer

    def get_queryset(self):
        return Review.objects.filter(mess_id=self.kwargs["mess_id"])

    def get_permissions(self):
        if self.action in ["update", "partial_update", "destroy"]:
            return [permissions.IsAuthenticated(), IsReviewOwner()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        if self.request.user.role != "STUDENT":
            raise PermissionDenied("Only students can add reviews.")

        mess = get_object_or_404(Mess, id=self.kwargs["mess_id"])

        serializer.save(
            student=self.request.user,
            mess=mess
        )


class FavoriteViewSet(viewsets.ModelViewSet):
    """
    Students can favorite messes.
    """
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Favorite.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        if self.request.user.role != "STUDENT":
            raise PermissionDenied("Only students can favorite messes.")

        mess = get_object_or_404(Mess, id=self.kwargs["mess_id"])
        serializer.save(
            student=self.request.user,
            mess=mess
        )
