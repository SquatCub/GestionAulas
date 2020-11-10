from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin)
from rest_framework.authentication import TokenAuthentication
from user.token import ExpiringToken
from rest_framework import exceptions


class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **kargs):
        """Creates and saves a new user

        Args:
            email ([type]): [description]
            password ([type], optional): [description]. Defaults to None.
        """
        if not email:
            raise ValueError('User Must Have An Email Address')
        new_email = self.normalize_email(email)
        user = self.model(email=new_email, **kargs)
        # this is the same as creating a user model
        user.set_password(password)  # this incrypt the password
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


class User(AbstractBaseUser, PermissionsMixin): 
    """Custom user model"""
    email = models.EmailField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    objects = UserManager()
    USERNAME_FIELD = 'email'

