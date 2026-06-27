"""
Gemini AI service.

Sends resume text + job description to Google Gemini and parses
the structured JSON response into an Analysis-ready dict.
All AI logic lives here — views never call Gemini directly.
"""

import json
import logging
import re
import time
from django.conf import settings

logger = logging.getLogger(__name__)


class GeminiAnalysisError(Exception):
    """Raised when the Gemini API call or response parsing fails."""
    pass


# ── Prompt template ───────────────────────────────────────────────────────────

ANALYSIS_PROMPT = """
You are an expert ATS (Applicant Tracking System) and career coach.
Analyze the resume below against the provided job description.

Return ONLY a valid JSON object — no markdown, no code fences, no extra text.

JSON schema:
{{
  "match_score": <integer 0-100>,
  "ats_score": <integer 0-100>,
  "matching_skills": ["skill1", "skill2", ...],
  "missing_skills": ["skill1", "skill2", ...],
  "strengths": ["strength1", "strength2", ...],
  "weaknesses": ["weakness1", "weakness2", ...],
  "suggestions": ["suggestion1", "suggestion2", ...],
  "interview_readiness": "<2-3 sentence paragraph>"
}}

Definitions:
- match_score: How well the resume matches the job description overall (0-100).
- ats_score: How well the resume is formatted/keyworded for ATS systems (0-100).
- matching_skills: Technical and soft skills present in both resume and JD.
- missing_skills: Important skills in the JD that are absent from the resume.
- strengths: Specific strong points of this resume for this role.
- weaknesses: Specific gaps or weak areas for this role.
- suggestions: Concrete, actionable changes to improve the resume for this JD.
- interview_readiness: A short honest assessment of how prepared the candidate seems.

--- RESUME ---
{resume_text}

--- JOB DESCRIPTION ---
{job_description}
"""


def analyze_resume(resume_text: str, job_description: str) -> dict:
    """
    Send resume text and job description to Gemini and return parsed results.
    Automatically retries with backoff and falls back to alternative models on 429.

    Args:
        resume_text: Extracted plain text from the resume PDF.
        job_description: The pasted job description.

    Returns:
        A dict with keys: match_score, ats_score, matching_skills,
        missing_skills, strengths, weaknesses, suggestions, interview_readiness,
        and raw_response.

    Raises:
        GeminiAnalysisError: If all attempts fail.
    """
    if not settings.GEMINI_API_KEY:
        raise GeminiAnalysisError(
            "GEMINI_API_KEY is not configured. Please add it to your .env file."
        )

    try:
        from google import genai
        from google.genai import errors as genai_errors
        client = genai.Client(api_key=settings.GEMINI_API_KEY)
    except Exception as exc:
        logger.error("Failed to initialise Gemini client: %s", exc)
        raise GeminiAnalysisError("Could not connect to the Gemini API.") from exc

    prompt = ANALYSIS_PROMPT.format(
        resume_text=resume_text[:8000],
        job_description=job_description[:4000],
    )

    models = [settings.GEMINI_MODEL] + list(getattr(settings, "GEMINI_FALLBACK_MODELS", []))
    last_error = None

    for attempt in range(1, 4):
        for model in models:
            logger.info("Attempt %d with model: %s", attempt, model)
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=prompt,
                )
                raw_text = response.text
                logger.debug("Raw Gemini response: %s", raw_text[:500])
                parsed = _parse_gemini_response(raw_text)
                parsed["raw_response"] = raw_text
                return parsed
            except genai_errors.ClientError as exc:
                last_error = exc
                if "429" in str(exc) or "RESOURCE_EXHAUSTED" in str(exc):
                    logger.warning("Quota exceeded on %s: %s", model, exc)
                    time.sleep(2)
                    continue
                logger.error("Gemini API client error on %s: %s", model, exc)
                break
            except Exception as exc:
                last_error = exc
                logger.error("Gemini API call failed on %s: %s", model, exc)
                continue
        time.sleep(3 * attempt)

    raise GeminiAnalysisError(
        f"Gemini API error after all retries: {last_error}"
    ) from last_error


def _parse_gemini_response(raw_text: str) -> dict:
    """
    Parse the raw Gemini response into a clean dict.
    Handles minor formatting issues like stray markdown fences.
    """
    # Strip markdown code fences if present
    cleaned = re.sub(r"```(?:json)?", "", raw_text).strip()

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        logger.error("JSON parse error. Raw response: %s", raw_text[:1000])
        raise GeminiAnalysisError(
            "The AI returned an unexpected response format. Please try again."
        ) from exc

    # Validate and normalise required fields
    result = {
        "match_score": _clamp(data.get("match_score", 0)),
        "ats_score": _clamp(data.get("ats_score", 0)),
        "matching_skills": _to_newline_str(data.get("matching_skills", [])),
        "missing_skills": _to_newline_str(data.get("missing_skills", [])),
        "strengths": _to_newline_str(data.get("strengths", [])),
        "weaknesses": _to_newline_str(data.get("weaknesses", [])),
        "suggestions": _to_newline_str(data.get("suggestions", [])),
        "interview_readiness": str(data.get("interview_readiness", "")).strip(),
    }
    return result


def _clamp(value) -> int:
    """Ensure value is an integer between 0 and 100."""
    try:
        return max(0, min(100, int(value)))
    except (TypeError, ValueError):
        return 0


def _to_newline_str(items) -> str:
    """Convert a list of strings to a newline-separated string."""
    if isinstance(items, list):
        return "\n".join(str(item).strip() for item in items if str(item).strip())
    return str(items).strip()
