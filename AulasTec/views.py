from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import JsonResponse
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


