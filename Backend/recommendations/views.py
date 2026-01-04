from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from .models import StudentPreference
from .services import rank_messes
from messes.serializers import MessSerializer


class RecommendMessView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            student_lat = float(request.data.get("latitude"))
            student_lng = float(request.data.get("longitude"))
        except (TypeError, ValueError):
            return Response(
                {"error": "Valid latitude and longitude required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        preference = StudentPreference.objects.filter(
            student=request.user
        ).first()

        ranked = rank_messes(
            student=request.user,
            preference=preference,
            student_lat=student_lat,
            student_lng=student_lng,
        )

        response = []
        for item in ranked:
            response.append({
                "mess": MessSerializer(item["mess"]).data,
                "score": item["score"],
                "explanation": item["explanation"],
            })

        return Response(response, status=status.HTTP_200_OK)
