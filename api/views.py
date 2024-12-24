from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import LoginSerializer
from .agent import get_agent_response
import json

# Create your views here.


class LoginViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = LoginSerializer(data=request.data)
        print("The submitted data: ", request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            username = user.username

            refresh = RefreshToken.for_user(user)
            refresh_token = str(refresh)
            access_token = str(refresh.access_token)
            return Response({'refresh': refresh_token, 'access': access_token, 'username': username}, status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChatViewSet(viewsets.ViewSet):
    # permission_classes = [IsAuthenticated]
    permission_classes = [AllowAny]

    def create(self, request):
        if not request.data["body"]:
            return Response({"response": "request does not have the body key and value"}, status=status.HTTP_400_BAD_REQUEST)
        email = request.data["body"]

        try:
            agent_response = get_agent_response(email)
            return Response(agent_response, status=status.HTTP_200_OK)
        except:
            return Response({"response": "An error occured while processing the request"}, status=status.HTTP_400_BAD_REQUEST)

    def list(self, request):

        return Response({"response": "use a post request to send an email. The body key is required"}, status=status.HTTP_204_NO_CONTENT)
