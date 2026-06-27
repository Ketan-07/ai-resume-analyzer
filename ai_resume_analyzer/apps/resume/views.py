"""Resume views — upload and manage resumes."""

import logging
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages

from .forms import ResumeUploadForm
from .models import Resume
from .services import extract_text_from_pdf, ResumeExtractionError

logger = logging.getLogger(__name__)


def upload(request):
    """
    Handle resume upload and job description submission.
    On success, creates a Resume and redirects to analysis.
    """
    if request.method == "POST":
        form = ResumeUploadForm(request.POST, request.FILES)
        if form.is_valid():
            uploaded_file = form.cleaned_data["resume"]
            job_description = form.cleaned_data["job_description"]

            # Extract text from PDF before saving
            try:
                extracted_text = extract_text_from_pdf(uploaded_file)
            except ResumeExtractionError as exc:
                messages.error(request, str(exc))
                return render(request, "resume/upload.html", {"form": form})

            # Reset file pointer after reading for saving
            uploaded_file.seek(0)

            resume = Resume.objects.create(
                file=uploaded_file,
                original_filename=uploaded_file.name,
                extracted_text=extracted_text,
                file_size=uploaded_file.size,
            )

            logger.info("Resume %d uploaded: %s", resume.pk, resume.original_filename)

            # Redirect to analysis creation with resume id and JD in session
            request.session["job_description"] = job_description
            return redirect("analysis:create", resume_id=resume.pk)
    else:
        form = ResumeUploadForm()

    return render(request, "resume/upload.html", {"form": form})


def resume_list(request):
    """List all uploaded resumes."""
    resumes = Resume.objects.all()
    return render(request, "resume/list.html", {"resumes": resumes})


def resume_detail(request, resume_id):
    """View extracted text of a specific resume."""
    resume = get_object_or_404(Resume, pk=resume_id)
    return render(request, "resume/detail.html", {"resume": resume})
