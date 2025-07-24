import json
import logging
from django.http import JsonResponse, HttpResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from .models import CarMake, CarModel
from .populate import initiate  # quítalo si no usas autopoblado
from .restapis import get_request, analyze_review_sentiments, post_review

logger = logging.getLogger(__name__)


@csrf_exempt
def login_user(request):
    if request.method != "POST":
        return JsonResponse({"detail": "POST required"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
        username = data.get("userName", "").strip()
        password = data.get("password", "")
    except Exception:
        return JsonResponse({"status": False, "error": "Invalid JSON"}, status=400)

    user = authenticate(username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({"userName": username, "status": "Authenticated"})
    return JsonResponse({"userName": username, "status": "Unauthorized"}, status=401)


@csrf_exempt
def logout_user(request):
    if request.method != "GET":
        return JsonResponse({"detail": "GET required"}, status=405)
    logout(request)
    return JsonResponse({"userName": ""})


@csrf_exempt
def register_user(request):
    if request.method != "POST":
        return JsonResponse({"detail": "POST required"}, status=405)

    try:
        data = json.loads(request.body.decode("utf-8"))
    except Exception:
        return JsonResponse({"status": False, "error": "Invalid JSON"}, status=400)

    username  = data.get("userName", "").strip()
    password  = data.get("password", "")
    firstName = data.get("firstName", "")
    lastName  = data.get("lastName", "")
    email     = data.get("email", "")

    if not username or not password:
        return JsonResponse({"status": False, "error": "Missing username/password"}, status=400)

    if User.objects.filter(username=username).exists():
        return JsonResponse({"status": False, "error": "Already Registered"}, status=400)

    user = User.objects.create_user(
        username=username,
        password=password,
        first_name=firstName,
        last_name=lastName,
        email=email,
    )
    login(request, user)
    return JsonResponse({"status": True, "userName": user.username})


def get_cars(request):
    # autopoblar sólo si está vacío
    if not CarModel.objects.exists():
        initiate()
    car_models = CarModel.objects.select_related("car_make")
    cars = [{"CarModel": m.name, "CarMake": m.car_make.name} for m in car_models]
    return JsonResponse({"CarModels": cars})

#Update the `get_dealerships` render list of dealerships all by default, particular state if state is passed
def get_dealerships(request, state="All"):
    if(state == "All"):
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/"+state
    dealerships = get_request(endpoint)
    return JsonResponse({"status":200,"dealers":dealerships})

def get_dealer_details(request, dealer_id):
    if(dealer_id):
        endpoint = "/fetchDealer/"+str(dealer_id)
        dealership = get_request(endpoint)
        return JsonResponse({"status":200,"dealer":dealership})
    else:
        return JsonResponse({"status":400,"message":"Bad Request"})

def get_dealer_reviews(request, dealer_id):
    # if dealer id has been provided
    if(dealer_id):
        endpoint = "/fetchReviews/dealer/"+str(dealer_id)
        reviews = get_request(endpoint)
        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail['review'])
            print(response)
            review_detail['sentiment'] = response['sentiment']
        return JsonResponse({"status":200,"reviews":reviews})
    else:
        return JsonResponse({"status":400,"message":"Bad Request"})

def add_review(request):
    if(request.user.is_anonymous == False):
        data = json.loads(request.body)
        try:
            response = post_review(data)
            return JsonResponse({"status":200})
        except:
            return JsonResponse({"status":401,"message":"Error in posting review"})
    else:
        return JsonResponse({"status":403,"message":"Unauthorized"})