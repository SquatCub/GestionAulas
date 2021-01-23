from django.urls import path
from . import views
from django.contrib.auth.decorators import login_required

urlpatterns = [
    #Rutas para vistas
    path("", views.index, name="index"),
    path("listado", views.listado, name="listado"),
    path("acerca", views.about, name="acerca"),

    #Rutas para APIs
    path("edificio", views.edificio, name="edificio"),
    path("buscar", views.busqueda, name="buscar"),

    #Rutas para Administracion del Sitio
    path("adminSGA", views.adminSGA, name="adminSGA"),
    path("adminSGA/edificios", views.adminSGA_edificios, name="adminSGA_Edificios"),
    path("adminSGA/edificios/<str:miEdificio>", views.adminSGA_miEdificio, name="adminSGA_miEdificio"),
    path("adminSGA/edificios/<str:miEdificio>/edit", views.adminSGA_editEdificio, name="adminSGA_EditEdificio"),

    path("adminSGA/edificios/<str:miEdificio>/newAula", views.adminSGA_newAula, name="adminSGA_newAula"),



    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", login_required(views.register_view), name="register")
]