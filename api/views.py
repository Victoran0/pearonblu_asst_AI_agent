from django.shortcuts import render

from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .models import EmailThread, PandSDocument, RephraseHistory
from .serializers import LoginSerializer, EmailThreadSerializer, PandSDocumentSerializer, RephraseHistorySerializer
from .agent import get_agent_response
from .rephrase import rephrase_writer

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
        customer_name = request.data.get('name', 'General')
        # print("the customer name: ", customer_name)

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
        # print("The chat get request: ", serializer.data)
        response = [
            {'customer_name': i.get('customer_name'),
             'last_updated': i.get('last_updated')}
            for i in serializer.data
        ]
        # print('Response: ', response)
        return Response(response, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a single email thread."""
        customer_name = self.kwargs.get("customer_name")
        # print(self.kwargs)
        # print("customer_name: ", customer_name)
        try:
            email_thread = self.get_queryset().get(customer_name=customer_name)
            serializer = self.get_serializer(email_thread)
            # print("Retrieve the chat of " +
            #       customer_name + ": ", serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            return Response({"detail": "Email thread not found"}, status=status.HTTP_400_BAD_REQUEST)


class PandSDocumentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = PandSDocument.objects.all()
    serializer_class = PandSDocumentSerializer

    def get_object(self):
        document, _ = PandSDocument.objects.get_or_create()
        return document


class RephraseHistoryViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = RephraseHistory.objects.all()
    serializer_class = RephraseHistorySerializer

    def create(self, request):
        """Handle new emails from customers and generate a response"""
        if not request.data["body"]:
            return Response({"response": "request must have the body key and value"}, status=status.HTTP_400_BAD_REQUEST)

        rephrase_req = request.data["body"]

        try:
            rephrase_response = rephrase_writer(rephrase_req)
        except Exception as e:
            return Response({"detail": f"Error generating rephrase: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            self.get_serializer().update_history(
                staff=request.user,
                rephrase_req=rephrase_req,
                rephrase_response=rephrase_response
            )

            return Response(rephrase_response, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": f"Error updating history: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def list(self, request, *args, **kwargs):
        """List rephrase history for the authenticated staff"""
        try:
            history = self.get_queryset().filter(staff=request.user).first()
            if not history:
                return Response({"detail": "Rephrase history not found"}, status=status.HTTP_404_NOT_FOUND)

            serializer = self.get_serializer(history)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
