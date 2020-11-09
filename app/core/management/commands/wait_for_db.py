import time
from django.core.management.base import BaseCommand
from django.db import connections
from django.db.utils import OperationalError

# the folder and the naming for the file are required
# to tell django where is the commando logic to execute whenever is called

# this command is called via mange.py ej.  "python manage.py wait_for_db"


class Command(BaseCommand):
    """Django commando to pause compile execution until 
    stablish database connection """

    def handle(self, *args, **options):
        self.stdout.write("WAITING FOR DATABASE  .... ")
        db_connection = None

        while not db_connection:
            try:
                db_connection = connections['default']
            except OperationalError:
                self.stdout.write('DATABASE UNAVAILABLE YET WAITING 1 SECOND')
                time.sleep(1)
        self.stdout.write(self.style.SUCCESS('CONNECTED WITH THE DATABASE'))
