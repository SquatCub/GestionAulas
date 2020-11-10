from rest_framework import authentication, exceptions, generics, permissions
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.settings import api_settings
from rest_framework.response import Response


from .serializers import AuthSerializer, UserSerializer
from .token import ExpiringToken


class CreateUserView(generics.CreateAPIView):
    """Create a new user in the db
    """
    serializer_class = UserSerializer


class CreateAuthView(ObtainAuthToken):
    """Create a new token for user
    """
    model = ExpiringToken
    serializer_class = AuthSerializer
    rendered_classes = api_settings.DEFAULT_RENDERER_CLASSES

    def post(self, request):
        """Respond to POSTed username/password with token."""
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            token, _ = ExpiringToken.objects.get_or_create(
                user=serializer.validated_data['user']
            )

            if token.expired():
                # If the token is expired, generate a new one.
                token.delete()
                token = ExpiringToken.objects.create(
                    user=serializer.validated_data['user']
                )

            data = {'token': token.key}
            return Response(data)
            
        return Response({"message":"not authenticated"})




class ManageUserView(generics.RetrieveUpdateAPIView):
    """Mange the authenticated user
    """
    serializer_class = UserSerializer
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        """Retrive and return authenticated user
        """
        return self.request.user
