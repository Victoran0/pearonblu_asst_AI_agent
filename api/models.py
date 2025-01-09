from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class EmailThread(models.Model):
    staff = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="email_threads")
    email_thread = models.TextField()
    customer_name = models.CharField(max_length=255, unique=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        # Ensure customer_name is unique per staff
        constraints = [
            models.UniqueConstraint(
                fields=["staff", "customer_name"], name="unique_customer_per_staff")
        ]

    def __str__(self):
        return f"Thread with {self.customer_name} by {self.staff.username}"


class PandSDocument(models.Model):
    document = models.TextField()
    last_updated = models.DateTimeField(auto_now=True)
    last_upserted = models.CharField(blank=True, max_length=255)

    def save(self, *args, **kwargs):
        # Ensure only one instance of PandSDocument exists
        if not PandSDocument.objects.exists() or self.pk:
            super().save(*args, **kwargs)
        else:
            raise Exception(
                "Only one price and services document instance is allowed.")

    def __str__(self):
        return f"Price and Services document. Last Updated at {self.last_updated}"
