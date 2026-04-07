# Zorvyn Finance API

A production-grade **Finance Data Processing and Access Control Backend** built with Django REST Framework. Features JWT authentication, role-based access control (RBAC), financial record management, and aggregated dashboard analytics.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend Framework | Django 5.x + Django REST Framework |
| Auth | JWT via `djangorestframework-simplejwt` |
| Database | PostgreSQL (SQLite supported for dev) |
| API Docs | OpenAPI 3.0 via `drf-spectacular` (Swagger + Redoc) |
| Filtering | `django-filter` |
| Rate Limiting | `django-ratelimit` |
| Frontend | React (Vite) + Tailwind CSS |
| Containerization | Docker + Docker Compose |

---

## Project Structure

```
zorvyn/
├── apps/
│   ├── users/        # Auth, JWT, user & role management
│   ├── finance/      # Financial records CRUD + filtering
│   └── analytics/    # Dashboard summary + trends
├── core/             # Shared: permissions, middleware, handlers, mixins
├── config/           # Django settings, root URL config
├── frontend/         # React + Vite frontend
└── docker-compose.yml
```

---

## Local Setup (Without Docker)

### Prerequisites
- Python 3.11+
- PostgreSQL running locally

### Steps

```bash
# 1. Clone and enter project
git clone <repo-url>
cd zorvyn

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure environment
cp .env.example .env    # Edit DB credentials, SECRET_KEY

# 5. Run migrations
python manage.py migrate

# 6. Create a superuser (gets ADMIN role)
python manage.py createsuperuser

# 7. Seed demo data
python manage.py seed_data

# 8. Start server
python manage.py runserver
```

---

## 🎭 Demo Accounts

Run `python manage.py seed_data` to create three pre-built demo users with realistic financial records. The login page displays these accounts as **clickable cards** — reviewers can click any card to auto-fill credentials and sign in instantly.

| Role | Username | Password | Capabilities |
|---|---|---|---|
| **Admin** | `admin_demo` | `Admin@1234` | Full access: users, records, analytics |
| **Analyst** | `analyst_demo` | `Analyst@1234` | Create/edit records, view analytics |
| **Viewer** | `viewer_demo` | `Viewer@1234` | Read-only: dashboard & records |

The command is **idempotent** — safe to run multiple times without creating duplicates.

### Frontend Setup

```bash
cd frontend
npm install
npm run dev    # Starts at http://localhost:5173
```

---

## Docker Setup

```bash
# Build and start all services (backend + db)
docker-compose up --build

# Run migrations inside container
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

---

## API Reference

### Base URL: `http://localhost:8000`

### Authentication
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/users/register/` | Register new user (defaults to VIEWER) | No |
| POST | `/api/users/login/` | Obtain JWT access + refresh tokens | No |
| POST | `/api/users/refresh/` | Refresh access token | No |
| POST | `/api/users/logout/` | Blacklist refresh token | Yes |

### User Management (Admin only)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users/` | List all users |
| PATCH | `/api/users/<id>/role/` | Update a user's role |
| PATCH | `/api/users/<id>/status/` | Activate or deactivate a user |

### Financial Records
| Method | Endpoint | Description | Min Role |
|---|---|---|---|
| GET | `/api/finance/records/` | List all shared records (paginated) | VIEWER |
| POST | `/api/finance/records/` | Create a record | ANALYST |
| GET | `/api/finance/records/<id>/` | Retrieve a record | VIEWER |
| PUT/PATCH | `/api/finance/records/<id>/` | Update a record | ANALYST |
| DELETE | `/api/finance/records/<id>/` | Delete a record | ANALYST |

**Query Parameters for `/api/finance/records/`:**
- `record_type=INCOME|EXPENSE`
- `category=<string>`
- `currency=<string>`
- `start_date=YYYY-MM-DD` / `end_date=YYYY-MM-DD`
- `min_amount=<number>` / `max_amount=<number>`
- `search=<string>` (searches description + category)
- `ordering=date|amount|created_at` (prefix `-` for descending)

### Analytics
| Method | Endpoint | Description | Min Role |
|---|---|---|---|
| GET | `/api/analytics/dashboard/summary/` | Total income/expenses, net balance, category breakdown, monthly & weekly trends | VIEWER |
| GET | `/api/analytics/dashboard/recent-activity/` | Last 10 records from shared ledger | VIEWER |

---

## Role Model

This system uses a **shared ledger model** — all users see the same financial records. The `user` field on each record is an audit trail (who entered it), not an ownership filter.

| Role | View Records | Create/Update/Delete Records | Manage Users |
|---|---|---|---|
| **VIEWER** | ✅ All shared records | ❌ | ❌ |
| **ANALYST** | ✅ All shared records | ✅ | ❌ |
| **ADMIN** | ✅ All shared records | ✅ | ✅ |

> All new registrations default to the **VIEWER** role. Only Admins can promote users.

---

## API Documentation (Interactive)

With the server running:
- **Swagger UI:** http://localhost:8000/api/v1/schema/swagger-ui/
- **Redoc:** http://localhost:8000/api/v1/schema/redoc/

---

## Running Tests

```bash
source venv/bin/activate
python manage.py test users finance analytics --verbosity=2 --settings=config.test_settings
```

---

## Design Decisions & Assumptions

1. **Shared ledger model** — All financial records are visible to every authenticated user. The `user` field on each record is an audit trail (who entered it), not a visibility filter. This matches the internal tool use case where all team members need access to the same financial data. Analysts and Admins can create/edit/delete any record; Viewers can only read.

2. **JWT is stateless; logout blacklists the refresh token** — The access token remains valid until expiry (max 60 min). Clients should discard it locally on logout. The `token_blacklist` app prevents refresh token reuse.

3. **Transaction date is user-supplied** — The `date` field (when the transaction occurred) is distinct from `created_at` (when it was recorded). This allows backdating (e.g., logging last week's expense today). Future dates are rejected by validation.

4. **Role-based filtering is enforced at the view layer** — `get_permissions()` is overridden in `FinancialRecordViewSet` so write actions (create/update/delete) require Analyst+ role while reads require only authentication.

5. **SQLite can be used for testing** — Change `ENGINE` to `django.db.backends.sqlite3` in `.env` for a zero-config dev setup.

6. **Currency stored as ISO 4217 code** — Amounts are stored without conversion. Multi-currency aggregation would require an exchange rate service.
