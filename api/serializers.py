from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate, password_validation
from django.utils.timezone import now
from .models import EmailThread, PandSDocument, RephraseHistory


class UserSerializer(serializers.HyperlinkedModelSerializer):
    id = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ['url', 'id', 'username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "A user with that username already exists")
        return value

    def validate_password(self, value):
        password_validation.validate_password(value)
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=20)
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        user = authenticate(username=username, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid username or password.")

        attrs['user'] = user
        return attrs


class EmailThreadSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmailThread
        fields = ['id', 'email_thread', 'customer_name', 'last_updated']
        read_only_fields = ['id', 'last_updated']

    def update_thread(self, staff, customer_name, customer_email, agent_response):
        """Concatenate customer' email and agent response to email_thread"""
        thread, _ = EmailThread.objects.get_or_create(
            staff=staff,
            customer_name=customer_name,
            defaults={"email_thread": ""}
        )
        thread.email_thread += '{"role": "user", "content": "' + customer_email + \
            '"}</eot>{"role": "assistant", "content": "' + \
            agent_response + '"}</eot>'
        thread.last_updated = now()
        # print("the thread: ", thread.email_thread)
        thread.save()
        # print("thread updated and saved to database")
        return thread


class PandSDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = PandSDocument
        fields = ['id', 'document']
        read_only_fields = ['last_updated']


class RephraseHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = RephraseHistory
        fields = ['id', 'staff', 'history']
        read_only_fields = ['last_updated']

    def update_history(self, staff, rephrase_req, rephrase_response):
        """Concatenate rephrase request and agent response to history"""
        rephrase_history, _ = RephraseHistory.objects.get_or_create(
            staff=staff,
            defaults={"history": ""}
        )
        rephrase_history.history += '{"role": "user", "content": "' + rephrase_req + \
            '"}</eot>{"role": "assistant", "content": "' + \
            rephrase_response + '"}</eot>'
        # print("the rephrase_history: ", rephrase_history.history)
        rephrase_history.save()
        # print("rephrase_history updated and saved to database")
        return rephrase_history
