from django.urls import path

from . import views

urlpatterns = [
    #Rutas para vistas
    path("", views.index, name="index"),
    path("listado/", views.listado, name="listado"),
    path("acerca/", views.about, name="about"),

    #Rutas para APIs
    path("edificio/", views.edificio, name="edificio")
]