from django.urls import path

from .views import CreateAuthView, CreateUserView, ManageUserView

app_name = 'user'


urlpatterns = [
    path('create/', CreateUserView.as_view(), name='create'),
    path('token/', CreateAuthView.as_view(), name='token'),
    path('me/', ManageUserView.as_view(), name='me'),
]
