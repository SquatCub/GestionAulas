from django.db import models
from django.contrib.auth.models import (
    AbstractUser, BaseUserManager, PermissionsMixin)
from rest_framework.authentication import TokenAuthentication
from user.token import ExpiringToken
from rest_framework import exceptions


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **kargs):
        """Creates and saves a normal user"""

        if not email:
            raise ValueError('User must have an email')
        new_email = self.normalize_email(email)
        user = self.model(email=new_email, **kargs)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """Creates a superuser base from the standar user"""
        user = self.create_superuser(email=email, password=password)
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class ExpiringTokenAuthentication(TokenAuthentication):
    """Overwrites the normal rest framework auth token model"""
    model = ExpiringToken

    def authenticate_credentials(self, key):
        """Middleware in charge to validate the given token"""
        try:
            token = self.model.objects.get(key=key)
        except self.model.DoesNotExist:
            raise exceptions.AuthenticationFailed('Invalid Token')

        if not token.user.is_active:
            raise exceptions.AuthenticationFailed('User inactive or deleted')

        if token.expired():
            raise exceptions.AuthenticationFailed('Token has expired')

        return (token.user, token)


class User(AbstractUser, PermissionsMixin):
    """Custom user with email added"""
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserManager()  # for fetching an user or getting relations bettween classes
    USERNAME_FIELD = 'email'
