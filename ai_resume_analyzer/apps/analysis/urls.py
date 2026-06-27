from django.urls import path
from . import views

app_name = "analysis"

urlpatterns = [
    path("", views.analysis_list, name="list"),
    path("create/<int:resume_id>/", views.create, name="create"),
    path("<int:analysis_id>/", views.detail, name="detail"),
    path("<int:analysis_id>/download/", views.download_report, name="download"),
]
