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

from .models import User, Edificio, Aula

# Create your views here.

def index(request):
    return render(request, "aulas/index.html")

def about(request):
    return render(request, "aulas/about.html")

def listado(request):
    edificios = Edificio.objects.all()
    aulas = Aula.objects.all()
    return render(request, "aulas/listado.html", {
        "edificios": edificios,
        "aulas": aulas
    })

@csrf_exempt
def busqueda(request):
    if request.method != "POST":
        return JsonResponse({"error": "GET request required."}, status=400)

    try:
        data = json.loads(request.body)
        value = data.get("value", "")

        edificios = Edificio.objects.all().filter(nombre__icontains=value)
        aulas = Aula.objects.all().filter(nombre__icontains=value)

        return JsonResponse({"edificios": [edificio.serialize() for edificio in edificios], "aulas": [aula.serialize() for aula in aulas]}, status=201, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=201)

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

def adminSGA_edificios(request):
    return render(request, "adminSGA/lista_edificios.html")

def adminSGA_miEdificio(request, miEdificio):
    if request.method == "GET":
        try:
            dataEdificio = Edificio.objects.get(nombre=miEdificio)
            listAulas = Aula.objects.filter(edificio=dataEdificio) 
        except Exception as e:
            return HttpResponse("NEL")

        return render(request, "adminSGA/open_edificio.html", {
            "edificio": dataEdificio,
            "aulas": listAulas
            })
    else:
        return HttpResponse("NEL")

def adminSGA_editEdificio(request, miEdificio):
    if request.method == "POST":
        try:
            dataEdificio = Edificio.objects.get(nombre=miEdificio)

            dataEdificio.nombre = request.POST["nombre"]
            dataEdificio.especialidad = request.POST["especialidad"]
            dataEdificio.descripcion = request.POST["descripcion"]
            dataEdificio.numAulas = request.POST["numAulas"]
            dataEdificio.numPisos = request.POST["numPisos"]
            dataEdificio.updated_at = datetime.now()
            dataEdificio.save()

            return render(request, "adminSGA/edit_edificio.html", {
                "edificio": dataEdificio,
                "message": "Se Guardaron los Cambios!"
                })
        except Exception as e:
            dataEdificio = Edificio.objects.get(nombre=miEdificio)
            return render(request, "adminSGA/edit_edificio.html", {
                "edificio": dataEdificio,
                "message": "A Ocurrido un Error al Intentar Guardar la Informacion, No se efectuaron Cambios!."
                })
    else:
        try:
            dataEdificio = Edificio.objects.get(nombre=miEdificio)
        except Exception as e:
            return HttpResponse("NEL")

        return render(request, "adminSGA/edit_edificio.html", {
            "edificio": dataEdificio
            })


def adminSGA_newAula(request, miEdificio):
    if request.method == "POST":
        try:
            dataEdificio = Edificio.objects.get(nombre=miEdificio)
            file = None

            if 'horario' in request.FILES.keys():
                file = request.FILES['file']        

            newAula = Aula(edificio=dataEdificio, nombre=request.POST["nombre"], descripcion=request.POST["descripcion"], horario=file)

            newAula.save()

            return render(request, "adminSGA/new_aula.html", {
                "edificio": dataEdificio,
                "message": f"Se Creo el Aula {request.POST['nombre']} en el Edificio {miEdificio}"
                })


        except Exception as e:
            dataEdificio = Edificio.objects.get(nombre=miEdificio)
            return render(request, "adminSGA/new_aula.html", {
                "edificio": dataEdificio,
                "message": "A Ocurrido un Error al Intentar Guardar la Informacion!."
                })
    else:
        dataEdificio = Edificio.objects.get(nombre=miEdificio)
        return render(request, "adminSGA/new_aula.html", {
            "edificio": dataEdificio
            })

def adminSGA_editAula(request, miAula):
    if request.method == "POST":
        try:
            dataAula = Aula.objects.get(nombre=miAula)

            dataAula.nombre = request.POST["nombre"]
            dataAula.descripcion = request.POST["descripcion"]
            file = None

            if 'horario' in request.FILES.keys():
                file = request.FILES['file']   

            dataAula.horario = file
            dataAula.updated_at = datetime.now()
            dataAula.save()

            return render(request, "adminSGA/edit_aula.html", {
                "aula": dataAula,
                "message": "Se Guardaron los Cambios!"
                })

        except Exception as e:
            dataAula = Aula.objects.get(nombre=miAula)
            return render(request, "adminSGA/edit_edificio.html", {
                "aula": dataAula,
                "message": "A Ocurrido un Error al Intentar Guardar la Informacion, No se efectuaron Cambios!."
                })
    else:
        try:
            dataAula = Aula.objects.get(nombre=miAula)
        except Exception as e:
            return HttpResponse("NEL")

        return render(request, "adminSGA/edit_aula.html", {
            "aula": dataAula
            })

def adminSGA_elimAula(request, miAula):
    if request.method == "POST":
        dataAula = Aula.objects.get(nombre=miAula)
        edificio = dataAula.edificio
        dataAula.delete()
        return HttpResponseRedirect(reverse("adminSGA_miEdificio", args=(edificio.nombre, )))

def adminSGA_users(request):
    users = User.objects.all()
    return render(request, "adminSGA/users.html", {
        "users": users
    })

def adminSGA_editUser(request, id):
    if request.method == "POST":
        try:
            dataUser = User.objects.get(id=id)

            dataUser.first_name = request.POST["nombre"]
            dataUser.last_name = request.POST["apellido"]
            dataUser.celphone = request.POST["phone"]
            #dataUser.email = request.POST["email"]

            dataUser.save()

            return render(request, "adminSGA/edit_user.html", {
                "user": dataUser,
                "message": "Se Guardaron los Cambios!"
                })

        except Exception as e:
            dataUser = User.objects.get(id=id)
            return render(request, "adminSGA/edit_user.html", {
                "user": dataUser,
                "message": "A Ocurrido un Error al Intentar Guardar la Informacion, No se efectuaron Cambios!."
                })
    else:
        try:
            dataUser = User.objects.get(id=id)
        except Exception as e:
            return HttpResponse("NEL")

        return render(request, "adminSGA/edit_user.html", {
            "user": dataUser
            })

def adminSGA_elimUser(request, id):
    if request.method == "POST":
        dataUser = User.objects.get(id=id)
        dataUser.delete()
        return HttpResponseRedirect(reverse("adminSGA_users"))


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

# Register a New User
def register_view(request):
    if request.method == "POST":
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "adminSGA/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(email, email, password)
            user.save()

            User.objects.filter(username=email).update(first_name=request.POST["first_name"], last_name=request.POST["last_name"], celphone=request.POST["celphone"])

        except IntegrityError as e:
            print(e)
            return render(request, "adminSGA/register.html", {
                "message": "Username already taken."
            })

        return render(request, "adminSGA/register.html", {
                "message": "User has been Created Successfully!."
            })

    else:
        return render(request, "adminSGA/register.html")