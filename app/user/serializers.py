
from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from django.utils.translation import ugettext_lazy as _
from core.models import User

class UserSerializer(serializers.ModelSerializer):
    """Serializer for the user model"""

    class Meta:
        model = get_user_model()
        fields = ('email','password','name')
        extra_kwargs={
            "password": {
                "write_only":True,
                "min_length": 5
            }
        }
    
    def create(self,validated_data):
        """Create a new user with the encripted password and return it"""
        print(validated_data)
        return get_user_model().objects.create_user(**validated_data)
    
    def update(self,instance,validated_data):
        """Update a user,setting the password correctly and return it
            this serializer can only update the specified fields in this case
            (email,password,name)"""
        password = validated_data.pop("password",None)
        user = super().update(instance,validated_data)  
        if password:      
            user.set_password(password)
            user.save()

        return user


class AuthSerializer(serializers.Serializer):
    """Serializer for the user authentication token
    """
    email = serializers.CharField()
    password = serializers.CharField(
        style={"input_type": "password"},
        trim_whitespace=False
    )

    def validate(self, attrs):
        """Validate and authenticate the user
        """
        email = attrs.get('email')
        password = attrs.get('password')
        user = authenticate(username=email,password=password)

        if not user:
            msg = ('Unable to authenticate for provided credentials')
            raise serializers.ValidationError(msg, code='authentication')
    
        attrs['user'] = user
        return attrs

