"""Resume model — stores uploaded PDF and extracted text."""

import os
from django.db import models
from django.utils import timezone


def resume_upload_path(instance, filename):
    """Store resumes in media/resumes/<year>/<month>/filename."""
    now = timezone.now()
    return os.path.join("resumes", str(now.year), str(now.month), filename)


class Resume(models.Model):
    """Represents an uploaded resume PDF."""

    file = models.FileField(upload_to=resume_upload_path)
    original_filename = models.CharField(max_length=255)
    extracted_text = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    file_size = models.PositiveIntegerField(default=0, help_text="Size in bytes")

    class Meta:
        ordering = ["-uploaded_at"]
        verbose_name = "Resume"
        verbose_name_plural = "Resumes"

    def __str__(self):
        return f"{self.original_filename} ({self.uploaded_at.strftime('%Y-%m-%d')})"

    @property
    def file_size_kb(self):
        return round(self.file_size / 1024, 1)
