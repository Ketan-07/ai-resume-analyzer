# AI Resume Analyzer

A production-quality Django web application that uses **Google Gemini AI** to analyze resumes against job descriptions. Provides match scores, ATS compatibility, skills gap analysis, strengths/weaknesses, and actionable improvement suggestions.

![Python](https://img.shields.io/badge/Python-3.12-blue)
![Django](https://img.shields.io/badge/Django-5.0-green)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)

---

## Features

- Upload a PDF resume and paste any job description
- AI-powered analysis via Google Gemini
- Match Score & ATS Compatibility Score (0–100)
- Matching Skills vs Missing Skills breakdown
- Strengths and Weaknesses
- Actionable resume improvement suggestions
- Interview Readiness assessment
- Persistent history of all analyses
- Download PDF report for any analysis
- Responsive Bootstrap 5 UI

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 5, Python 3.12 |
| AI | Google Gemini API (`google-genai`) |
| PDF Parsing | PyPDF2 |
| Report Generation | ReportLab |
| Frontend | Bootstrap 5 + Bootstrap Icons |
| Database | SQLite (dev) |
| Static Files | WhiteNoise |
| Production Server | Gunicorn |
| Config | python-decouple |

---

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
│   ├── base.html
│   ├── core/
│   ├── resume/
│   └── analysis/
├── tests/              # Unit + integration tests
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── Procfile
├── build.sh
└── requirements.txt
```

---

## Local Development Setup

### Prerequisites

- Python 3.12+
- A Google Gemini API key ([get one here](https://aistudio.google.com/app/apikey))

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate        # Linux/macOS
# or
venv\Scripts\activate           # Windows
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and set your values:

```env
SECRET_KEY=your-django-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
GEMINI_API_KEY=your-gemini-api-key
```

Generate a secure `SECRET_KEY`:
```bash
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 5. Run migrations

```bash
python manage.py migrate
```

### 6. Create a superuser (optional, for admin)

```bash
python manage.py createsuperuser
```

### 7. Run the development server

```bash
python manage.py runserver
```

Visit **http://localhost:8000**

---

## Running Tests

```bash
python manage.py test tests
```

To run with verbosity:
```bash
python manage.py test tests -v 2
```

---

## Docker Deployment

### Build and run

```bash
# Copy and configure your environment
cp .env.example .env
# Edit .env with your GEMINI_API_KEY and a strong SECRET_KEY

# Build and start
docker-compose up --build
```

Visit **http://localhost:8000**

### Run manually

```bash
docker build -t ai-resume-analyzer .
docker run -p 8000:8000 --env-file .env ai-resume-analyzer
```

---

## Deployment on Render

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `./build.sh`
   - **Start Command:** `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2`
   - **Environment Variables:**
     - `SECRET_KEY` = (generate a secure key)
     - `DEBUG` = `False`
     - `ALLOWED_HOSTS` = `your-app.onrender.com`
     - `GEMINI_API_KEY` = (your API key)
5. Deploy!

---

## Deployment on Railway

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add environment variables in the Variables tab:
   - `SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`, `GEMINI_API_KEY`
4. Railway auto-detects the `Procfile` and deploys

---

## Deployment on Ubuntu VPS (Gunicorn + Nginx)

### 1. Install dependencies

```bash
sudo apt update && sudo apt install python3.12 python3.12-venv nginx
```

### 2. Clone and set up

```bash
git clone https://github.com/YOUR_USERNAME/ai-resume-analyzer.git /var/www/resume-analyzer
cd /var/www/resume-analyzer
python3.12 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with production values
python manage.py migrate
python manage.py collectstatic --noinput
```

### 3. Create a systemd service

```bash
sudo nano /etc/systemd/system/resume-analyzer.service
```

```ini
[Unit]
Description=AI Resume Analyzer
After=network.target

[Service]
User=www-data
WorkingDirectory=/var/www/resume-analyzer
ExecStart=/var/www/resume-analyzer/venv/bin/gunicorn config.wsgi:application --workers 3 --bind unix:/run/resume-analyzer.sock
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable resume-analyzer
sudo systemctl start resume-analyzer
```

### 4. Configure Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location /static/ {
        alias /var/www/resume-analyzer/staticfiles/;
    }

    location /media/ {
        alias /var/www/resume-analyzer/media/;
    }

    location / {
        proxy_pass http://unix:/run/resume-analyzer.sock;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## GitHub Setup

```bash
git init
git add .
git commit -m "Initial commit: AI Resume Analyzer"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-resume-analyzer.git
git push -u origin main
```

---

## Architecture Notes

This project follows **clean architecture** principles:

- **Views** — thin, handle HTTP only
- **Services** — all business/AI logic (`services.py` in each app)
- **Models** — data and helpers only
- **Templates** — presentation only

The Gemini AI call lives entirely in `apps/analysis/services.py`. Views call `analyze_resume()` and never interact with the SDK directly. This makes the AI logic easy to test, swap, or extend.

---

## License

MIT — free to use, modify, and deploy.
