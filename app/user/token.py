from django.utils import timezone
from rest_framework.authtoken.models import Token
from app.settings import TOKEN_TIME_OUT


class ExpiringToken(Token):
    """Extend token to add an expired method"""

    class Meta(object):
        proxy = True

    def expired(self):
        """Returns a boolean indicating expiration"""
        now = timezone.now()
        if self.created < now - TOKEN_TIME_OUT:
            return True
        return False
