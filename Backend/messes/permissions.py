from rest_framework.permissions import BasePermission
from .models import Mess, Menu


class IsOwner(BasePermission):
    def has_object_permission(self, request, view, obj):
        # If object IS a Mess
        if isinstance(obj, Mess):
            return obj.owner == request.user

        # If object IS a Menu  check mess owner
        if isinstance(obj, Menu):
            return obj.mess.owner == request.user

        return False
