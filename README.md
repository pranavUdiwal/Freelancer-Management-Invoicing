# Freelancer Management & Invoicing API

A RESTful backend API for freelancers and small agencies to manage clients, projects, tasks, time tracking, and invoice generation — all from one centralized system.

---

## What It Does

This API serves as a **back-office management tool** for independent freelancers or small freelancing teams. Instead of juggling spreadsheets, manual calculations, and scattered notes, freelancers can:

- Store and organize **clients** and **projects**
- Break projects into **tasks** and assign them to team members
- Log **work hours** against tasks (hours auto-calculated from start/end time)
- **Generate invoices** that automatically roll up unbilled hours with tax calculation
- Track invoice lifecycle: `draft → sent → paid / overdue / cancelled`
- View a **business analytics dashboard** for revenue, hours, and client profitability

---

## Key Features

| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Stateless auth with Bearer tokens — no sessions or cookies |
| **Role-Based Access Control** | Three roles (`admin`, `manager`, `freelancer`) with granular permissions |
| **Atomic Invoice Generation** | Uses database transactions with `SELECT FOR UPDATE` row-level locking to prevent double-billing |
| **Auto-Calculated Hours** | Time logs compute hours automatically from start and end timestamps |
| **Invoice Lifecycle** | Full status management with automatic un-billing on cancellation |
| **Overdue Detection** | Flags unpaid invoices past their due date |
| **Analytics Dashboard** | Revenue tracking, billed/unbilled hours, project stats, client profitability |
| **Input Validation** | Every endpoint validated with express-validator |
| **Global Error Handling** | Centralized error handling with `catchAsync` wrapper and custom `AppError` class |

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js + Express | Web framework |
| PostgreSQL (Neon) | Relational database |
| Sequelize ORM | Database queries, migrations, seeders |
| JSON Web Tokens | Authentication |
| bcryptjs | Password hashing |
| express-validator | Request validation |
| Helmet + CORS | Security headers |

---

## Architecture

The project follows a strict **N-Tier Layered Architecture**:

```
Request → Router → Validator → Controller → Service → Repository → Model → Database
```

- **Router** — Route definitions + middleware (auth, RBAC, validation)
- **Validator** — Request body/params validation rules
- **Controller** — Extracts request data, calls service, sends response (thin layer)
- **Service** — All business logic and rules
- **Repository** — Database queries via Sequelize
- **Model** — Table schema definitions with associations

---

## Database Schema

```
Users ──┐
        │
Clients ──► Projects ──► Tasks ──► TimeLogs
                │                      │
                └──► Invoices ◄────────┘
```

**6 Tables:** `users`, `clients`, `projects`, `tasks`, `time_logs`, `invoices`

All tables use **UUID** primary keys and are connected via foreign keys.

---

## API Reference

**Base URL:** `http://localhost:3000/api/v1`

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register a new user |
| POST | `/auth/login` | ❌ | Login and receive JWT token |
| GET | `/auth/me` | ✅ | Get current user profile |
| PATCH | `/auth/update-profile` | ✅ | Update name/email |
| PATCH | `/auth/change-password` | ✅ | Change password |

### Clients
| Method | Endpoint | Auth | Roles |
|--------|----------|------|-------|
| POST | `/clients` | ✅ | admin, manager |
| GET | `/clients` | ✅ | admin, manager |
| GET | `/clients/:id` | ✅ | admin, manager |
| PATCH | `/clients/:id` | ✅ | admin, manager |
| DELETE | `/clients/:id` | ✅ | admin |

### Projects
| Method | Endpoint | Auth | Roles |
|--------|----------|------|-------|
| POST | `/projects` | ✅ | admin, manager |
| GET | `/projects` | ✅ | admin, manager |
| GET | `/projects/:id` | ✅ | admin, manager |
| PATCH | `/projects/:id` | ✅ | admin, manager |
| DELETE | `/projects/:id` | ✅ | admin |

### Tasks
| Method | Endpoint | Auth | Roles |
|--------|----------|------|-------|
| POST | `/tasks` | ✅ | admin, manager |
| GET | `/tasks` | ✅ | All (freelancers see own only) |
| GET | `/tasks/:id` | ✅ | All (freelancers see own only) |
| PATCH | `/tasks/:id` | ✅ | All (freelancers: status/priority only) |
| DELETE | `/tasks/:id` | ✅ | admin |

### Time Logs
| Method | Endpoint | Auth | Roles |
|--------|----------|------|-------|
| POST | `/timelogs` | ✅ | All |
| GET | `/timelogs` | ✅ | All (freelancers see own only) |
| GET | `/timelogs/:id` | ✅ | All |
| PATCH | `/timelogs/:id` | ✅ | All (unbilled only) |
| DELETE | `/timelogs/:id` | ✅ | All (unbilled only) |

### Invoices
| Method | Endpoint | Auth | Roles |
|--------|----------|------|-------|
| POST | `/invoices` | ✅ | admin, manager |
| GET | `/invoices` | ✅ | admin, manager |
| GET | `/invoices/:id` | ✅ | All |
| PATCH | `/invoices/:id/status` | ✅ | admin, manager |
| POST | `/invoices/detect-overdue` | ✅ | admin, manager |

### Analytics
| Method | Endpoint | Auth | Roles |
|--------|----------|------|-------|
| GET | `/analytics/dashboard` | ✅ | admin, manager |

---

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech))

### Installation

```bash
git clone <repository-url>
cd feelancer_management_backend_project
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=development
```

### Database Setup

```bash
npm run db:migrate    # Create all tables
npm run db:seed       # Seed admin user + sample clients
```

### Run the Server

```bash
npm run dev           # Development mode with auto-reload
```

The API will be running at `http://localhost:3000/api/v1/health`

### Seeded Admin Credentials

```
Email:    admin@freelancer.com
Password: admin123
```

---

## Testing with Postman

1. Import `postman/freelancer_api_collection.json` into Postman
2. Login with admin credentials to get a JWT token
3. Set `Authorization: Bearer <token>` header for protected routes
4. Follow this workflow: **Register → Create Client → Create Project → Create Task → Log Time → Generate Invoice → View Analytics**

---

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `npm run dev` | Start dev server with nodemon |
| `npm start` | Start production server |
| `npm run db:migrate` | Run all pending migrations |
| `npm run db:migrate:undo` | Undo all migrations |
| `npm run db:seed` | Run all seeders |
| `npm run db:seed:undo` | Undo all seeders |
| `npm run db:reset` | Drop all → migrate → seed (full reset) |

---

## Project Structure

```
├── server.js                  # Entry point
├── src/
│   ├── app.js                 # Express app + global error handler
│   ├── config/database.js     # Sequelize CLI config
│   ├── models/                # 6 Sequelize models
│   ├── repositories/          # 7 data access classes
│   ├── services/              # 7 business logic classes
│   ├── controllers/           # 7 thin controllers
│   ├── router/                # 7 Express routers
│   ├── middlewares/
│   │   ├── auth.middleware.js  # JWT verification
│   │   ├── role.middleware.js  # Role-based access
│   │   └── validators/        # 6 request validators
│   └── utils/
│       ├── AppError.js        # Custom error class
│       ├── catchAsync.js      # Async error wrapper
│       └── jwt.js             # Token helpers
├── migrations/                # 6 database migrations
├── seeders/                   # 2 database seeders
└── postman/                   # Postman collection
```
