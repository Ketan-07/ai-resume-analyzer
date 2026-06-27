"""
Unit tests for AI Resume Analyzer.

Run with: python manage.py test tests
"""

import io
import json
from unittest.mock import patch, MagicMock

from django.test import TestCase, Client
from django.urls import reverse
from django.core.files.uploadedfile import SimpleUploadedFile

from apps.resume.models import Resume
from apps.resume.services import extract_text_from_pdf, ResumeExtractionError
from apps.resume.forms import ResumeUploadForm
from apps.analysis.models import Analysis
from apps.analysis.services import (
    analyze_resume, GeminiAnalysisError, _clamp, _to_newline_str, _parse_gemini_response
)


# ── Helper factories ───────────────────────────────────────────────────────────

def make_resume(text="Sample resume text with Python Django skills.") -> Resume:
    """Create a Resume instance for testing."""
    return Resume.objects.create(
        file=SimpleUploadedFile("test_resume.pdf", b"%PDF-1.4 fake", content_type="application/pdf"),
        original_filename="test_resume.pdf",
        extracted_text=text,
        file_size=1024,
    )


def make_analysis(resume=None, match_score=75, ats_score=80) -> Analysis:
    """Create an Analysis instance for testing."""
    if resume is None:
        resume = make_resume()
    return Analysis.objects.create(
        resume=resume,
        job_description="We need a Django developer with Python experience.",
        match_score=match_score,
        ats_score=ats_score,
        matching_skills="Python\nDjango",
        missing_skills="Docker\nKubernetes",
        strengths="Strong Python background\nDjango experience",
        weaknesses="No Docker experience",
        suggestions="Add Docker to your skills\nInclude project metrics",
        interview_readiness="The candidate appears reasonably prepared.",
    )


# ── Resume service tests ───────────────────────────────────────────────────────

class ResumeExtractionTests(TestCase):

    def test_extract_text_invalid_pdf_raises(self):
        """Non-PDF bytes should raise ResumeExtractionError."""
        fake_file = io.BytesIO(b"this is not a pdf")
        with self.assertRaises(ResumeExtractionError):
            extract_text_from_pdf(fake_file)

    def test_extract_text_empty_bytes_raises(self):
        """Empty file should raise ResumeExtractionError."""
        with self.assertRaises(ResumeExtractionError):
            extract_text_from_pdf(io.BytesIO(b""))


# ── Resume form tests ─────────────────────────────────────────────────────────

class ResumeUploadFormTests(TestCase):

    def _valid_form_data(self, jd="This is a valid job description that is long enough for the form."):
        pdf_content = b"%PDF-1.4 1 0 obj<</Type /Catalog>> endobj"
        pdf_file = SimpleUploadedFile("resume.pdf", pdf_content, content_type="application/pdf")
        return {"job_description": jd}, {"resume": pdf_file}

    def test_form_rejects_non_pdf(self):
        txt_file = SimpleUploadedFile("resume.txt", b"some text", content_type="text/plain")
        form = ResumeUploadForm(
            {"job_description": "A" * 60},
            {"resume": txt_file},
        )
        self.assertFalse(form.is_valid())
        self.assertIn("resume", form.errors)

    def test_form_rejects_short_job_description(self):
        pdf_file = SimpleUploadedFile("resume.pdf", b"%PDF-1.4", content_type="application/pdf")
        form = ResumeUploadForm(
            {"job_description": "Too short"},
            {"resume": pdf_file},
        )
        self.assertFalse(form.is_valid())
        self.assertIn("job_description", form.errors)

    def test_form_rejects_oversized_file(self):
        big_file = SimpleUploadedFile(
            "resume.pdf",
            b"%PDF-1.4" + b"x" * (6 * 1024 * 1024),
            content_type="application/pdf",
        )
        form = ResumeUploadForm(
            {"job_description": "A" * 60},
            {"resume": big_file},
        )
        self.assertFalse(form.is_valid())
        self.assertIn("resume", form.errors)


# ── Analysis service helper tests ─────────────────────────────────────────────

