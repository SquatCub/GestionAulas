from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.

# Model User Custom
class User(AbstractUser):
    pass
    celphone = models.CharField(max_length=12, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now_add=True)

class Edificio(models.Model):
	nombre = models.CharField(max_length=5, null=False)
	especialidad = models.CharField(max_length=100, null=True)
	descripcion = models.CharField(max_length=200, null=True)
	numAulas = models.IntegerField()
	numPisos = models.IntegerField()
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now_add=True)


	def serialize(self):
			return {
				"nombre": self.nombre,
				"especialidad": self.especialidad,
				"descripcion": self.descripcion,
				"numAulas": self.numAulas,
				"numPisos": self.numPisos,
				"created": self.created_at,
				"updated": self.updated_at
			}


class Aula(models.Model):
	edificio = models.ForeignKey(Edificio, on_delete=models.CASCADE, related_name="Aula_Edificio", null=False)
	nombre = models.CharField(max_length=5, null=False)
	descripcion = models.CharField(max_length=200, null=True)
	horario = models.FileField(upload_to="MEDIA/Horarios/", null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now_add=True)

class Pregunta(models.Model):
	pregunta = models.CharField(max_length=500, null=False)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now_add=True)

class Respuesta(models.Model):
	respuesta = models.CharField(max_length=500, null=False)
	valor = models.IntegerField()
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now_add=True)

class Encuesta(models.Model):
	pregunta = models.ForeignKey(Pregunta, on_delete=models.CASCADE, related_name="Pregunta_Encuesta", null=False)
	respuesta = models.ForeignKey(Respuesta, on_delete=models.CASCADE, related_name="Respuesta_Encuesta", null=False)
	created_at = models.DateTimeField(auto_now_add=True)
	