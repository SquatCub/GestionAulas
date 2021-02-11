from django.contrib import admin
from .models import Edificio, Aula, Encuesta, Pregunta, User
# Register your models here.

admin.site.register(Edificio)
admin.site.register(Aula)
admin.site.register(Encuesta)
admin.site.register(Pregunta)
admin.site.register(User)
