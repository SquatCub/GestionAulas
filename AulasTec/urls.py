from django.urls import path

from . import views

urlpatterns = [
    #Rutas para vistas
    path("", views.index, name="index"),
    path("listado/", views.listado, name="listado"),
    path("acerca/", views.about, name="about"),

    #Rutas para Administracion del Sitio
    path("adminSGA/", views.adminSGA, name="adminSGA"),

    #Rutas para APIs
    path("edificio/", views.edificio, name="edificio")
]