class AnalysisServiceHelperTests(TestCase):

    def test_clamp_normal(self):
        self.assertEqual(_clamp(75), 75)

    def test_clamp_above_100(self):
        self.assertEqual(_clamp(150), 100)

    def test_clamp_below_0(self):
        self.assertEqual(_clamp(-10), 0)

    def test_clamp_non_numeric(self):
        self.assertEqual(_clamp("bad"), 0)

    def test_to_newline_str_list(self):
        result = _to_newline_str(["Python", "Django", "REST"])
        self.assertEqual(result, "Python\nDjango\nREST")

    def test_to_newline_str_empty(self):
        self.assertEqual(_to_newline_str([]), "")

    def test_parse_gemini_response_valid(self):
        payload = {
            "match_score": 80,
            "ats_score": 70,
            "matching_skills": ["Python", "Django"],
            "missing_skills": ["Docker"],
            "strengths": ["Good Python skills"],
            "weaknesses": ["No cloud experience"],
            "suggestions": ["Add AWS to resume"],
            "interview_readiness": "Well prepared.",
        }
        result = _parse_gemini_response(json.dumps(payload))
        self.assertEqual(result["match_score"], 80)
        self.assertEqual(result["ats_score"], 70)
        self.assertIn("Python", result["matching_skills"])

    def test_parse_gemini_response_strips_fences(self):
        payload = {"match_score": 55, "ats_score": 60, "matching_skills": [],
                   "missing_skills": [], "strengths": [], "weaknesses": [],
                   "suggestions": [], "interview_readiness": "OK."}
        fenced = f"```json\n{json.dumps(payload)}\n```"
        result = _parse_gemini_response(fenced)
        self.assertEqual(result["match_score"], 55)

    def test_parse_gemini_response_invalid_json_raises(self):
        from apps.analysis.services import GeminiAnalysisError
        with self.assertRaises(GeminiAnalysisError):
            _parse_gemini_response("not json at all")


# ── Analysis model tests ──────────────────────────────────────────────────────

class AnalysisModelTests(TestCase):

    def setUp(self):
        self.analysis = make_analysis()

    def test_get_matching_skills_list(self):
        skills = self.analysis.get_matching_skills_list()
        self.assertIn("Python", skills)
        self.assertIn("Django", skills)

    def test_get_missing_skills_list(self):
        skills = self.analysis.get_missing_skills_list()
        self.assertIn("Docker", skills)

    def test_score_label_excellent(self):
        self.analysis.match_score = 85
        label, color = self.analysis.score_label
        self.assertEqual(label, "Excellent")
        self.assertEqual(color, "success")

    def test_score_label_needs_work(self):
        self.analysis.match_score = 25
        label, color = self.analysis.score_label
        self.assertEqual(label, "Needs Work")
        self.assertEqual(color, "danger")

    def test_str_representation(self):
        s = str(self.analysis)
        self.assertIn("test_resume.pdf", s)


# ── View integration tests ────────────────────────────────────────────────────

class CoreViewTests(TestCase):

    def setUp(self):
        self.client = Client()

    def test_home_returns_200(self):
        response = self.client.get(reverse("core:home"))
        self.assertEqual(response.status_code, 200)

    def test_about_returns_200(self):
        response = self.client.get(reverse("core:about"))
        self.assertEqual(response.status_code, 200)


class ResumeViewTests(TestCase):

    def setUp(self):
        self.client = Client()

    def test_upload_page_get(self):
        response = self.client.get(reverse("resume:upload"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Analyze")

    def test_resume_list_empty(self):
        response = self.client.get(reverse("resume:list"))
        self.assertEqual(response.status_code, 200)

    def test_resume_list_with_data(self):
        make_resume()
        response = self.client.get(reverse("resume:list"))
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "test_resume.pdf")


class AnalysisViewTests(TestCase):

    def setUp(self):
        self.client = Client()
        self.analysis = make_analysis()

    def test_analysis_list_returns_200(self):
        response = self.client.get(reverse("analysis:list"))
        self.assertEqual(response.status_code, 200)

    def test_analysis_detail_returns_200(self):
        response = self.client.get(reverse("analysis:detail", args=[self.analysis.pk]))
        self.assertEqual(response.status_code, 200)

    def test_analysis_detail_shows_score(self):
        response = self.client.get(reverse("analysis:detail", args=[self.analysis.pk]))
        self.assertContains(response, "75")

    def test_analysis_detail_404_on_missing(self):
        response = self.client.get(reverse("analysis:detail", args=[99999]))
        self.assertEqual(response.status_code, 404)

    def test_analysis_create_without_session_redirects(self):
        resume = make_resume()
        response = self.client.get(reverse("analysis:create", args=[resume.pk]))
        self.assertEqual(response.status_code, 302)

    def test_download_report_returns_pdf(self):
        response = self.client.get(reverse("analysis:download", args=[self.analysis.pk]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response["Content-Type"], "application/pdf")

    @patch("apps.analysis.views.analyze_resume")
    def test_analysis_create_with_session(self, mock_analyze):
        """Test analysis creation with mocked Gemini response."""
        mock_analyze.return_value = {
            "match_score": 82,
            "ats_score": 78,
            "matching_skills": "Python\nDjango",
            "missing_skills": "Docker",
            "strengths": "Strong Python",
            "weaknesses": "No Docker",
            "suggestions": "Add Docker",
            "interview_readiness": "Well prepared.",
            "raw_response": "{}",
        }
        resume = make_resume()
        session = self.client.session
        session["job_description"] = "We need a Python Django developer with extensive experience."
        session.save()

        response = self.client.get(reverse("analysis:create", args=[resume.pk]))
        self.assertEqual(response.status_code, 302)
        self.assertTrue(Analysis.objects.filter(resume=resume).exists())
