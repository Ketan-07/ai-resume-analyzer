"""Analysis views — create, list, detail, and download."""

import logging
from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse
from django.contrib import messages

from apps.resume.models import Resume
from .models import Analysis
from .services import analyze_resume, GeminiAnalysisError
from .report import generate_analysis_pdf

logger = logging.getLogger(__name__)


def create(request, resume_id):
    """
    Run the AI analysis for a resume.
    Retrieves the job description from the session, calls Gemini, saves results.
    """
    resume = get_object_or_404(Resume, pk=resume_id)
    job_description = request.session.pop("job_description", None)

    if not job_description:
        messages.error(request, "Session expired. Please upload your resume again.")
        return redirect("resume:upload")

    if not resume.extracted_text:
        messages.error(request, "No text could be found in the resume. Please re-upload.")
        return redirect("resume:upload")

    try:
        result = analyze_resume(resume.extracted_text, job_description)
    except GeminiAnalysisError as exc:
        logger.error("Analysis failed for resume %d: %s", resume_id, exc)
        messages.error(request, str(exc))
        return redirect("resume:upload")

    analysis = Analysis.objects.create(
        resume=resume,
        job_description=job_description,
        match_score=result["match_score"],
        ats_score=result["ats_score"],
        matching_skills=result["matching_skills"],
        missing_skills=result["missing_skills"],
        strengths=result["strengths"],
        weaknesses=result["weaknesses"],
        suggestions=result["suggestions"],
        interview_readiness=result["interview_readiness"],
        raw_response=result["raw_response"],
    )

    logger.info(
        "Analysis %d created: match=%d%%, ats=%d%%",
        analysis.pk, analysis.match_score, analysis.ats_score,
    )
    return redirect("analysis:detail", analysis_id=analysis.pk)


def detail(request, analysis_id):
    """Display the full analysis results."""
    analysis = get_object_or_404(Analysis.objects.select_related("resume"), pk=analysis_id)
    context = {
        "analysis": analysis,
        "matching_skills": analysis.get_matching_skills_list(),
        "missing_skills": analysis.get_missing_skills_list(),
        "strengths": analysis.get_strengths_list(),
        "weaknesses": analysis.get_weaknesses_list(),
        "suggestions": analysis.get_suggestions_list(),
        "score_label": analysis.score_label[0],
        "score_color": analysis.score_label[1],
    }
    return render(request, "analysis/detail.html", context)


def analysis_list(request):
    """List all past analyses."""
    analyses = Analysis.objects.select_related("resume").all()
    return render(request, "analysis/list.html", {"analyses": analyses})


def download_report(request, analysis_id):
    """Generate and download a PDF report for an analysis."""
    analysis = get_object_or_404(Analysis.objects.select_related("resume"), pk=analysis_id)

    try:
        pdf_bytes = generate_analysis_pdf(analysis)
    except Exception as exc:
        logger.error("PDF generation failed for analysis %d: %s", analysis_id, exc)
        messages.error(request, "Could not generate the PDF report. Please try again.")
        return redirect("analysis:detail", analysis_id=analysis_id)

    filename = f"analysis_{analysis_id}_{analysis.resume.original_filename.replace(' ', '_')}.pdf"
    response = HttpResponse(pdf_bytes, content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="{filename}"'
    return response
