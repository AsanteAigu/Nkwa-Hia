# Nkwa Hia — Setup Guide (PostgreSQL Edition)

## Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ running locally

---

## 1. Create the PostgreSQL database

```bash
psql -U postgres -c "CREATE DATABASE nkwahia;"
```

---

## 2. Backend setup

```bash
cd backend

# Create virtualenv
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Start the server (tables are auto-created + seeded on first run)
python main.py
```

The backend will:
1. Connect to `postgresql+asyncpg://postgres:postgres@localhost:5432/nkwahia`
2. Create all tables automatically
3. Seed 59 hospitals, 9 EMT users, hospital staff/admins, and inventory

---

## 3. Start the frontends

Open **3 terminals**:

```bash
# Terminal 1 — Public Portal  (http://localhost:5173)
cd frontend/public_portal && npm install && npm run dev

# Terminal 2 — Hospital Portal  (http://localhost:5174)
cd frontend/hospital_portal && npm install && npm run dev

# Terminal 3 — EMT Portal  (http://localhost:5175)
cd frontend/emt_portal && npm install && npm run dev
```

---

## Default Credentials

### Hospital Portal
| Role | Email / ID | Password |
|------|-----------|----------|
| Admin | `admin.<hospid>@nkwahia.gh` | `Admin@2026` |
| Manager | `mgr.<hospid>@nkwahia.gh` | `Manager@2026` |
| Staff | `STF-XXXX-XXX-001` | `Staff@2026` |

> Example for 37 Military Hospital (`id = 37_military_hospital_3`):
> - Admin: `admin.37_militar@nkwahia.gh` / `Admin@2026`
> - Staff (ICU): `STF-37MI-ICU-001` / `Staff@2026`

### EMT Portal
| ID | Password | Role |
|----|----------|------|
| PMD-AAR-001 | Medic@01 | Paramedic |
| DRV-AAR-001 | Drive@01 | Driver |

> Hospital access keys are auto-generated. See `/docs` (Swagger) for the `GET /api/v1/auth/hospitals/list` endpoint.

---

## How bed reservation works

1. User submits triage form on public portal
2. AI (Claude/Gemini) analyses and recommends top hospitals
3. User clicks **"Start Journey to [Hospital]"**
4. Backend finds first vacant bed in the appropriate ward, marks it `reserved`
5. Hospital portal staff see the bed as reserved (purple)
6. When patient arrives, staff click "Discharge" → bed moves `reserved → occupied`
7. Hospital capacity colour (GREEN/YELLOW/RED) updates immediately

---

## Database URL

Default: `postgresql+asyncpg://postgres:postgres@localhost:5432/nkwahia`

Change in `backend/.env`:
```
DATABASE_URL=postgresql+asyncpg://USER:PASS@HOST:PORT/DBNAME
```
