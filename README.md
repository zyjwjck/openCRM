# openCRM

A modern, AI-powered CRM platform built with Agent, by Django REST Framework and SvelteKit, enhanced with intelligent agents for future-ready customer relationship management.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.12+-green.svg)
![Django](https://img.shields.io/badge/django-5.x-green.svg)
![SvelteKit](https://img.shields.io/badge/sveltekit-2.x-orange.svg)
![Svelte](https://img.shields.io/badge/svelte-5-orange.svg)
![AI](https://img.shields.io/badge/AI-powered-blueviolet.svg)

## Overview

openCRM is a full-featured Customer Relationship Management system designed for startups and small businesses, enhanced with cutting-edge AI capabilities. It combines a powerful Django REST API backend with a modern SvelteKit frontend, featuring multi-tenant architecture with PostgreSQL Row-Level Security (RLS) for enterprise-grade data isolation, and integrates intelligent AI agents for automated workflows and enhanced decision-making.

This project is built upon two open-source foundations:
- [Bottle-CRM](https://github.com/MicroPyramid/Django-CRM.git) - A robust CRM platform
- [nanobot](https://github.com/HKUDS/nanobot) - An ultra-lightweight personal AI assistant

## Features

### Core CRM Modules
- **Leads** - Track and manage sales leads through your pipeline
- **Accounts** - Manage company/organization records
- **Contacts** - Store and organize contact information
- **Opportunities** - Track deals and sales opportunities
- **Cases** - Customer support case management
- **Tasks** - Task management with calendar and Kanban board views
- **Invoices** - Create and manage invoices

### AI-Powered Features
- **Intelligent Lead Scoring** - AI-driven lead qualification and prioritization
- **Automated Follow-up** - Smart reminders and personalized outreach suggestions
- **Predictive Analytics** - Forecasting and trend analysis for sales and customer behavior
- **Natural Language Processing** - Conversational interfaces for data entry and retrieval
- **Smart Document Processing** - Automated extraction of information from documents
- **24/7 Market Analysis** - Real-time insights to inform sales and marketing strategies

### Platform Features
- **Multi-Tenant Architecture** - PostgreSQL RLS for secure data isolation between organizations
- **JWT Authentication** - Secure token-based authentication
- **Team Management** - Organize users into teams with role-based access
- **Activity Tracking** - Comprehensive audit logs and activity history
- **Comments & Attachments** - Collaborate with comments and file attachments on any record
- **Tags** - Flexible tagging system for organizing records
- **Email Integration** - AWS SES integration for transactional emails
- **Background Tasks** - Celery + Redis for async task processing

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

### AI Components
- **nanobot** - Ultra-lightweight AI agent framework (~4,000 lines of code)
- **Multi-LLM Support** - Integration with various LLM providers (OpenAI, Anthropic, Google, etc.)
- **Local LLM Support** - Run models locally with vLLM
- **Voice Transcription** - Integrated voice capabilities
- **Multi-Channel Integration** - Telegram, Discord, WhatsApp, and Feishu

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

#### 4. AI Agent Setup
```bash
# In a new terminal, from the project root
cd agent

# Install dependencies
pip install -e .

# Initialize the agent server
nanobot onboard
```

### Access the Application
- **Frontend**: http://localhost:5173
- **API Documentation**: http://localhost:8000/swagger-ui/
- **Admin Panel**: http://localhost:8000/admin/
- **AI Agent**: http://localhost:3000 (or as configured)

## AI Agent Configuration

The AI agent (based on nanobot) requires API keys for LLM providers. Configure your settings in `agent/.nanobot/config.json`:

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

For more configuration options, refer to the [nanobot documentation](https://github.com/HKUDS/nanobot#configuration).

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
│   │   ├── lib/           # Components, stores, utilities
│   │   └── routes/        # SvelteKit routes
│   │       ├── (app)/     # Authenticated app routes
│   │       └── (no-layout)/ # Auth pages (login, etc.)
│   └── static/            # Static assets
├── agent/                  # AI agent (based on nanobot)
│   ├── agent/              # Core agent logic
│   ├── skills/             # Bundled skills
│   ├── channels/           # Communication channels
│   └── config/             # Configuration
└── docker/                 # Docker configuration
```

## Multi-Tenancy & Security

openCRM uses PostgreSQL Row-Level Security (RLS) to ensure complete data isolation between organizations. Every database query is automatically filtered by organization context, providing enterprise-grade security.

```bash
# Check RLS status
python manage.py manage_rls --status

# Verify RLS user configuration
python manage.py manage_rls --verify-user

# Test data isolation
python manage.py manage_rls --test
```

## Development

### Backend Commands

```bash
# Run tests
cd backend && pytest

# Format code
black . && isort .

# Check dependencies
pipdeptree
pip-check -H
```

### Frontend Commands

```bash
cd frontend

# Type checking
npm run check

# Linting
npm run lint

# Formatting
npm run format
```

### AI Agent Commands

```bash
cd agent

# Start the agent
npm run dev

# Check agent status
nanobot status

# Configure agent
nanobot onboard
```

## API Documentation

The API follows RESTful conventions:

```
GET/POST       /api/<module>/                 # List/Create
GET/PUT/DELETE /api/<module>/<pk>/            # Detail/Update/Delete
GET/POST       /api/<module>/comment/<pk>/    # Comments
GET/POST       /api/<module>/attachment/<pk>/ # Attachments
```

Interactive API documentation is available at `/swagger-ui/` when running the backend.

## Contributing

We welcome contributions! Please see our contributing guidelines for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Community

- **Issues**: [GitHub Issues](https://github.com/zyjwjck/openCRM/issues)
- **Original Project Issues**: [Django-CRM Issues](https://github.com/MicroPyramid/Django-CRM/issues)
- **AI Agent Issues**: [nanobot Issues](https://github.com/HKUDS/nanobot/issues)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

This project is built upon the following open-source projects:

- **Django-CRM** by [MicroPyramid](https://github.com/MicroPyramid/Django-CRM.git)
- **nanobot** by [HKUDS](https://github.com/HKUDS/nanobot)

We are grateful to all the contributors of these projects for their valuable work.

## Contributors

This project exists thanks to all the people who contributed.

![Contributors](https://opencollective.com/django-crm/contributors.svg?width=890&button=false)

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
  <em>openCRM: The Future of Customer Relationship Management</em>
</p>