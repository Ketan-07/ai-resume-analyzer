from django.urls import path
from . import views

app_name = "resume"

urlpatterns = [
    path("upload/", views.upload, name="upload"),
    path("", views.resume_list, name="list"),
    path("<int:resume_id>/", views.resume_detail, name="detail"),
]
