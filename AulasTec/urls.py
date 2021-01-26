from os import name
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
    path("encuesta", views.encuesta, name="encuesta"),
    path("puntar/<int:id>/<int:val>", views.puntar, name="puntar"),

    path("adminSGA/edificios/File/<int:idAula>", views.file_api, name="File"),

    #Rutas para Administracion del Sitio
    path("adminSGA", views.adminSGA, name="adminSGA"),
    path("adminSGA/edificios", views.adminSGA_edificios, name="adminSGA_Edificios"),
    path("adminSGA/edificios/<str:miEdificio>", views.adminSGA_miEdificio, name="adminSGA_miEdificio"),
    path("adminSGA/edificios/<str:miEdificio>/edit", views.adminSGA_editEdificio, name="adminSGA_EditEdificio"),
    path("adminSGA/edificios/aula/<str:miAula>/delete", views.adminSGA_elimAula, name="adminSGA_elimAula"),
    path("adminSGA/edificios/aulas/<str:miAula>/edit", views.adminSGA_editAula, name="adminSGA_EditAula"),
    path("adminSGA/users", views.adminSGA_users, name="adminSGA_users"),
    path("adminSGA/users/<str:id>/edit", views.adminSGA_editUser, name="adminSGA_EditUser"),
    path("adminSGA/users/<str:id>/delete", views.adminSGA_elimUser, name="adminSGA_elimUser"),

    path("adminSGA/edificios/<str:miEdificio>/newAula", views.adminSGA_newAula, name="adminSGA_newAula"),


    path("adminSGA/encuestas", views.adminSGA_encuestas, name="adminSGA_Encuestas"),
    path("adminSGA/encuestas/newPregunta", views.adminSGA_newPregunta, name="adminSGA_newPregunta"),
    path("adminSGA/encuestas/editPregunta/<int:id>", views.adminSGA_editPregunta, name="adminSGA_EditPregunta"),
    path("adminSGA/encuestas/quitPregunta/<int:id>", views.adminSGA_quitPregunta, name="adminSGA_QuitPregunta"),

    path("adminSGA/encuestas/grafica/<int:id>", views.grafica, name="adminSGA_Grafica"),

    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("adminSGA/users/register", login_required(views.register_view), name="register")
]