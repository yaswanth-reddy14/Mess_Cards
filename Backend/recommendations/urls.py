from django.urls import path
from .views import RecommendMessView

urlpatterns = [
    path("recommend/", RecommendMessView.as_view(), name="recommend-mess"),
]
