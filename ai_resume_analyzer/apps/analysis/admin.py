from django.contrib import admin
from .models import Analysis


@admin.register(Analysis)
class AnalysisAdmin(admin.ModelAdmin):
    list_display = ["id", "resume", "match_score", "ats_score", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["resume__original_filename"]
    readonly_fields = ["created_at", "raw_response"]
