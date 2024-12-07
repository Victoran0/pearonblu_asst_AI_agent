from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status, viewsets
from .agent import get_agent_response
import json

# Create your views here.


# @api_view(['POST'])
# def getPrompt(request):
#     print(request.data)

#     return Response({"message": "use a post request to send a prompt"}, status=status.HTTP_200_OK)

class ChatViewSet(viewsets.ViewSet):
    def create(self, request):
        email = request.data["body"]
        if email == "":
            raise ValueError

        agent_response = get_agent_response(email)

        return Response({"response": agent_response}, status=status.HTTP_200_OK)

    def list(self, request):

        return Response({"response": "use a post request to send an email. The body key is required"}, status=status.HTTP_204_NO_CONTENT)
