from django.contrib import admin
from .models import Resume


@admin.register(Resume)
class ResumeAdmin(admin.ModelAdmin):
    list_display = ["original_filename", "file_size_kb", "uploaded_at"]
    list_filter = ["uploaded_at"]
    search_fields = ["original_filename"]
    readonly_fields = ["uploaded_at", "file_size"]
