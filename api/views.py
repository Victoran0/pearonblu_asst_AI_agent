from django.shortcuts import render
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from .models import EmailThread
from .serializers import LoginSerializer, EmailThreadSerializer
from .agent import get_agent_response
import json

# Create your views here.


class LoginViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def create(self, request):
        serializer = LoginSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.validated_data['user']
            username = user.username

            refresh = RefreshToken.for_user(user)
            refresh_token = str(refresh)
            access_token = str(refresh.access_token)
            return Response({'refresh': refresh_token, 'access': access_token, 'username': username}, status=status.HTTP_200_OK)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChatViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = EmailThread.objects.all()
    serializer_class = EmailThreadSerializer
    lookup_field = "customer_name"

    def create(self, request):
        """Handle new emails from customers and generate a response"""
        if not request.data["body"]:
            return Response({"response": "request must have the body key and value"}, status=status.HTTP_400_BAD_REQUEST)

        customer_email = request.data["body"]
        # print("The customer email: ", customer_email, type(customer_email))
        customer_name = request.data.get('name', 'no_history')
        # print("the customer name: ", customer_name)
        # customer name can be general for general chats or real customer name for customer specific chats
        # When it is general, the agent thread_id should be random
        # when it is for a specific customer, the agent thread_id should be the name of the customer

        try:
            agent_response = get_agent_response(
                email=customer_email, customer_name=customer_name)
        except:
            return Response({"detail": "An error occured while processing the request"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            self.get_serializer().update_thread(
                staff=request.user,
                customer_name=customer_name,
                customer_email=customer_email,
                agent_response=agent_response
            )

            return Response(agent_response, status=status.HTTP_200_OK)
        except:
            return Response({"detail": "Unable to update the serializer"}, status=status.HTTP_400_BAD_REQUEST)

    def get_queryset(self):
        return EmailThread.objects.filter(staff=self.request.user)

    def list(self, request, *args, **kwargs):
        """List all emails for the authenticated staff"""
        threads = self.get_queryset()
        serializer = self.get_serializer(threads, many=True)
        print("The chat get request: ", serializer.data)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a single email thread."""
        customer_name = self.kwargs.get("customer_name")
        # print(self.kwargs)
        # print("customer_name: ", customer_name)
        try:
            email_thread = self.get_queryset().get(customer_name=customer_name)
            serializer = self.get_serializer(email_thread)
            print("Retrieve the chat of " +
                  customer_name + ": ", serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({"detail": "Email thread not found"}, status=status.HTTP_400_BAD_REQUEST)
