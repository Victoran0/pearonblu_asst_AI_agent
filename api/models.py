from django.db import models
from django.contrib.auth.models import User

# Create your models here.


class EmailThread(models.Model):
    staff = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="email_threads")
    email_thread = models.TextField()
    customer_name = models.CharField(max_length=255)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('staff', 'customer_name')

    def __str__(self):
        return f"Thread with {self.customer_name} by {self.staff.username}"
