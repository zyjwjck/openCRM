# openCRM

A modern, **AI-agent-driven** CRM platform built with Django REST Framework and SvelteKit, seamlessly integrating the nanobot agent to bring AI capabilities into customer relationship management.

[![Language Switch](https://img.shields.io/badge/README-%E4%B8%AD%E6%96%87%20%F0%9F%87%A8%F0%9F%87%B3-blueviolet.svg)](#language-switch) [中文版本](README_zh.md)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.12+-green.svg)
![Django](https://img.shields.io/badge/django-5.x-green.svg)
![SvelteKit](https://img.shields.io/badge/sveltekit-2.x-orange.svg)
![Svelte](https://img.shields.io/badge/svelte-5-orange.svg)
![AI](https://img.shields.io/badge/AI-powered-blueviolet.svg)

---

## Overview

openCRM is a full-featured Customer Relationship Management system designed for startups and small businesses, whose **defining feature is a built-in AI agent**. It combines a powerful Django REST API backend with a modern SvelteKit frontend, featuring multi-tenant architecture with PostgreSQL Row-Level Security (RLS) for enterprise-grade data isolation. The [nanobot](https://github.com/HKUDS/nanobot) agent is natively embedded into the CRM sidebar at the `/agent` route for automated workflows and intelligent decision support.

## AI Agent Integration (Core Feature)

openCRM's AI capabilities come from [nanobot](https://github.com/HKUDS/nanobot) — an ultra-lightweight (~4,000 lines) personal AI agent framework. The integration is minimal yet powerful:

- **Native iframe embed**: nanobot's React + TypeScript WebUI runs on port `8765` and is embedded directly as an iframe at the CRM sidebar's `/agent` route — **no chat UI to rebuild**, full agent experience out of the box
- **Zero-config auth**: first visit to `/agent` authenticates via a `bootstrapSecret` parameter; nanobot maintains subsequent auth in its own `localStorage`
- **Full capability inheritance**: the embedded nanobot retains everything — sessions, long-term memory, MCP tools, automations, voice transcription, multi-channel gateways (Telegram / Discord / Feishu / ...)
- **Flexible LLM switching**: configure OpenAI, Anthropic, Google, vLLM, and other providers inside nanobot's own Settings panel — no duplicate CRM-side config

**Architecture:**

```
┌───────────────────────────────────────────────────────────────┐
│  openCRM Frontend (SvelteKit :5173)                          │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ /agent route                                             │  │
│  │  ┌───────────────────────────────────────────────────┐   │  │
│  │  │ iframe → http://127.0.0.1:8765 (nanobot WebUI)    │   │  │
│  │  │   ✓ Sessions   ✓ Memory   ✓ MCP Tools   ✓ Automation│   │  │
│  │  │   ✓ Voice      ✓ Channel gateways (Feishu/TG/DC..) │   │  │
│  │  └───────────────────────────────────────────────────┘   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                               │
│  Sidebar → AI → Agent                                         │
└───────────────────────────────────────────────────────────────┘
       ↕ REST API
┌───────────────────────────────────────────────────────────────┐
│  openCRM Backend (Django :8000)                               │
│  • Multi-tenant RLS isolation • JWT auth • 7 CRM modules      │
└───────────────────────────────────────────────────────────────┘
```

## Features

### Core CRM Modules
- **Leads** — Track and manage sales leads through your pipeline
- **Accounts** — Manage company / organization records
- **Contacts** — Store and organize contact information
- **Opportunities** — Track deals and sales opportunities
- **Cases** — Customer support case management
- **Tasks** — Task management with calendar and Kanban board views
- **Invoices** — Create and manage invoices

### AI-Powered Features (provided by nanobot)
- **Intelligent Lead Scoring** — AI-driven lead qualification and prioritization
- **Automated Follow-up** — Smart reminders and personalized outreach suggestions
- **Predictive Analytics** — Forecasting and trend analysis for sales and customer behavior
- **Natural Language Processing** — Conversational interfaces for data entry and retrieval
- **Smart Document Processing** — Automated extraction of information from documents
- **24/7 Market Analysis** — Real-time insights to inform sales and marketing strategies

### Platform Features
- **Multi-Tenant Architecture** — PostgreSQL RLS for secure data isolation between organizations
- **JWT Authentication** — Secure token-based authentication
- **Team Management** — Organize users into teams with role-based access
- **Activity Tracking** — Comprehensive audit logs and activity history
- **Comments & Attachments** — Collaborate with comments and file attachments on any record
- **Tags** — Flexible tagging system for organizing records
- **Email Integration** — AWS SES integration for transactional emails
- **Background Tasks** — Celery + Redis for async task processing

## Tech Stack

### Backend
- **Django 5.x** with Django REST Framework
- **PostgreSQL** with Row-Level Security (RLS)
- **Redis** for caching and Celery broker
- **Celery** for background task processing
- **JWT** for authentication
- **AWS S3** for file storage
- **AWS SES** for email delivery

### Frontend
- **SvelteKit 2.x** with Svelte 5 (runes)
- **TailwindCSS 4** for styling
- **shadcn-svelte** UI components
- **Zod** for schema validation
- **Axios** for API communication
- **Lucide** icons

### AI Component (nanobot)
- **Ultra-lightweight AI framework** — ~4,000 lines of code, Python-native
- **Native React + TypeScript WebUI** — embedded via iframe, no rebuild needed
- **Multi-LLM support** — OpenAI, Anthropic, Google, vLLM, etc.
- **Voice transcription** — clipboard + microphone permissions delegated to the iframe
- **Multi-channel gateways** — Telegram, Discord, WhatsApp, Feishu

## Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL 14+
- Redis

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/zyjwjck/openCRM.git
cd openCRM
```

#### 2. Backend Setup
```bash
# Create and activate virtual environment
cd backend
python -m venv .openCRM-venv
# On Windows:
.openCRM-venv\Scripts\activate.bat
# On macOS/Linux:
source .openCRM-venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database and other settings

# Run migrations
python manage.py migrate

# Create a superuser
python manage.py createsuperuser

# Start the development server
python manage.py runserver
```

#### 3. Frontend Setup
```bash
# In a new terminal, from the project root
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

#### 4. AI Agent Setup (nanobot)

nanobot ships as a source bundle under `Agent/nanobot-main/` and is embedded into the CRM via iframe at `/agent`.

Run from an activated virtual environment (you can reuse the backend `.openCRM-venv` if it meets Python 3.11+):

```bash
# In a new terminal, from the project root
cd Agent/nanobot-main

# Install nanobot from source (bun or npm required the first time to build WebUI)
python -m pip install -e .

# Initialise config & workspace (interactive onboarding)
nanobot onboard
```

Launch the nanobot **Gateway** (serves WebUI + websocket channels + automations on `http://127.0.0.1:8765`):

```bash
# Recommended for development: opens the browser and keeps channels alive
nanobot webui

# Or: gateway-only mode (no automatic browser open)
nanobot gateway

# Background / daemon variants
nanobot webui --background
nanobot gateway --background

# Control the background gateway
nanobot gateway status
nanobot gateway logs
nanobot gateway restart
nanobot gateway stop
```

**Inside the CRM**: sidebar → AI → Agent (or visit `/agent` directly). Model / Provider / MCP configuration happens inside nanobot's own **Settings** panel.

### Access the Application
- **Frontend**: http://localhost:5173
- **AI Agent**: http://localhost:5173/agent  (embedded nanobot WebUI via iframe)
- **API Documentation**: http://localhost:8000/swagger-ui/
- **Admin Panel**: http://localhost:8000/admin/
- **nanobot WebUI (direct access)**: http://127.0.0.1:8765
- **nanobot OpenAI-compatible API**: http://127.0.0.1:8765/v1/...

## AI Agent Configuration

nanobot's default config and workspace live under `~/.nanobot/`. Override with `NANOBOT_HOME` and `NANOBOT_WORKSPACE` environment variables, or point them to `Agent/nanobot-main/.nanobot/` for a self-contained setup.

Create or edit `config.json` inside the nanobot home directory:

```json
{
  "providers": {
    "openrouter": {
      "apiKey": "sk-or-v1-xxx"
    }
  },
  "agents": {
    "defaults": {
      "model": "anthropic/claude-opus-4-5"
    }
  }
}
```

Or configure **everything graphically** inside the nanobot WebUI → **Settings → Models**.

Full docs at [nanobot.wiki](https://nanobot.wiki/docs/latest/getting-started/nanobot-overview).

## Project Structure

```
openCRM/
├── backend/                 # Django REST API
│   ├── accounts/           # Accounts module
│   ├── cases/              # Cases module
│   ├── common/             # Shared models, utilities, RLS
│   ├── contacts/           # Contacts module
│   ├── invoices/           # Invoices module
│   ├── leads/              # Leads module
│   ├── opportunity/        # Opportunities module
│   ├── tasks/              # Tasks module
│   └── crm/                # Django project settings
├── frontend/               # SvelteKit frontend
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/
│   │   │   │   ├── dashboard/   # Dashboard widgets (i18n reactive)
│   │   │   │   └── layout/      # AppSidebar, etc.
│   │   │   └── utils/i18n.js    # Translation dictionaries + helpers
│   │   └── routes/
│   │       ├── (app)/agent/     # /agent — iframe wrapper for nanobot WebUI
│   │       ├── (app)/           # Other authenticated CRM pages
│   │       └── (no-layout)/     # Auth pages (login, etc.)
│   └── static/            # Static assets
├── Agent/                  # nanobot AI agent (source bundle)
│   └── nanobot-main/       # nanobot source tree (Python package + built-in WebUI)
│       ├── docs/           # nanobot upstream documentation
│       ├── nanobot/        # agent runtime, gateway, channels, memory, MCP
│       ├── skills/         # bundled skills: weather, cron, memory, github…
│       └── channels/       # Telegram, Discord, Feishu, WeChat, Email…
└── docker/                 # Docker configuration
```

## Reference Projects

openCRM is built upon two open-source foundations, enhancing them with AI agent capabilities:

- [Bottle-CRM](https://github.com/MicroPyramid/Django-CRM.git) — a robust CRM platform providing the multi-tenant architecture and Django REST API foundation
- [nanobot](https://github.com/HKUDS/nanobot) — an ultra-lightweight personal AI assistant framework, which provides all of openCRM's AI agent capabilities

## Multi-Tenancy & Security

openCRM uses PostgreSQL Row-Level Security (RLS) to ensure complete data isolation between organizations. Every database query is automatically filtered by organization context.

```bash
python manage.py manage_rls --status      # Check RLS status
python manage.py manage_rls --verify-user # Verify RLS user configuration
python manage.py manage_rls --test        # Test data isolation
```

## Development

### Backend Commands
```bash
cd backend
pytest                    # Run tests
black . && isort .         # Format code
pipdeptree                # Check dependency tree
pip-check -H              # Check for outdated deps
```

### Frontend Commands
```bash
cd frontend
npm run check             # Type checking
npm run lint              # Linting
npm run format            # Formatting
```

### AI Agent Commands
```bash
cd Agent/nanobot-main
nanobot webui             # Launch gateway + WebUI
nanobot gateway           # Gateway only (no browser open)
nanobot onboard           # First-time interactive setup
nanobot models list       # View model configuration
```

## API Documentation

The API follows RESTful conventions:

```
GET/POST       /api/<module>/                 # List / Create
GET/PUT/DELETE /api/<module>/<pk>/            # Detail / Update / Delete
GET/POST       /api/<module>/comment/<pk>/    # Comments
GET/POST       /api/<module>/attachment/<pk>/ # Attachments
```

Interactive API docs at `/swagger-ui/` when running the backend.

## Language Switch

- [English README](README.md)
- [中文 README](README_zh.md)

## Contributing

We welcome contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Community

- **openCRM Issues**: [GitHub Issues](https://github.com/zyjwjck/openCRM/issues)
- **Original CRM Project Issues**: [Django-CRM Issues](https://github.com/MicroPyramid/Django-CRM/issues)
- **AI Agent Issues**: [nanobot Issues](https://github.com/HKUDS/nanobot/issues)

## License

MIT License — see [LICENSE](LICENSE) file for details.

## Acknowledgements

- **Django-CRM** by [MicroPyramid](https://github.com/MicroPyramid/Django-CRM.git) — CRM platform foundation
- **nanobot** by [HKUDS](https://github.com/HKUDS/nanobot) — AI agent framework

## Contributors

- **zyjwjck** — Project creator and lead developer

## Future Roadmap

- [ ] Enhanced AI-driven lead qualification
- [ ] Predictive sales forecasting
- [ ] Intelligent customer segmentation
- [ ] Automated customer support workflows
- [ ] Voice-enabled CRM interactions
- [ ] Multi-language AI capabilities
- [ ] Advanced analytics dashboard
- [ ] Integration with more business tools

---

<p align="center">
  <em>openCRM: AI-Agent-Driven Customer Relationship Management</em>
</p>
