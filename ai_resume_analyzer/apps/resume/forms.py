"""Forms for resume upload and job description input."""

from django import forms
from django.conf import settings
import os


class ResumeUploadForm(forms.Form):
    """Validates the uploaded resume PDF and job description."""

    resume = forms.FileField(
        label="Resume PDF",
        help_text="Upload your resume in PDF format (max 5 MB).",
        widget=forms.ClearableFileInput(attrs={
            "class": "form-control",
            "accept": ".pdf",
        }),
    )
    job_description = forms.CharField(
        label="Job Description",
        help_text="Paste the full job description here.",
        min_length=50,
        widget=forms.Textarea(attrs={
            "class": "form-control",
            "rows": 10,
            "placeholder": "Paste the job description here...",
        }),
    )

    def clean_resume(self):
        resume = self.cleaned_data.get("resume")
        if not resume:
            return resume

        # Check file extension
        ext = os.path.splitext(resume.name)[1].lower()
        if ext not in settings.ALLOWED_RESUME_EXTENSIONS:
            raise forms.ValidationError("Only PDF files are accepted.")

        # Check file size
        if resume.size > settings.MAX_UPLOAD_SIZE:
            max_mb = settings.MAX_UPLOAD_SIZE / (1024 * 1024)
            raise forms.ValidationError(f"File size must be under {max_mb:.0f} MB.")

        return resume

    def clean_job_description(self):
        jd = self.cleaned_data.get("job_description", "").strip()
        if len(jd) < 50:
            raise forms.ValidationError("Please enter a more detailed job description (at least 50 characters).")
        return jd
