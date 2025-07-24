import json
import logging
from django.http import JsonResponse, HttpResponse
from django.shortcuts import redirect
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

from .models import CarMake, CarModel
from .populate import initiate  # quítalo si no usas autopoblado

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
