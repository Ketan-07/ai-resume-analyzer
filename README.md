# AI Resume Analyzer

Analyze any resume against a job description using **Google Gemini 2.5 Flash AI**. Get match scores, ATS compatibility, skill gap analysis, and actionable suggestions — all from your browser.

[![GitHub Repo](https://img.shields.io/badge/GitHub-Ketan--07%2Fai--resume--analyzer-blue?logo=github)](https://github.com/Ketan-07/ai-resume-analyzer)
[![Python](https://img.shields.io/badge/Python-3.12%2B-blue)](https://python.org)
[![Django](https://img.shields.io/badge/Django-5.0-green)](https://djangoproject.com)
[![Gemini](https://img.shields.io/badge/Gemini-2.5--Flash-orange)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

---

## Quick Start

```bash
git clone https://github.com/Ketan-07/ai-resume-analyzer.git
cd ai-resume-analyzer/ai_resume_analyzer
python -m venv venv

# Windows
venv\Scripts\activate
# Linux/macOS
# source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env
```

Edit `.env` — add your [Gemini API key](https://aistudio.google.com/app/apikey) and generate a `SECRET_KEY`:

```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

```bash
python manage.py migrate
python manage.py runserver
```

**Open** — [http://127.0.0.1:8000](http://127.0.0.1:8000)

---

## Features

- Upload PDF resume + paste job description
- Match Score & ATS Compatibility Score (0–100)
- Matching vs Missing Skills breakdown
- Strengths, Weaknesses, & Resume Suggestions
- Interview Readiness assessment
- Download PDF report
- Full analysis history

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 5, Python 3.12+ |
| AI | Google Gemini 2.5 Flash (`google-genai`) |
| PDF Parsing | PyPDF2 |
| Report Generation | ReportLab |
| Frontend | Bootstrap 5 + Bootstrap Icons |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Static Files | WhiteNoise |

## Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Click the button above
2. Connect your GitHub repo (`Ketan-07/ai-resume-analyzer`)
3. Add environment variables:
   - `SECRET_KEY` — run `python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"`
   - `GEMINI_API_KEY` — your key from [aistudio.google.com](https://aistudio.google.com/app/apikey)
   - `DEBUG` = `False`
   - `ALLOWED_HOSTS` = `your-app.onrender.com`
4. Deploy!

## Project Structure

```
ai_resume_analyzer/
├── apps/
│   ├── core/           # Landing page, about
│   ├── resume/         # PDF upload, text extraction
│   └── analysis/       # Gemini AI analysis, PDF report
├── config/             # Django settings, URLs, WSGI
├── static/             # CSS, JS assets
├── templates/          # HTML templates
├── tests/              # 31 unit + integration tests
├── Dockerfile
├── docker-compose.yml
├── Procfile
└── requirements.txt
```

## Docker

```bash
docker-compose up --build
```

Visit [http://localhost:8000](http://localhost:8000)

## Tests

```bash
python manage.py test tests -v 2
```

## License

MIT
