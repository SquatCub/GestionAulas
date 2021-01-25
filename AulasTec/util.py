import re
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from random import choice
from string import ascii_uppercase, digits

# My Especific Functions inside Server

# Delete PDF of File_analysis asociated (MEDIA/Patients_Files/)
def delete_PDF(url):
    if default_storage.exists(url):
        default_storage.delete(url)