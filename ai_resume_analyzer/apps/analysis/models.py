"""Analysis model — stores AI-generated resume analysis results."""

from django.db import models
from apps.resume.models import Resume


class Analysis(models.Model):
    """
    Stores the complete result of an AI analysis for a resume against a job description.
    All score fields are integers 0–100.
    List fields (skills, strengths, etc.) are stored as newline-separated strings.
    """

    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name="analyses")
    job_description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    # Scores
    match_score = models.PositiveSmallIntegerField(default=0, help_text="Overall match % (0–100)")
    ats_score = models.PositiveSmallIntegerField(default=0, help_text="ATS compatibility % (0–100)")

    # Skills — stored as newline-separated values
    matching_skills = models.TextField(blank=True, help_text="Newline-separated matching skills")
    missing_skills = models.TextField(blank=True, help_text="Newline-separated missing skills")

    # Narrative fields
    strengths = models.TextField(blank=True)
    weaknesses = models.TextField(blank=True)
    suggestions = models.TextField(blank=True)
    interview_readiness = models.TextField(blank=True)

    # Raw JSON from AI (useful for debugging)
    raw_response = models.TextField(blank=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Analysis"
        verbose_name_plural = "Analyses"

    def __str__(self):
        return f"Analysis #{self.pk} — {self.resume.original_filename} ({self.match_score}% match)"

    # ── Helpers to convert newline-separated fields to lists ──────────────────

    def get_matching_skills_list(self):
        return [s.strip() for s in self.matching_skills.splitlines() if s.strip()]

    def get_missing_skills_list(self):
        return [s.strip() for s in self.missing_skills.splitlines() if s.strip()]

    def get_strengths_list(self):
        return [s.strip() for s in self.strengths.splitlines() if s.strip()]

    def get_weaknesses_list(self):
        return [s.strip() for s in self.weaknesses.splitlines() if s.strip()]

    def get_suggestions_list(self):
        return [s.strip() for s in self.suggestions.splitlines() if s.strip()]

    @property
    def score_label(self):
        """Return a human-readable label for the match score."""
        if self.match_score >= 80:
            return ("Excellent", "success")
        elif self.match_score >= 60:
            return ("Good", "primary")
        elif self.match_score >= 40:
            return ("Fair", "warning")
        else:
            return ("Needs Work", "danger")
