from django.contrib import admin
from .models import EmailThread, PandSDocument, RephraseHistory

# Register your models here.


@admin.register(EmailThread)
class EmailThreadAdmin(admin.ModelAdmin):
    # Display staff, customer_name, and last updated in the admin list view
    list_display = ('staff', 'customer_name', 'last_updated')
    search_fields = ('customer_name',)  # Allow searching by customer name
    list_filter = ('last_updated',)


@admin.register(PandSDocument)
class PandSDocumentAdmin(admin.ModelAdmin):
    list_display = ("document",)


@admin.register(RephraseHistory)
class RephraseHistoryAdmin(admin.ModelAdmin):
    list_display = ("history",)
