from django.contrib import admin
from .models import EmailThread

# Register your models here.


@admin.register(EmailThread)
class EmailThreadAdmin(admin.ModelAdmin):
    # Display staff, customer_name, and last updated in the admin list view
    list_display = ('staff', 'customer_name', 'last_updated')
    search_fields = ('customer_name',)  # Allow searching by customer name
    list_filter = ('last_updated',)
