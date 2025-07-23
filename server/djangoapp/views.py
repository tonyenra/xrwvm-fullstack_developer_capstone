# Uncomment the required imports before adding the code

from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, render, redirect
from django.contrib.auth import logout
from django.contrib import messages
from datetime import datetime

from django.http import JsonResponse
from django.contrib.auth import login, authenticate
import logging
import json
from django.views.decorators.csrf import csrf_exempt
from .populate import initiate
from django.contrib.auth import authenticate, login, logout


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.

# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    return JsonResponse(data)

# Create a `logout_request` view to handle sign out request
@csrf_exempt
def logout_user(request):
    """
    Termina la sesión y devuelve JSON con username vacío.
    Acepta GET (como pide el lab).
    """
    if request.method == 'GET':
        username = request.user.username if request.user.is_authenticated else ""
        logout(request)
        return JsonResponse({"userName": ""})
    return JsonResponse({"detail": "GET required"}, status=405)

# Create a `registration` view to handle sign up request
# @csrf_exempt
def register_user(request):
    """
    Crea usuario, inicia sesión y devuelve JSON con username.
    Espera JSON en el body con: userName, password, firstName, lastName, email
    """
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

    # Crear usuario
    user = User.objects.create_user(
        username=username,
        password=password,
        first_name=firstName,
        last_name=lastName,
        email=email
    )

    # Autenticar y loguear
    user = authenticate(username=username, password=password)
    if user:
        login(request, user)
        return JsonResponse({"status": True, "userName": user.username})

    return JsonResponse({"status": False, "error": "Auth failed"}, status=400)

# # Update the `get_dealerships` view to render the index page with
# a list of dealerships
# def get_dealerships(request):
# ...

# Create a `get_dealer_reviews` view to render the reviews of a dealer
# def get_dealer_reviews(request,dealer_id):
# ...

# Create a `get_dealer_details` view to render the dealer details
# def get_dealer_details(request, dealer_id):
# ...

# Create a `add_review` view to submit a review
# def add_review(request):
# ...
