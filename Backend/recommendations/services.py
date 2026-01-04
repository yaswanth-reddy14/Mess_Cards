from django.db.models import Avg
from messes.models import Mess
from reviews.models import Review
from .utils import haversine_distance


def normalize(value, min_val, max_val):
    if max_val == min_val:
        return 1
    return (value - min_val) / (max_val - min_val)


def rank_messes(student, preference, student_lat, student_lng):
    messes = Mess.objects.all()

    if not messes.exists():
        return []

    # PRICE NORMALIZATION
    prices = list(messes.values_list("monthly_price", flat=True))
    min_price, max_price = min(prices), max(prices)

    #  PRE-FETCH RATINGS 
    ratings_map = {
        r["mess"]: r["avg"]
        for r in Review.objects.values("mess")
        .annotate(avg=Avg("rating"))
    }

    max_distance = (
        preference.max_distance_km if preference else 10
    )
    preferred_food = preference.food_type if preference else "BOTH"

    ranked = []

    for mess in messes:
        #  Price score
        price_score = 1 - normalize(
            mess.monthly_price, min_price, max_price
        )

        #  Rating score
        avg_rating = ratings_map.get(mess.id, 0)
        rating_score = avg_rating / 5

        #  Distance score
        distance = haversine_distance(
            student_lat, student_lng, mess.latitude, mess.longitude
        )
        distance_score = max(0, 1 - (distance / max_distance))

        #  Food preference
        food_score = (
            1
            if preferred_food == "BOTH"
            or mess.food_type == preferred_food
            else 0
        )

        final_score = (
            0.4 * price_score
            + 0.3 * rating_score
            + 0.2 * distance_score
            + 0.1 * food_score
        )

        ranked.append({
            "mess": mess,
            "score": round(final_score, 3),
            "explanation": {
                "price": round(price_score, 2),
                "rating": round(rating_score, 2),
                "distance": round(distance_score, 2),
                "food_match": food_score,
            },
        })

    ranked.sort(key=lambda x: x["score"], reverse=True)
    return ranked
