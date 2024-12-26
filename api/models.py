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
