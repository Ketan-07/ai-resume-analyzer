"""Core views — landing page and dashboard."""

import logging
from django.shortcuts import render
from apps.analysis.models import Analysis

logger = logging.getLogger(__name__)


def home(request):
    """Landing page with a quick overview of recent analyses."""
    recent_analyses = Analysis.objects.select_related("resume").order_by("-created_at")[:5]
    total_analyses = Analysis.objects.count()

    context = {
        "recent_analyses": recent_analyses,
        "total_analyses": total_analyses,
    }
    return render(request, "core/home.html", context)


def about(request):
    """About page explaining the tool."""
    return render(request, "core/about.html")
