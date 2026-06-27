"""
Resume service layer.
Handles PDF text extraction — all business logic stays here, not in views.
"""

import logging
from PyPDF2 import PdfReader
from PyPDF2.errors import PdfReadError

logger = logging.getLogger(__name__)


class ResumeExtractionError(Exception):
    """Raised when PDF text extraction fails."""
    pass


def extract_text_from_pdf(file_obj) -> str:
    """
    Extract all text from a PDF file object.

    Args:
        file_obj: A file-like object (Django InMemoryUploadedFile or similar).

    Returns:
        Extracted text as a single string.

    Raises:
        ResumeExtractionError: If the PDF cannot be read or yields no text.
    """
    try:
        reader = PdfReader(file_obj)
    except PdfReadError as exc:
        logger.error("Failed to parse PDF: %s", exc)
        raise ResumeExtractionError("The uploaded file is not a valid PDF.") from exc
    except Exception as exc:
        logger.error("Unexpected error reading PDF: %s", exc)
        raise ResumeExtractionError("Could not read the uploaded file.") from exc

    if len(reader.pages) == 0:
        raise ResumeExtractionError("The PDF has no pages.")

    text_parts = []
    for page_num, page in enumerate(reader.pages, start=1):
        try:
            page_text = page.extract_text() or ""
            text_parts.append(page_text)
        except Exception as exc:
            logger.warning("Could not extract text from page %d: %s", page_num, exc)

    full_text = "\n".join(text_parts).strip()

    if not full_text:
        raise ResumeExtractionError(
            "No text could be extracted. The PDF may be image-based (scanned). "
            "Please upload a text-based PDF."
        )

    logger.info("Extracted %d characters from PDF (%d pages)", len(full_text), len(reader.pages))
    return full_text
