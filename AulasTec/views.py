import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import check_password
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http import FileResponse
from django.shortcuts import render
from django.urls import reverse
from datetime import date
from datetime import datetime
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_exempt

from .models import Edificio

# Create your views here.

def index(request):
    return render(request, "aulas/index.html")

def about(request):
    return render(request, "aulas/about.html")
def listado(request):
    return render(request, "aulas/listado.html")
@csrf_exempt
def edificio(request):
    if request.method != "PUT":
        return JsonResponse({"error": "PUT request required."}, status=400)
    data = json.loads(request.body)

    edificio_nombre = data.get("edificio_nombre", "")
    edificio = Edificio.objects.get(nombre=edificio_nombre)

    return JsonResponse({"json": edificio.serialize()}, status=201)


# VISTAS PARA ADMINISTRACION DEL SITIO

def adminSGA(request):
    return render(request, "adminSGA/index.html")

# Login (POST Login / GET Render View)
def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("adminSGA"))
        else:
            return render(request, "adminSGA/login.html", {
                "message": "Invalid email and/or password."
            })
    else:
        return render(request, "adminSGA/login.html")

# Logout
def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("adminSGA"))