# CoachOps — Complete A-to-Z Implementation Guide
> Coaching Institute Management SaaS with Biometric Attendance
> Stack: React · Redux Toolkit · Node.js · Express · PostgreSQL · Render · Hostinger
> Architecture: Feature-Vertical (Scalable, Solo-Dev Friendly)

---

## TABLE OF CONTENTS

1. [Product Overview](#1-product-overview)
2. [System Architecture](#2-system-architecture)
3. [Feature-Based Directory Structure](#3-feature-based-directory-structure)
4. [Database Schema (Production-Grade)](#4-database-schema-production-grade)
5. [Environment & Tooling Setup](#5-environment--tooling-setup)
6. [Phase 0 — Project Initialization](#phase-0--project-initialization-2-3-days)
7. [Phase 1 — Backend Foundation](#phase-1--backend-foundation-5-7-days)
8. [Phase 2 — Student & Batch Management](#phase-2--student--batch-management-5-7-days)
9. [Phase 3 — Biometric Integration](#phase-3--biometric-integration-5-7-days)
10. [Phase 4 — Attendance Engine](#phase-4--attendance-engine-3-4-days)
11. [Phase 5 — Frontend Foundation](#phase-5--frontend-foundation-5-7-days)
12. [Phase 6 — Admin Dashboard UI](#phase-6--admin-dashboard-ui-5-7-days)
13. [Phase 7 — Teacher & Parent Portals](#phase-7--teacher--parent-portals-4-5-days)
14. [Phase 8 — Communication Layer](#phase-8--communication-layer-4-5-days)
15. [Phase 9 — Analytics & AI Reports](#phase-9--analytics--ai-reports-5-7-days)
16. [Phase 10 — Production Hardening](#phase-10--production-hardening-4-5-days)
17. [Deployment Guide](#17-deployment-guide)
18. [PostgreSQL Hosting Options & Cost](#18-postgresql-hosting-options--cost)
19. [Client Pricing Strategy](#19-client-pricing-strategy)
20. [Complexity & Timeline Analysis](#20-complexity--timeline-analysis)
21. [Integration Checklist](#21-integration-checklist)

---

## 1. PRODUCT OVERVIEW

### Vision
"Run your entire coaching institute from one dashboard — attendance via fingerprint, performance tracking, parent communication, and insights. Zero Excel, zero WhatsApp chaos."

### User Roles
| Role | Portal | Primary Actions |
|---|---|---|
| Super Admin | Web (Admin App) | Manage institute, teachers, students, settings |
| Institute Owner | Web (Admin App) | View analytics, configure batches, billing |
| Teacher | Web (Teacher App) | View attendance, enter marks, view student list |
| Parent | Mobile-responsive Web | View child's attendance, reports, notifications |
| Student | Mobile-responsive Web (V2) | View own performance |

### Core Modules
1. **Auth & Multi-Tenancy** — JWT auth, institute isolation
2. **Institute Management** — Owner onboarding, settings
3. **Batch Management** — Subjects, schedules, teacher assignment
4. **Student Management** — Enrollment, profile, parent linking
5. **Biometric Sync** — Local sync service + cloud attendance
6. **Attendance Engine** — Auto-mark, patterns, reports
7. **Test & Marks** — Enter scores, compare batches
8. **Communication** — WhatsApp + Email automations
9. **Analytics** — Performance trends, weak student detection
10. **Notifications** — In-app + push alerts

---

## 2. SYSTEM ARCHITECTURE

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                  │
│  Admin Web App    Teacher Web App    Parent Web App              │
│  (React + Redux)  (React + Redux)   (React + Redux)              │
└──────────────────┬───────────────────────────────────────────────┘
                   │  HTTPS REST API
┌──────────────────▼───────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)                   │
│  Feature Routers → Controllers → Services → DB Layer            │
│                                                                  │
│  Middleware: Auth · Rate Limit · Logger · Error Handler          │
└──────┬───────────────────────┬────────────────────┬─────────────┘
       │                       │                    │
┌──────▼──────┐  ┌─────────────▼────────┐  ┌───────▼───────────┐
│  PostgreSQL │  │  External Services   │  │  Biometric Sync   │
│  (Render /  │  │  - WhatsApp (Twilio) │  │  Service (Local   │
│   Neon)     │  │  - Email (SMTP)      │  │  Node.js Agent)   │
│             │  │  - OpenAI API        │  │  ↕ TCP/IP to      │
└─────────────┘  └──────────────────────┘  │  BioMax Device    │
                                           └───────────────────┘
```

### Multi-Tenancy Strategy
- Every table that holds business data has an `institute_id` foreign key.
- All queries are scoped by `institute_id` derived from the JWT.
- No institute can access another institute's data.

### API Design Conventions
- Base URL: `/api/v1`
- Auth header: `Authorization: Bearer <token>`
- Response envelope:
```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "meta": { "page": 1, "total": 100 }
}
```
- Error envelope:
```json
{
  "success": false,
  "error": { "code": "VALIDATION_ERROR", "message": "..." }
}
```

---

## 3. FEATURE-BASED DIRECTORY STRUCTURE

### Backend (`/server`)

```
server/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.middleware.js
│   │   │   └── auth.validator.js
│   │   │
│   │   ├── institutes/
│   │   │   ├── institutes.routes.js
│   │   │   ├── institutes.controller.js
│   │   │   ├── institutes.service.js
│   │   │   └── institutes.validator.js
│   │   │
│   │   ├── users/
│   │   │   ├── users.routes.js
│   │   │   ├── users.controller.js
│   │   │   ├── users.service.js
│   │   │   └── users.validator.js
│   │   │
│   │   ├── batches/
│   │   │   ├── batches.routes.js
│   │   │   ├── batches.controller.js
│   │   │   ├── batches.service.js
│   │   │   └── batches.validator.js
│   │   │
│   │   ├── students/
│   │   │   ├── students.routes.js
│   │   │   ├── students.controller.js
│   │   │   ├── students.service.js
│   │   │   └── students.validator.js
│   │   │
│   │   ├── attendance/
│   │   │   ├── attendance.routes.js
│   │   │   ├── attendance.controller.js
│   │   │   ├── attendance.service.js
│   │   │   └── attendance.validator.js
│   │   │
│   │   ├── biometric/
│   │   │   ├── biometric.routes.js
│   │   │   ├── biometric.controller.js
│   │   │   ├── biometric.service.js
│   │   │   └── biometric.validator.js
│   │   │
│   │   ├── tests/
│   │   │   ├── tests.routes.js
│   │   │   ├── tests.controller.js
│   │   │   ├── tests.service.js
│   │   │   └── tests.validator.js
│   │   │
│   │   ├── notifications/
│   │   │   ├── notifications.routes.js
│   │   │   ├── notifications.controller.js
│   │   │   ├── notifications.service.js
│   │   │   └── notifications.jobs.js
│   │   │
│   │   ├── reports/
│   │   │   ├── reports.routes.js
│   │   │   ├── reports.controller.js
│   │   │   └── reports.service.js
│   │   │
│   │   └── analytics/
│   │       ├── analytics.routes.js
│   │       ├── analytics.controller.js
│   │       └── analytics.service.js
│   │
│   ├── shared/
│   │   ├── db/
│   │   │   ├── pool.js              ← pg Pool instance
│   │   │   ├── migrate.js           ← Run migrations
│   │   │   └── migrations/
│   │   │       ├── 001_initial.sql
│   │   │       ├── 002_batches.sql
│   │   │       └── ...
│   │   │
│   │   ├── middleware/
│   │   │   ├── errorHandler.js
│   │   │   ├── rateLimiter.js
│   │   │   ├── requestLogger.js
│   │   │   └── validate.js          ← Zod/Joi validator wrapper
│   │   │
│   │   ├── utils/
│   │   │   ├── jwt.js
│   │   │   ├── bcrypt.js
│   │   │   ├── response.js          ← Standard response helpers
│   │   │   ├── pagination.js
│   │   │   ├── date.js
│   │   │   └── logger.js            ← Winston logger
│   │   │
│   │   └── config/
│   │       ├── env.js               ← Typed env config
│   │       └── constants.js
│   │
│   ├── app.js                       ← Express app setup
│   └── server.js                    ← Entry point
│
├── biometric-sync/                  ← LOCAL service (NOT deployed to Render)
│   ├── index.js
│   ├── deviceService.js
│   ├── apiClient.js
│   ├── config.js
│   └── package.json
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

### Frontend (`/client`)

```
client/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   ├── authSlice.js         ← Redux slice
│   │   │   ├── authApi.js           ← RTK Query endpoints
│   │   │   └── authGuard.jsx        ← Route protection HOC
│   │   │
│   │   ├── dashboard/
│   │   │   ├── components/
│   │   │   │   ├── StatCard.jsx
│   │   │   │   ├── AttendanceChart.jsx
│   │   │   │   └── WeakStudentAlert.jsx
│   │   │   ├── pages/
│   │   │   │   └── DashboardPage.jsx
│   │   │   └── dashboardApi.js
│   │   │
│   │   ├── students/
│   │   │   ├── components/
│   │   │   │   ├── StudentTable.jsx
│   │   │   │   ├── StudentForm.jsx
│   │   │   │   └── StudentCard.jsx
│   │   │   ├── pages/
│   │   │   │   ├── StudentsPage.jsx
│   │   │   │   └── StudentDetailPage.jsx
│   │   │   └── studentsApi.js
│   │   │
│   │   ├── batches/
│   │   │   ├── components/
│   │   │   │   ├── BatchCard.jsx
│   │   │   │   └── BatchForm.jsx
│   │   │   ├── pages/
│   │   │   │   ├── BatchesPage.jsx
│   │   │   │   └── BatchDetailPage.jsx
│   │   │   └── batchesApi.js
│   │   │
│   │   ├── attendance/
│   │   │   ├── components/
│   │   │   │   ├── AttendanceCalendar.jsx
│   │   │   │   └── AttendanceSummary.jsx
│   │   │   ├── pages/
│   │   │   │   └── AttendancePage.jsx
│   │   │   └── attendanceApi.js
│   │   │
│   │   ├── tests/
│   │   │   ├── components/
│   │   │   │   ├── TestForm.jsx
│   │   │   │   └── MarksTable.jsx
│   │   │   ├── pages/
│   │   │   │   └── TestsPage.jsx
│   │   │   └── testsApi.js
│   │   │
│   │   ├── reports/
│   │   │   ├── components/
│   │   │   │   └── ReportViewer.jsx
│   │   │   ├── pages/
│   │   │   │   └── ReportsPage.jsx
│   │   │   └── reportsApi.js
│   │   │
│   │   ├── notifications/
│   │   │   ├── components/
│   │   │   │   └── NotificationPanel.jsx
│   │   │   └── notificationsApi.js
│   │   │
│   │   └── settings/
│   │       ├── components/
│   │       │   ├── ProfileSettings.jsx
│   │       │   └── InstituteSettings.jsx
│   │       └── pages/
│   │           └── SettingsPage.jsx
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Table.jsx
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Spinner.jsx
│   │   │   │   ├── Tooltip.jsx
│   │   │   │   └── EmptyState.jsx
│   │   │   ├── layout/
│   │   │   │   ├── AdminLayout.jsx
│   │   │   │   ├── TeacherLayout.jsx
│   │   │   │   ├── ParentLayout.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Topbar.jsx
│   │   │   │   └── PageHeader.jsx
│   │   │   └── charts/
│   │   │       ├── LineChart.jsx    ← Recharts wrapper
│   │   │       ├── BarChart.jsx
│   │   │       └── DonutChart.jsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── useAuth.js
│   │   │   ├── useDebounce.js
│   │   │   └── usePagination.js
│   │   │
│   │   ├── store/
│   │   │   ├── store.js             ← RTK configureStore
│   │   │   └── baseApi.js           ← RTK Query base
│   │   │
│   │   ├── utils/
│   │   │   ├── formatters.js
│   │   │   └── validators.js
│   │   │
│   │   └── constants/
│   │       └── roles.js
│   │
│   ├── apps/
│   │   ├── admin/
│   │   │   ├── routes.jsx           ← Admin-specific route config
│   │   │   └── AdminApp.jsx
│   │   ├── teacher/
│   │   │   ├── routes.jsx
│   │   │   └── TeacherApp.jsx
│   │   └── parent/
│   │       ├── routes.jsx
│   │       └── ParentApp.jsx
│   │
│   ├── App.jsx                      ← Root router (role-based redirect)
│   ├── main.jsx
│   └── index.css
│
├── public/
├── .env
├── .env.example
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 4. DATABASE SCHEMA (PRODUCTION-GRADE)

Run migrations in order. Each migration is a separate SQL file.

### Migration 001 — Core Users & Institutes

```sql
-- migrations/001_core.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
-- INSTITUTES (Tenant root)
-- ─────────────────────────────────────────
CREATE TABLE institutes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT NOT NULL,
    address     TEXT,
    phone       TEXT,
    email       TEXT,
    logo_url    TEXT,
    plan        TEXT NOT NULL DEFAULT 'starter', -- starter | pro | enterprise
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- USERS (All roles in one table)
-- ─────────────────────────────────────────
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID REFERENCES institutes(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    email           TEXT UNIQUE NOT NULL,
    phone           TEXT,
    password_hash   TEXT NOT NULL,
    role            TEXT NOT NULL CHECK (role IN ('super_admin','owner','teacher','parent','student')),
    avatar_url      TEXT,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    last_login_at   TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_institute ON users(institute_id);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- ─────────────────────────────────────────
-- REFRESH TOKENS
-- ─────────────────────────────────────────
CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       TEXT NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
```

### Migration 002 — Batches & Students

```sql
-- migrations/002_batches_students.sql

-- ─────────────────────────────────────────
-- SUBJECTS
-- ─────────────────────────────────────────
CREATE TABLE subjects (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- BATCHES
-- ─────────────────────────────────────────
CREATE TABLE batches (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,               -- e.g. "JEE 2026 Morning"
    subject_id      UUID REFERENCES subjects(id),
    teacher_id      UUID REFERENCES users(id),
    schedule        JSONB,                        -- { days: ["Mon","Wed"], time: "09:00" }
    room            TEXT,
    max_strength    INT DEFAULT 60,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_batches_institute ON batches(institute_id);
CREATE INDEX idx_batches_teacher ON batches(teacher_id);

-- ─────────────────────────────────────────
-- STUDENTS
-- ─────────────────────────────────────────
CREATE TABLE students (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),   -- linked login (optional)
    name            TEXT NOT NULL,
    dob             DATE,
    gender          TEXT CHECK (gender IN ('male','female','other')),
    phone           TEXT,
    email           TEXT,
    address         TEXT,
    enrollment_no   TEXT,
    enrolled_at     DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_students_institute ON students(institute_id);

-- ─────────────────────────────────────────
-- PARENTS
-- ─────────────────────────────────────────
CREATE TABLE parents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),
    name            TEXT NOT NULL,
    phone           TEXT NOT NULL,
    email           TEXT,
    relation        TEXT DEFAULT 'parent',       -- parent | guardian
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- STUDENT <-> PARENT (Many-to-Many)
-- ─────────────────────────────────────────
CREATE TABLE student_parents (
    student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    parent_id       UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    is_primary      BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (student_id, parent_id)
);

-- ─────────────────────────────────────────
-- STUDENT <-> BATCH ENROLLMENT
-- ─────────────────────────────────────────
CREATE TABLE batch_enrollments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id        UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    enrolled_at     DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(batch_id, student_id)
);

CREATE INDEX idx_enrollments_batch ON batch_enrollments(batch_id);
CREATE INDEX idx_enrollments_student ON batch_enrollments(student_id);
```

### Migration 003 — Biometric & Attendance

```sql
-- migrations/003_attendance.sql

-- ─────────────────────────────────────────
-- BIOMETRIC DEVICE REGISTRY
-- ─────────────────────────────────────────
CREATE TABLE biometric_devices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    device_name     TEXT NOT NULL,
    device_serial   TEXT UNIQUE,
    location        TEXT,                        -- "Main Gate", "Room 2"
    api_key         TEXT NOT NULL UNIQUE,        -- Secret for sync service auth
    last_sync_at    TIMESTAMPTZ,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- BIOMETRIC MAPPING (Device UID → Student)
-- ─────────────────────────────────────────
CREATE TABLE biometric_mappings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    device_id       UUID NOT NULL REFERENCES biometric_devices(id),
    device_user_id  TEXT NOT NULL,               -- ID stored in fingerprint device
    student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(device_id, device_user_id)
);

CREATE INDEX idx_biometric_map_student ON biometric_mappings(student_id);

-- ─────────────────────────────────────────
-- RAW BIOMETRIC LOGS (Append-only audit log)
-- ─────────────────────────────────────────
CREATE TABLE biometric_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id       UUID NOT NULL REFERENCES biometric_devices(id),
    device_user_id  TEXT NOT NULL,
    raw_timestamp   TIMESTAMPTZ NOT NULL,
    processed       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_biometric_logs_device ON biometric_logs(device_id, processed);

-- ─────────────────────────────────────────
-- ATTENDANCE (Processed, one record per student per day per batch)
-- ─────────────────────────────────────────
CREATE TABLE attendance (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    batch_id        UUID REFERENCES batches(id),
    date            DATE NOT NULL,
    status          TEXT NOT NULL CHECK (status IN ('present','absent','late','excused')),
    source          TEXT NOT NULL DEFAULT 'biometric' CHECK (source IN ('biometric','manual')),
    marked_by       UUID REFERENCES users(id),   -- NULL if biometric
    biometric_log_id UUID REFERENCES biometric_logs(id),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, batch_id, date)           -- Idempotency constraint
);

CREATE INDEX idx_attendance_institute_date ON attendance(institute_id, date);
CREATE INDEX idx_attendance_student ON attendance(student_id);
CREATE INDEX idx_attendance_batch ON attendance(batch_id);
```

### Migration 004 — Tests, Marks, Reports

```sql
-- migrations/004_tests_reports.sql

-- ─────────────────────────────────────────
-- TESTS
-- ─────────────────────────────────────────
CREATE TABLE tests (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    batch_id        UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    subject_id      UUID REFERENCES subjects(id),
    test_date       DATE NOT NULL,
    max_marks       NUMERIC(6,2) NOT NULL DEFAULT 100,
    passing_marks   NUMERIC(6,2),
    type            TEXT DEFAULT 'test' CHECK (type IN ('test','exam','quiz','assignment')),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tests_batch ON tests(batch_id);

-- ─────────────────────────────────────────
-- RESULTS
-- ─────────────────────────────────────────
CREATE TABLE results (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    test_id         UUID NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    marks_obtained  NUMERIC(6,2),
    is_absent       BOOLEAN DEFAULT FALSE,
    remarks         TEXT,
    entered_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(test_id, student_id)
);

CREATE INDEX idx_results_test ON results(test_id);
CREATE INDEX idx_results_student ON results(student_id);

-- ─────────────────────────────────────────
-- GENERATED REPORTS (AI/System generated)
-- ─────────────────────────────────────────
CREATE TABLE reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    student_id      UUID REFERENCES students(id),
    batch_id        UUID REFERENCES batches(id),
    report_type     TEXT NOT NULL CHECK (report_type IN ('monthly','test','attendance','progress')),
    period_start    DATE,
    period_end      DATE,
    content         JSONB,                       -- Structured report data
    summary_text    TEXT,                        -- AI-generated summary
    generated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Migration 005 — Notifications & Audit

```sql
-- migrations/005_notifications.sql

-- ─────────────────────────────────────────
-- NOTIFICATION TEMPLATES
-- ─────────────────────────────────────────
CREATE TABLE notification_templates (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    channel         TEXT NOT NULL CHECK (channel IN ('whatsapp','email','inapp')),
    event_type      TEXT NOT NULL,               -- 'attendance.absent', 'report.monthly', etc.
    template_body   TEXT NOT NULL,               -- Supports {{variables}}
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- NOTIFICATION LOG
-- ─────────────────────────────────────────
CREATE TABLE notification_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    recipient_id    UUID REFERENCES users(id),
    channel         TEXT NOT NULL,
    event_type      TEXT,
    recipient_phone TEXT,
    recipient_email TEXT,
    content         TEXT,
    status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','sent','failed')),
    error_message   TEXT,
    sent_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notif_log_institute ON notification_logs(institute_id);

-- ─────────────────────────────────────────
-- AUDIT LOG
-- ─────────────────────────────────────────
CREATE TABLE audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID REFERENCES institutes(id),
    user_id         UUID REFERENCES users(id),
    action          TEXT NOT NULL,               -- 'student.create', 'marks.update'
    entity_type     TEXT,
    entity_id       UUID,
    old_value       JSONB,
    new_value       JSONB,
    ip_address      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_institute ON audit_logs(institute_id, created_at DESC);
```

---

## 5. ENVIRONMENT & TOOLING SETUP

### Required Tools
```
Node.js v20+
PostgreSQL 15+ (local dev)
Git
VS Code (recommended)
Postman or Bruno (API testing)
```

### VS Code Extensions (Important)
```
ESLint
Prettier
GitLens
REST Client (for .http files)
Thunder Client (lightweight Postman)
```

### Backend `package.json` Dependencies
```json
{
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "express": "^4.18.2",
    "express-rate-limit": "^7.2.0",
    "express-validator": "^7.0.1",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2",
    "morgan": "^1.10.0",
    "pg": "^8.11.3",
    "uuid": "^9.0.0",
    "winston": "^3.11.0",
    "zod": "^3.22.4",
    "node-cron": "^3.0.3",
    "nodemailer": "^6.9.7",
    "axios": "^1.6.7"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
}
```

### Frontend `package.json` Dependencies
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.22.0",
    "@reduxjs/toolkit": "^2.2.0",
    "react-redux": "^9.1.0",
    "recharts": "^2.12.0",
    "react-hook-form": "^7.51.0",
    "@hookform/resolvers": "^3.3.4",
    "zod": "^3.22.4",
    "axios": "^1.6.7",
    "date-fns": "^3.3.1",
    "lucide-react": "^0.363.0",
    "clsx": "^2.1.0",
    "react-hot-toast": "^2.4.1"
  },
  "devDependencies": {
    "vite": "^5.1.6",
    "@vitejs/plugin-react": "^4.2.1",
    "tailwindcss": "^3.4.1",
    "autoprefixer": "^10.4.19",
    "postcss": "^8.4.38"
  }
}
```

---

## PHASE 0 — PROJECT INITIALIZATION (2-3 DAYS)

### Step 0.1 — Create Monorepo Structure
```bash
mkdir coachops
cd coachops
git init
mkdir server client biometric-sync
touch .gitignore README.md

# .gitignore
echo "node_modules/
.env
dist/
build/
*.log" > .gitignore
```

### Step 0.2 — Initialize Backend
```bash
cd server
npm init -y
npm install bcryptjs cors dotenv express express-rate-limit express-validator helmet jsonwebtoken morgan pg uuid winston zod node-cron nodemailer axios
npm install --save-dev nodemon

# Create folder structure
mkdir -p src/features/auth src/features/institutes src/features/users
mkdir -p src/features/batches src/features/students src/features/attendance
mkdir -p src/features/biometric src/features/tests src/features/notifications
mkdir -p src/features/reports src/features/analytics
mkdir -p src/shared/db/migrations src/shared/middleware src/shared/utils src/shared/config
```

### Step 0.3 — Initialize Frontend
```bash
cd client
npm create vite@latest . -- --template react
npm install
npm install react-router-dom @reduxjs/toolkit react-redux recharts react-hook-form @hookform/resolvers zod axios date-fns lucide-react clsx react-hot-toast
npm install --save-dev tailwindcss autoprefixer postcss
npx tailwindcss init -p
```

### Step 0.4 — Setup Local PostgreSQL
```bash
# Create local database
psql -U postgres
CREATE DATABASE coachops_dev;
\q
```

### Step 0.5 — Create Backend `.env`
```env
NODE_ENV=development
PORT=5000

# Database
DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/coachops_dev

# JWT
JWT_SECRET=your-very-long-random-secret-32-chars-min
JWT_REFRESH_SECRET=another-very-long-random-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173

# Email (use Mailtrap for dev)
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_mailtrap_user
SMTP_PASS=your_mailtrap_pass
SMTP_FROM=noreply@coachops.in

# WhatsApp (add in Phase 8)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_FROM=

# AI (add in Phase 9)
OPENAI_API_KEY=

# Biometric Sync (shared secret)
BIOMETRIC_SYNC_SECRET=random-secret-for-sync-service
```

---

## PHASE 1 — BACKEND FOUNDATION (5-7 DAYS)

### Step 1.1 — Shared Utilities

#### `src/shared/db/pool.js`
```javascript
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected DB error:', err);
});

module.exports = pool;
```

#### `src/shared/utils/response.js`
```javascript
const success = (res, data, message = 'Success', status = 200) => {
  return res.status(status).json({ success: true, data, message });
};

const paginated = (res, data, meta) => {
  return res.status(200).json({ success: true, data, meta });
};

const error = (res, message, status = 400, code = 'ERROR') => {
  return res.status(status).json({ success: false, error: { code, message } });
};

module.exports = { success, paginated, error };
```

#### `src/shared/utils/jwt.js`
```javascript
const jwt = require('jsonwebtoken');

const signAccess = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  });

const signRefresh = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  });

const verifyAccess = (token) => jwt.verify(token, process.env.JWT_SECRET);
const verifyRefresh = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh };
```

#### `src/shared/utils/logger.js`
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message }) =>
      `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
  ],
});

module.exports = logger;
```

#### `src/shared/utils/pagination.js`
```javascript
const paginate = (query, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  return { ...query, offset, limit };
};

const paginateMeta = (total, page, limit) => ({
  total: parseInt(total),
  page: parseInt(page),
  limit: parseInt(limit),
  totalPages: Math.ceil(total / limit),
});

module.exports = { paginate, paginateMeta };
```

#### `src/shared/middleware/errorHandler.js`
```javascript
const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(`${req.method} ${req.path} — ${err.message}`);

  if (err.name === 'ZodError') {
    return res.status(422).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: err.errors },
    });
  }

  if (err.code === '23505') { // Postgres unique violation
    return res.status(409).json({
      success: false,
      error: { code: 'DUPLICATE_ENTRY', message: 'Record already exists' },
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: { code: err.code || 'SERVER_ERROR', message: err.message || 'Internal server error' },
  });
};
```

#### `src/shared/middleware/validate.js`
```javascript
// Zod validation middleware factory
const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({ body: req.body, query: req.query, params: req.params });
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = validate;
```

#### `src/shared/middleware/rateLimiter.js`
```javascript
const rateLimit = require('express-rate-limit');

exports.globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests' } },
});

exports.authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many auth attempts' } },
});
```

#### `src/shared/config/env.js`
```javascript
require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 5000,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
  TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
  TWILIO_WHATSAPP_FROM: process.env.TWILIO_WHATSAPP_FROM,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  BIOMETRIC_SYNC_SECRET: process.env.BIOMETRIC_SYNC_SECRET,
};

// Validate required vars
const required = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
required.forEach((key) => {
  if (!env[key]) throw new Error(`Missing required env: ${key}`);
});

module.exports = env;
```

### Step 1.2 — Run Database Migrations

#### `src/shared/db/migrate.js`
```javascript
const fs = require('fs');
const path = require('path');
const pool = require('./pool');

async function migrate() {
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = fs.readdirSync(migrationsDir).sort();

  // Create migrations tracking table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id SERIAL PRIMARY KEY,
      filename TEXT UNIQUE NOT NULL,
      run_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  for (const file of files) {
    const { rows } = await pool.query(
      'SELECT id FROM _migrations WHERE filename = $1', [file]
    );
    if (rows.length > 0) continue;

    console.log(`Running migration: ${file}`);
    const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
    await pool.query(sql);
    await pool.query('INSERT INTO _migrations(filename) VALUES($1)', [file]);
    console.log(`  ✓ Done`);
  }

  console.log('All migrations complete');
  process.exit(0);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
```

Add to `package.json` scripts:
```json
"migrate": "node src/shared/db/migrate.js"
```

Run: `npm run migrate`

### Step 1.3 — Auth Feature (Complete)

#### `src/features/auth/auth.middleware.js`
```javascript
const { verifyAccess } = require('../../shared/utils/jwt');
const { error } = require('../../shared/utils/response');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return error(res, 'No token provided', 401, 'UNAUTHORIZED');
  }

  try {
    const token = authHeader.split(' ')[1];
    req.user = verifyAccess(token);
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401, 'UNAUTHORIZED');
  }
};

// Role-based access control factory
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return error(res, 'Forbidden', 403, 'FORBIDDEN');
  }
  next();
};

// Ensure user belongs to the same institute as param
const sameInstitute = (req, res, next) => {
  if (req.user.role !== 'super_admin' &&
      req.user.institute_id !== req.params.instituteId) {
    return error(res, 'Forbidden', 403, 'FORBIDDEN');
  }
  next();
};

module.exports = { authenticate, authorize, sameInstitute };
```

#### `src/features/auth/auth.validator.js`
```javascript
const { z } = require('zod');

exports.registerSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(8),
    institute_name: z.string().min(2).optional(),
    role: z.enum(['owner', 'teacher', 'parent']).optional(),
  }),
});

exports.loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

exports.refreshSchema = z.object({
  body: z.object({
    refresh_token: z.string(),
  }),
});
```

#### `src/features/auth/auth.service.js`
```javascript
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const pool = require('../../shared/db/pool');
const { signAccess, signRefresh, verifyRefresh } = require('../../shared/utils/jwt');

exports.register = async ({ name, email, password, institute_name }) => {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length) throw { status: 409, message: 'Email already registered', code: 'DUPLICATE_EMAIL' };

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let instituteId = null;
    if (institute_name) {
      const inst = await client.query(
        'INSERT INTO institutes(name) VALUES($1) RETURNING id',
        [institute_name]
      );
      instituteId = inst.rows[0].id;
    }

    const password_hash = await bcrypt.hash(password, 12);
    const userResult = await client.query(
      `INSERT INTO users(institute_id, name, email, password_hash, role)
       VALUES($1,$2,$3,$4,$5) RETURNING id, institute_id, name, email, role`,
      [instituteId, name, email, password_hash, institute_name ? 'owner' : 'teacher']
    );

    await client.query('COMMIT');
    return userResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.login = async ({ email, password }) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND is_active = TRUE',
    [email]
  );
  const user = result.rows[0];
  if (!user) throw { status: 401, message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw { status: 401, message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' };

  const payload = { id: user.id, institute_id: user.institute_id, role: user.role };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await pool.query(
    'INSERT INTO refresh_tokens(user_id, token, expires_at) VALUES($1,$2,$3)',
    [user.id, refreshToken, expiresAt]
  );

  await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, institute_id: user.institute_id },
  };
};

exports.refresh = async ({ refresh_token }) => {
  let payload;
  try {
    payload = verifyRefresh(refresh_token);
  } catch {
    throw { status: 401, message: 'Invalid refresh token', code: 'UNAUTHORIZED' };
  }

  const result = await pool.query(
    'SELECT * FROM refresh_tokens WHERE token = $1 AND expires_at > NOW()',
    [refresh_token]
  );
  if (!result.rows.length) throw { status: 401, message: 'Refresh token expired', code: 'UNAUTHORIZED' };

  const accessToken = signAccess({ id: payload.id, institute_id: payload.institute_id, role: payload.role });
  return { access_token: accessToken };
};

exports.logout = async ({ refresh_token }) => {
  await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refresh_token]);
};
```

#### `src/features/auth/auth.controller.js`
```javascript
const authService = require('./auth.service');
const { success, error } = require('../../shared/utils/response');

exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return success(res, user, 'Registered successfully', 201);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    return success(res, data, 'Login successful');
  } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
  try {
    const data = await authService.refresh(req.body);
    return success(res, data);
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    await authService.logout(req.body);
    return success(res, null, 'Logged out');
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try {
    const pool = require('../../shared/db/pool');
    const result = await pool.query(
      'SELECT id, name, email, role, institute_id, avatar_url FROM users WHERE id = $1',
      [req.user.id]
    );
    return success(res, result.rows[0]);
  } catch (err) { next(err); }
};
```

#### `src/features/auth/auth.routes.js`
```javascript
const router = require('express').Router();
const controller = require('./auth.controller');
const { authenticate } = require('./auth.middleware');
const validate = require('../../shared/middleware/validate');
const { registerSchema, loginSchema, refreshSchema } = require('./auth.validator');
const { authLimiter } = require('../../shared/middleware/rateLimiter');

router.post('/register', authLimiter, validate(registerSchema), controller.register);
router.post('/login', authLimiter, validate(loginSchema), controller.login);
router.post('/refresh', validate(refreshSchema), controller.refresh);
router.post('/logout', controller.logout);
router.get('/me', authenticate, controller.me);

module.exports = router;
```

### Step 1.4 — App & Server Setup

#### `src/app.js`
```javascript
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { globalLimiter } = require('./shared/middleware/rateLimiter');
const errorHandler = require('./shared/middleware/errorHandler');

const app = express();

// Security
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(globalLimiter);

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV !== 'test') app.use(morgan('combined'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Routes
app.use('/api/v1/auth', require('./features/auth/auth.routes'));
app.use('/api/v1/institutes', require('./features/institutes/institutes.routes'));
app.use('/api/v1/users', require('./features/users/users.routes'));
app.use('/api/v1/batches', require('./features/batches/batches.routes'));
app.use('/api/v1/students', require('./features/students/students.routes'));
app.use('/api/v1/attendance', require('./features/attendance/attendance.routes'));
app.use('/api/v1/biometric', require('./features/biometric/biometric.routes'));
app.use('/api/v1/tests', require('./features/tests/tests.routes'));
app.use('/api/v1/notifications', require('./features/notifications/notifications.routes'));
app.use('/api/v1/reports', require('./features/reports/reports.routes'));
app.use('/api/v1/analytics', require('./features/analytics/analytics.routes'));

// 404
app.use((req, res) => res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } }));

// Error handler (must be last)
app.use(errorHandler);

module.exports = app;
```

#### `src/server.js`
```javascript
require('./shared/config/env'); // Validates env vars on startup
const app = require('./app');
const logger = require('./shared/utils/logger');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  logger.info(`CoachOps server running on port ${PORT} [${process.env.NODE_ENV}]`);
});
```

---

## PHASE 2 — STUDENT & BATCH MANAGEMENT (5-7 DAYS)

### Step 2.1 — Institutes Feature

#### `src/features/institutes/institutes.service.js`
```javascript
const pool = require('../../shared/db/pool');

exports.getById = async (id) => {
  const result = await pool.query('SELECT * FROM institutes WHERE id = $1', [id]);
  return result.rows[0];
};

exports.update = async (id, { name, address, phone, email, logo_url }) => {
  const result = await pool.query(
    `UPDATE institutes SET name=$1, address=$2, phone=$3, email=$4, logo_url=$5, updated_at=NOW()
     WHERE id=$6 RETURNING *`,
    [name, address, phone, email, logo_url, id]
  );
  return result.rows[0];
};

exports.getStats = async (instituteId) => {
  const [students, batches, teachers] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM students WHERE institute_id=$1 AND is_active=TRUE', [instituteId]),
    pool.query('SELECT COUNT(*) FROM batches WHERE institute_id=$1 AND is_active=TRUE', [instituteId]),
    pool.query('SELECT COUNT(*) FROM users WHERE institute_id=$1 AND role=$2 AND is_active=TRUE', [instituteId, 'teacher']),
  ]);
  return {
    total_students: parseInt(students.rows[0].count),
    total_batches: parseInt(batches.rows[0].count),
    total_teachers: parseInt(teachers.rows[0].count),
  };
};
```

### Step 2.2 — Batches Feature (Full)

#### `src/features/batches/batches.service.js`
```javascript
const pool = require('../../shared/db/pool');
const { paginateMeta } = require('../../shared/utils/pagination');

exports.create = async (instituteId, data) => {
  const { name, subject_id, teacher_id, schedule, room, max_strength } = data;
  const result = await pool.query(
    `INSERT INTO batches(institute_id,name,subject_id,teacher_id,schedule,room,max_strength)
     VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [instituteId, name, subject_id || null, teacher_id || null,
     schedule ? JSON.stringify(schedule) : null, room, max_strength || 60]
  );
  return result.rows[0];
};

exports.getAll = async (instituteId, { page = 1, limit = 20, search }) => {
  const offset = (page - 1) * limit;
  let query = `
    SELECT b.*, u.name as teacher_name, s.name as subject_name,
           COUNT(be.student_id) FILTER (WHERE be.is_active) as enrolled_count
    FROM batches b
    LEFT JOIN users u ON b.teacher_id = u.id
    LEFT JOIN subjects s ON b.subject_id = s.id
    LEFT JOIN batch_enrollments be ON b.id = be.batch_id
    WHERE b.institute_id = $1 AND b.is_active = TRUE
  `;
  const params = [instituteId];

  if (search) {
    params.push(`%${search}%`);
    query += ` AND b.name ILIKE $${params.length}`;
  }

  query += ` GROUP BY b.id, u.name, s.name ORDER BY b.created_at DESC`;
  const countQuery = query.replace(/SELECT .* FROM/, 'SELECT COUNT(*) FROM').split('GROUP BY')[0];

  const [rows, countResult] = await Promise.all([
    pool.query(query + ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`, [...params, limit, offset]),
    pool.query(`SELECT COUNT(*) FROM batches WHERE institute_id=$1 AND is_active=TRUE`, [instituteId]),
  ]);

  return { data: rows.rows, meta: paginateMeta(countResult.rows[0].count, page, limit) };
};

exports.getById = async (instituteId, id) => {
  const result = await pool.query(
    `SELECT b.*, u.name as teacher_name FROM batches b
     LEFT JOIN users u ON b.teacher_id = u.id
     WHERE b.id = $1 AND b.institute_id = $2`,
    [id, instituteId]
  );
  return result.rows[0];
};

exports.update = async (instituteId, id, data) => {
  const { name, subject_id, teacher_id, schedule, room, max_strength } = data;
  const result = await pool.query(
    `UPDATE batches SET name=$1,subject_id=$2,teacher_id=$3,schedule=$4,room=$5,max_strength=$6,updated_at=NOW()
     WHERE id=$7 AND institute_id=$8 RETURNING *`,
    [name, subject_id, teacher_id, schedule ? JSON.stringify(schedule) : null,
     room, max_strength, id, instituteId]
  );
  return result.rows[0];
};

exports.delete = async (instituteId, id) => {
  await pool.query(
    'UPDATE batches SET is_active=FALSE WHERE id=$1 AND institute_id=$2',
    [id, instituteId]
  );
};

exports.getStudents = async (instituteId, batchId) => {
  const result = await pool.query(
    `SELECT s.*, be.enrolled_at
     FROM students s
     JOIN batch_enrollments be ON s.id = be.student_id
     WHERE be.batch_id = $1 AND s.institute_id = $2 AND be.is_active = TRUE
     ORDER BY s.name`,
    [batchId, instituteId]
  );
  return result.rows;
};
```

#### `src/features/batches/batches.controller.js`
```javascript
const service = require('./batches.service');
const { success, paginated, error } = require('../../shared/utils/response');

exports.create = async (req, res, next) => {
  try {
    const batch = await service.create(req.user.institute_id, req.body);
    return success(res, batch, 'Batch created', 201);
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const { data, meta } = await service.getAll(req.user.institute_id, req.query);
    return paginated(res, data, meta);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const batch = await service.getById(req.user.institute_id, req.params.id);
    if (!batch) return error(res, 'Batch not found', 404, 'NOT_FOUND');
    return success(res, batch);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const batch = await service.update(req.user.institute_id, req.params.id, req.body);
    return success(res, batch);
  } catch (err) { next(err); }
};

exports.delete = async (req, res, next) => {
  try {
    await service.delete(req.user.institute_id, req.params.id);
    return success(res, null, 'Batch deleted');
  } catch (err) { next(err); }
};

exports.getStudents = async (req, res, next) => {
  try {
    const students = await service.getStudents(req.user.institute_id, req.params.id);
    return success(res, students);
  } catch (err) { next(err); }
};
```

#### `src/features/batches/batches.routes.js`
```javascript
const router = require('express').Router();
const controller = require('./batches.controller');
const { authenticate, authorize } = require('../auth/auth.middleware');

router.use(authenticate);

router.post('/', authorize('owner', 'super_admin'), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/students', controller.getStudents);
router.put('/:id', authorize('owner', 'super_admin'), controller.update);
router.delete('/:id', authorize('owner', 'super_admin'), controller.delete);

module.exports = router;
```

### Step 2.3 — Students Feature (Full)

#### `src/features/students/students.service.js`
```javascript
const pool = require('../../shared/db/pool');
const { paginateMeta } = require('../../shared/utils/pagination');

exports.create = async (instituteId, data) => {
  const { name, dob, gender, phone, email, address, enrollment_no, batch_id, parent } = data;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Create student
    const studentResult = await client.query(
      `INSERT INTO students(institute_id,name,dob,gender,phone,email,address,enrollment_no)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [instituteId, name, dob || null, gender || null, phone, email, address, enrollment_no]
    );
    const student = studentResult.rows[0];

    // Enroll in batch if provided
    if (batch_id) {
      await client.query(
        'INSERT INTO batch_enrollments(batch_id, student_id) VALUES($1,$2)',
        [batch_id, student.id]
      );
    }

    // Create parent if provided
    if (parent?.name && parent?.phone) {
      const parentResult = await client.query(
        `INSERT INTO parents(institute_id, name, phone, email, relation)
         VALUES($1,$2,$3,$4,$5) RETURNING id`,
        [instituteId, parent.name, parent.phone, parent.email || null, parent.relation || 'parent']
      );
      await client.query(
        'INSERT INTO student_parents(student_id, parent_id) VALUES($1,$2)',
        [student.id, parentResult.rows[0].id]
      );
    }

    await client.query('COMMIT');
    return student;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.getAll = async (instituteId, { page = 1, limit = 20, search, batch_id }) => {
  const offset = (page - 1) * limit;
  const params = [instituteId];
  let whereClause = 'WHERE s.institute_id = $1 AND s.is_active = TRUE';

  if (search) {
    params.push(`%${search}%`);
    whereClause += ` AND (s.name ILIKE $${params.length} OR s.phone ILIKE $${params.length})`;
  }
  if (batch_id) {
    params.push(batch_id);
    whereClause += ` AND be.batch_id = $${params.length} AND be.is_active = TRUE`;
  }

  const query = `
    SELECT DISTINCT s.*, 
           p.name as parent_name, p.phone as parent_phone,
           array_agg(b.name) FILTER (WHERE b.id IS NOT NULL) as batch_names
    FROM students s
    LEFT JOIN student_parents sp ON s.id = sp.student_id
    LEFT JOIN parents p ON sp.parent_id = p.id AND sp.is_primary = TRUE
    LEFT JOIN batch_enrollments be ON s.id = be.student_id AND be.is_active = TRUE
    LEFT JOIN batches b ON be.batch_id = b.id
    ${whereClause}
    GROUP BY s.id, p.name, p.phone
    ORDER BY s.name
    LIMIT $${params.length + 1} OFFSET $${params.length + 2}
  `;

  const countQuery = `SELECT COUNT(DISTINCT s.id) FROM students s
    LEFT JOIN batch_enrollments be ON s.id = be.student_id AND be.is_active = TRUE
    ${whereClause}`;

  const [rows, countResult] = await Promise.all([
    pool.query(query, [...params, limit, offset]),
    pool.query(countQuery, params),
  ]);

  return { data: rows.rows, meta: paginateMeta(countResult.rows[0].count, page, limit) };
};

exports.getById = async (instituteId, id) => {
  const [student, parents, batches, recentAttendance] = await Promise.all([
    pool.query('SELECT * FROM students WHERE id=$1 AND institute_id=$2', [id, instituteId]),
    pool.query(
      `SELECT p.* FROM parents p
       JOIN student_parents sp ON p.id = sp.parent_id
       WHERE sp.student_id = $1`, [id]
    ),
    pool.query(
      `SELECT b.*, be.enrolled_at FROM batches b
       JOIN batch_enrollments be ON b.id = be.batch_id
       WHERE be.student_id = $1 AND be.is_active = TRUE`, [id]
    ),
    pool.query(
      `SELECT date, status FROM attendance
       WHERE student_id = $1 ORDER BY date DESC LIMIT 30`, [id]
    ),
  ]);

  if (!student.rows[0]) return null;
  return {
    ...student.rows[0],
    parents: parents.rows,
    batches: batches.rows,
    recent_attendance: recentAttendance.rows,
  };
};

exports.update = async (instituteId, id, data) => {
  const { name, dob, gender, phone, email, address, enrollment_no } = data;
  const result = await pool.query(
    `UPDATE students SET name=$1,dob=$2,gender=$3,phone=$4,email=$5,address=$6,
     enrollment_no=$7,updated_at=NOW()
     WHERE id=$8 AND institute_id=$9 RETURNING *`,
    [name, dob, gender, phone, email, address, enrollment_no, id, instituteId]
  );
  return result.rows[0];
};

exports.delete = async (instituteId, id) => {
  await pool.query(
    'UPDATE students SET is_active=FALSE WHERE id=$1 AND institute_id=$2',
    [id, instituteId]
  );
};

exports.enrollBatch = async (instituteId, studentId, batchId) => {
  // Verify ownership
  const student = await pool.query('SELECT id FROM students WHERE id=$1 AND institute_id=$2', [studentId, instituteId]);
  if (!student.rows.length) throw { status: 404, message: 'Student not found' };

  await pool.query(
    `INSERT INTO batch_enrollments(batch_id, student_id) VALUES($1,$2)
     ON CONFLICT(batch_id, student_id) DO UPDATE SET is_active=TRUE, enrolled_at=CURRENT_DATE`,
    [batchId, studentId]
  );
};
```

### Step 2.4 — Students Routes (Pattern — same as batches)

Follow the same Controller → Routes pattern as batches. Key routes:
```
POST   /api/v1/students              — Create student
GET    /api/v1/students              — List (paginated, searchable)
GET    /api/v1/students/:id          — Detail with parents/batches/attendance
PUT    /api/v1/students/:id          — Update
DELETE /api/v1/students/:id          — Soft delete
POST   /api/v1/students/:id/enroll   — Enroll in batch
```

---

## PHASE 3 — BIOMETRIC INTEGRATION (5-7 DAYS)

### Step 3.1 — Understanding BioMax Device Communication

BioMax devices (like BioMax 600/700 series) expose data via:
1. **SDK (.dll on Windows)** — Most reliable, requires local service
2. **TCP/IP Socket** — Device listens on port 4370 (ZKTeco protocol)
3. **HTTP Push** — Some newer devices push on scan

We will use the **TCP/IP Socket approach** via the `zklib` npm package.

### Step 3.2 — Biometric Sync Service (LOCAL — NOT on Render)

This runs on the same Windows PC/laptop that's at the coaching center.

#### `biometric-sync/package.json`
```json
{
  "name": "coachops-biometric-sync",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
  "dependencies": {
    "axios": "^1.6.7",
    "dotenv": "^16.4.0",
    "node-schedule": "^2.1.1"
  }
}
```

#### `biometric-sync/config.js`
```javascript
require('dotenv').config();

module.exports = {
  device: {
    ip: process.env.DEVICE_IP || '192.168.1.201',
    port: parseInt(process.env.DEVICE_PORT) || 4370,
    inport: 4000,
    timeout: 5000,
  },
  server: {
    apiUrl: process.env.API_URL || 'https://your-api.onrender.com',
    apiKey: process.env.BIOMETRIC_SYNC_SECRET,
    deviceId: process.env.DEVICE_ID,
  },
  sync: {
    intervalSeconds: 60,     // Sync every 60 seconds
    batchSize: 100,           // Send 100 records at a time
  },
};
```

#### `biometric-sync/.env`
```env
DEVICE_IP=192.168.1.201
DEVICE_PORT=4370
DEVICE_ID=your-device-uuid-from-dashboard
API_URL=https://your-api.onrender.com
BIOMETRIC_SYNC_SECRET=your-secret-from-server
```

#### `biometric-sync/deviceService.js`
```javascript
/**
 * BioMax / ZKTeco device communication
 * Uses raw TCP socket to communicate with the device.
 * The device firmware uses ZKTeco protocol over TCP/IP.
 *
 * IMPORTANT: This requires the device to be on the same local network.
 */

const net = require('net');
const config = require('./config');
const logger = require('./logger');

// ZKTeco command constants
const CMD_CONNECT = 1000;
const CMD_EXIT = 1001;
const CMD_ATTLOG_RRQ = 1501;
const CMD_CLEAR_ATTLOG = 1502;
const USHRT_MAX = 65535;

let sessionId = 0;
let replyId = 0;

function createHeader(command, data = Buffer.alloc(0)) {
  const header = Buffer.alloc(8);
  header.writeUInt16LE(command, 0);
  header.writeUInt16LE(0, 2);
  header.writeUInt16LE(sessionId, 4);
  header.writeUInt16LE(replyId++ % USHRT_MAX, 6);
  return Buffer.concat([header, data]);
}

function parseAttendanceLog(buffer) {
  const records = [];
  let offset = 4; // Skip first 4 bytes (header)
  while (offset + 40 <= buffer.length) {
    try {
      const uid = buffer.readUInt16LE(offset);
      const status = buffer.readUInt8(offset + 4);
      const timestamp = parseTimestamp(buffer.slice(offset + 8, offset + 14));
      if (timestamp) {
        records.push({
          device_user_id: uid.toString(),
          timestamp: timestamp.toISOString(),
          status,
        });
      }
    } catch (_) { /* Skip malformed record */ }
    offset += 40;
  }
  return records;
}

function parseTimestamp(buf) {
  if (buf.length < 6) return null;
  const year = buf[0] + buf[1] * 256;
  const month = buf[2] - 1;
  const day = buf[3];
  const hour = buf[4];
  const minute = buf[5];
  if (year < 2000 || year > 2100) return null;
  return new Date(year, month, day, hour, minute);
}

/**
 * Fetch attendance logs from device
 * Returns array of { device_user_id, timestamp }
 */
exports.fetchLogs = () => {
  return new Promise((resolve, reject) => {
    const socket = new net.Socket();
    const { ip, port, timeout } = config.device;
    const logs = [];
    let dataBuffer = Buffer.alloc(0);
    let connected = false;

    socket.setTimeout(timeout);

    socket.connect(port, ip, () => {
      connected = true;
      logger.info(`Connected to device at ${ip}:${port}`);
      socket.write(createHeader(CMD_CONNECT));
    });

    socket.on('data', (chunk) => {
      dataBuffer = Buffer.concat([dataBuffer, chunk]);
      const command = dataBuffer.readUInt16LE(0);
      sessionId = dataBuffer.readUInt16LE(4);

      if (command === CMD_CONNECT + 8) {
        // Connected — request attendance logs
        socket.write(createHeader(CMD_ATTLOG_RRQ));
      } else if (command === CMD_ATTLOG_RRQ + 8) {
        const records = parseAttendanceLog(dataBuffer);
        logs.push(...records);
        socket.write(createHeader(CMD_EXIT));
      } else if (command === CMD_EXIT + 8) {
        socket.destroy();
        resolve(logs);
      }
    });

    socket.on('timeout', () => {
      socket.destroy();
      if (!connected) reject(new Error('Device connection timeout'));
      else resolve(logs);
    });

    socket.on('error', (err) => {
      logger.error(`Device error: ${err.message}`);
      reject(err);
    });

    socket.on('close', () => {
      if (logs.length) resolve(logs);
    });
  });
};
```

#### `biometric-sync/apiClient.js`
```javascript
const axios = require('axios');
const config = require('./config');
const logger = require('./logger');

const client = axios.create({
  baseURL: config.server.apiUrl,
  timeout: 10000,
  headers: {
    'x-biometric-key': config.server.apiKey,
    'x-device-id': config.server.deviceId,
    'Content-Type': 'application/json',
  },
});

exports.syncLogs = async (logs) => {
  if (!logs.length) return { synced: 0 };
  try {
    const response = await client.post('/api/v1/biometric/sync', { logs });
    return response.data.data;
  } catch (err) {
    logger.error(`Sync failed: ${err.response?.data?.error?.message || err.message}`);
    throw err;
  }
};

exports.ping = async () => {
  try {
    await client.get('/health');
    return true;
  } catch {
    return false;
  }
};
```

#### `biometric-sync/index.js`
```javascript
const schedule = require('node-schedule');
const deviceService = require('./deviceService');
const apiClient = require('./apiClient');
const config = require('./config');
const logger = require('./logger');

// Track last processed timestamp to avoid resending
let lastProcessedAt = null;

async function sync() {
  logger.info('Starting sync cycle...');

  try {
    // 1. Fetch all logs from device
    const allLogs = await deviceService.fetchLogs();
    logger.info(`Fetched ${allLogs.length} raw logs from device`);

    if (!allLogs.length) return;

    // 2. Filter: only new logs since last sync
    const newLogs = lastProcessedAt
      ? allLogs.filter(l => new Date(l.timestamp) > lastProcessedAt)
      : allLogs;

    if (!newLogs.length) {
      logger.info('No new logs since last sync');
      return;
    }

    // 3. Send to server in batches
    const batchSize = config.sync.batchSize;
    for (let i = 0; i < newLogs.length; i += batchSize) {
      const batch = newLogs.slice(i, i + batchSize);
      const result = await apiClient.syncLogs(batch);
      logger.info(`Synced batch: ${result.synced} records processed`);
    }

    // 4. Update last processed timestamp
    lastProcessedAt = new Date();
    logger.info(`Sync complete. Last sync: ${lastProcessedAt.toISOString()}`);

  } catch (err) {
    logger.error(`Sync cycle failed: ${err.message}`);
  }
}

// Run every N seconds as configured
const interval = config.sync.intervalSeconds;
schedule.scheduleJob(`*/${interval} * * * * *`, sync);

logger.info(`Biometric sync service started. Syncing every ${interval}s`);

// Initial sync on startup
sync();
```

### Step 3.3 — Backend Biometric Feature

#### `src/features/biometric/biometric.middleware.js`
```javascript
const { error } = require('../../shared/utils/response');

// Device authentication — uses API key instead of JWT
exports.deviceAuth = async (req, res, next) => {
  const deviceKey = req.headers['x-biometric-key'];
  const deviceId = req.headers['x-device-id'];

  if (!deviceKey || deviceKey !== process.env.BIOMETRIC_SYNC_SECRET) {
    return error(res, 'Invalid device key', 401, 'UNAUTHORIZED');
  }

  if (!deviceId) {
    return error(res, 'Device ID required', 400, 'BAD_REQUEST');
  }

  req.deviceId = deviceId;
  next();
};
```

#### `src/features/biometric/biometric.service.js`
```javascript
const pool = require('../../shared/db/pool');

exports.syncLogs = async (deviceId, logs) => {
  // Verify device exists
  const deviceResult = await pool.query(
    'SELECT * FROM biometric_devices WHERE id=$1 AND is_active=TRUE', [deviceId]
  );
  if (!deviceResult.rows.length) throw { status: 404, message: 'Device not registered' };

  const device = deviceResult.rows[0];
  let processed = 0;
  let errors = 0;

  for (const log of logs) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 1. Save raw log (for audit)
      const rawLog = await client.query(
        `INSERT INTO biometric_logs(device_id, device_user_id, raw_timestamp)
         VALUES($1,$2,$3)
         ON CONFLICT DO NOTHING RETURNING id`,
        [deviceId, log.device_user_id, log.timestamp]
      );

      if (!rawLog.rows.length) {
        await client.query('ROLLBACK');
        continue; // Duplicate, skip
      }

      const logId = rawLog.rows[0].id;

      // 2. Find student mapping
      const mapping = await client.query(
        `SELECT student_id FROM biometric_mappings
         WHERE device_id=$1 AND device_user_id=$2`,
        [deviceId, log.device_user_id]
      );

      if (!mapping.rows.length) {
        await client.query('ROLLBACK');
        errors++;
        continue;
      }

      const studentId = mapping.rows[0].student_id;
      const date = new Date(log.timestamp).toISOString().split('T')[0];

      // 3. Find student's active batch for this date/time
      const batchResult = await client.query(
        `SELECT be.batch_id FROM batch_enrollments be
         WHERE be.student_id=$1 AND be.is_active=TRUE LIMIT 1`,
        [studentId]
      );
      const batchId = batchResult.rows[0]?.batch_id || null;

      // 4. Insert attendance (idempotent — UNIQUE on student_id+batch_id+date)
      await client.query(
        `INSERT INTO attendance(institute_id, student_id, batch_id, date, status, source, biometric_log_id)
         SELECT institute_id, $2, $3, $4, 'present', 'biometric', $5
         FROM students WHERE id=$2
         ON CONFLICT(student_id, batch_id, date) DO NOTHING`,
        [device.institute_id, studentId, batchId, date, logId]
      );

      // 5. Mark log as processed
      await client.query(
        'UPDATE biometric_logs SET processed=TRUE WHERE id=$1', [logId]
      );

      await client.query('COMMIT');
      processed++;
    } catch (err) {
      await client.query('ROLLBACK');
      errors++;
    } finally {
      client.release();
    }
  }

  // Update device last sync time
  await pool.query(
    'UPDATE biometric_devices SET last_sync_at=NOW() WHERE id=$1', [deviceId]
  );

  return { synced: processed, errors, total: logs.length };
};

exports.createDevice = async (instituteId, data) => {
  const { v4: uuidv4 } = require('uuid');
  const apiKey = uuidv4() + uuidv4(); // Long random key
  const result = await pool.query(
    `INSERT INTO biometric_devices(institute_id,device_name,device_serial,location,api_key)
     VALUES($1,$2,$3,$4,$5) RETURNING *`,
    [instituteId, data.device_name, data.device_serial, data.location, apiKey]
  );
  return result.rows[0];
};

exports.createMapping = async (instituteId, data) => {
  const { device_id, device_user_id, student_id } = data;
  const result = await pool.query(
    `INSERT INTO biometric_mappings(institute_id,device_id,device_user_id,student_id)
     VALUES($1,$2,$3,$4) RETURNING *`,
    [instituteId, device_id, device_user_id, student_id]
  );
  return result.rows[0];
};

exports.getMappings = async (instituteId) => {
  const result = await pool.query(
    `SELECT bm.*, s.name as student_name, bd.device_name
     FROM biometric_mappings bm
     JOIN students s ON bm.student_id = s.id
     JOIN biometric_devices bd ON bm.device_id = bd.id
     WHERE bm.institute_id = $1
     ORDER BY s.name`,
    [instituteId]
  );
  return result.rows;
};

exports.deleteMapping = async (instituteId, id) => {
  await pool.query(
    'DELETE FROM biometric_mappings WHERE id=$1 AND institute_id=$2',
    [id, instituteId]
  );
};
```

#### `src/features/biometric/biometric.routes.js`
```javascript
const router = require('express').Router();
const controller = require('./biometric.controller');
const { authenticate, authorize } = require('../auth/auth.middleware');
const { deviceAuth } = require('./biometric.middleware');

// Device sync — uses device API key auth
router.post('/sync', deviceAuth, controller.sync);

// Admin routes — uses JWT
router.use(authenticate);
router.post('/devices', authorize('owner', 'super_admin'), controller.createDevice);
router.get('/devices', authorize('owner', 'super_admin'), controller.getDevices);
router.post('/mappings', authorize('owner', 'super_admin'), controller.createMapping);
router.get('/mappings', authorize('owner', 'super_admin'), controller.getMappings);
router.delete('/mappings/:id', authorize('owner', 'super_admin'), controller.deleteMapping);

module.exports = router;
```

---

## PHASE 4 — ATTENDANCE ENGINE (3-4 DAYS)

### Step 4.1 — Attendance Service

#### `src/features/attendance/attendance.service.js`
```javascript
const pool = require('../../shared/db/pool');

// Manual attendance entry (teacher override)
exports.markManual = async (instituteId, userId, { student_id, batch_id, date, status, notes }) => {
  const result = await pool.query(
    `INSERT INTO attendance(institute_id,student_id,batch_id,date,status,source,marked_by,notes)
     VALUES($1,$2,$3,$4,$5,'manual',$6,$7)
     ON CONFLICT(student_id,batch_id,date)
     DO UPDATE SET status=$5, marked_by=$6, notes=$7, updated_at=NOW()
     RETURNING *`,
    [instituteId, student_id, batch_id, date, status, userId, notes || null]
  );
  return result.rows[0];
};

// Get attendance for a batch on a date
exports.getBatchAttendance = async (instituteId, batchId, date) => {
  // Get all enrolled students + their attendance for this date
  const result = await pool.query(
    `SELECT s.id, s.name, s.phone,
            a.status, a.source, a.created_at as marked_at
     FROM students s
     JOIN batch_enrollments be ON s.id = be.student_id
     LEFT JOIN attendance a ON a.student_id = s.id
       AND a.batch_id = $2 AND a.date = $3
     WHERE be.batch_id = $2 AND be.is_active = TRUE AND s.institute_id = $1
     ORDER BY s.name`,
    [instituteId, batchId, date]
  );
  return result.rows;
};

// Get student attendance summary
exports.getStudentSummary = async (studentId, batchId, month, year) => {
  const result = await pool.query(
    `SELECT date, status, source
     FROM attendance
     WHERE student_id=$1
       AND ($2::uuid IS NULL OR batch_id=$2)
       AND EXTRACT(MONTH FROM date)=$3
       AND EXTRACT(YEAR FROM date)=$4
     ORDER BY date`,
    [studentId, batchId || null, month, year]
  );

  const total = result.rows.length;
  const present = result.rows.filter(r => r.status === 'present').length;
  const absent = result.rows.filter(r => r.status === 'absent').length;

  return {
    records: result.rows,
    summary: {
      total_days: total,
      present_days: present,
      absent_days: absent,
      percentage: total > 0 ? Math.round((present / total) * 100) : 0,
    },
  };
};

// Get institute-wide attendance for a date
exports.getDailyOverview = async (instituteId, date) => {
  const result = await pool.query(
    `SELECT
       COUNT(DISTINCT be.student_id) FILTER (WHERE a.status = 'present') as present_count,
       COUNT(DISTINCT be.student_id) FILTER (WHERE a.status = 'absent') as absent_count,
       COUNT(DISTINCT be.student_id) FILTER (WHERE a.status IS NULL) as unmarked_count,
       COUNT(DISTINCT be.student_id) as total_enrolled
     FROM batch_enrollments be
     JOIN batches b ON be.batch_id = b.id
     LEFT JOIN attendance a ON a.student_id = be.student_id AND a.date = $2
     WHERE b.institute_id = $1 AND be.is_active = TRUE`,
    [instituteId, date]
  );
  return result.rows[0];
};

// Get students with low attendance (below threshold %)
exports.getLowAttendanceStudents = async (instituteId, threshold = 75, days = 30) => {
  const result = await pool.query(
    `WITH student_attendance AS (
       SELECT
         s.id, s.name, s.phone,
         COUNT(a.id) FILTER (WHERE a.status = 'present') as present_days,
         COUNT(a.id) as total_days
       FROM students s
       JOIN batch_enrollments be ON s.id = be.student_id AND be.is_active = TRUE
       LEFT JOIN attendance a ON a.student_id = s.id
         AND a.date >= CURRENT_DATE - INTERVAL '${days} days'
       WHERE s.institute_id = $1 AND s.is_active = TRUE
       GROUP BY s.id, s.name, s.phone
     )
     SELECT *,
       CASE WHEN total_days > 0
         THEN ROUND((present_days::numeric / total_days) * 100, 1)
         ELSE 0
       END as attendance_pct
     FROM student_attendance
     WHERE total_days > 0
       AND (present_days::numeric / total_days * 100) < $2
     ORDER BY attendance_pct`,
    [instituteId, threshold]
  );
  return result.rows;
};
```

---

## PHASE 5 — FRONTEND FOUNDATION (5-7 DAYS)

### Step 5.1 — Vite + Tailwind Config

#### `tailwind.config.js`
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Corporate dark theme
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#1e3a5f',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

#### `src/index.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

@layer base {
  * { box-sizing: border-box; }
  body {
    @apply bg-surface-50 text-surface-900 font-sans antialiased;
  }
  :root {
    --sidebar-width: 256px;
    --topbar-height: 64px;
  }
}

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium
           hover:bg-brand-700 transition-colors focus:outline-none focus:ring-2
           focus:ring-brand-500 focus:ring-offset-2 disabled:opacity-50;
  }
  .btn-secondary {
    @apply px-4 py-2 bg-surface-100 text-surface-700 rounded-lg text-sm font-medium
           hover:bg-surface-200 transition-colors border border-surface-200;
  }
  .card {
    @apply bg-white rounded-xl border border-surface-200 shadow-sm;
  }
  .input-field {
    @apply w-full px-3 py-2 border border-surface-200 rounded-lg text-sm
           focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent
           placeholder:text-surface-400;
  }
  .table-header {
    @apply text-left text-xs font-semibold text-surface-500 uppercase tracking-wide px-4 py-3;
  }
  .table-cell {
    @apply px-4 py-3 text-sm text-surface-700;
  }
}
```

### Step 5.2 — Redux Store Setup

#### `src/shared/store/store.js`
```javascript
import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from './baseApi';
import authReducer from '../../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});
```

#### `src/shared/store/baseApi.js`
```javascript
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.accessToken;
      if (token) headers.set('authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Student', 'Batch', 'Attendance', 'Test', 'Report', 'User', 'Notification'],
  endpoints: () => ({}),
});
```

### Step 5.3 — Auth Slice & API

#### `src/features/auth/authSlice.js`
```javascript
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: JSON.parse(localStorage.getItem('coachops_user') || 'null'),
  accessToken: localStorage.getItem('coachops_token') || null,
  refreshToken: localStorage.getItem('coachops_refresh') || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, access_token, refresh_token } = action.payload;
      state.user = user;
      state.accessToken = access_token;
      state.refreshToken = refresh_token;
      localStorage.setItem('coachops_user', JSON.stringify(user));
      localStorage.setItem('coachops_token', access_token);
      localStorage.setItem('coachops_refresh', refresh_token);
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem('coachops_token', action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      localStorage.clear();
    },
  },
});

export const { setCredentials, updateAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => !!state.auth.accessToken;
```

#### `src/features/auth/authApi.js`
```javascript
import { baseApi } from '../../shared/store/baseApi';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: '/auth/register',
        method: 'POST',
        body: data,
      }),
    }),
    getMe: builder.query({
      query: () => '/auth/me',
    }),
    logout: builder.mutation({
      query: (data) => ({
        url: '/auth/logout',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery, useLogoutMutation } = authApi;
```

#### `src/features/auth/authGuard.jsx`
```jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectCurrentUser } from './authSlice';

export const AuthGuard = ({ children, allowedRoles }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
```

### Step 5.4 — Root App Router

#### `src/App.jsx`
```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from './features/auth/authSlice';
import { AuthGuard } from './features/auth/authGuard';
import LoginPage from './features/auth/pages/LoginPage';
import RegisterPage from './features/auth/pages/RegisterPage';
import AdminApp from './apps/admin/AdminApp';
import TeacherApp from './apps/teacher/TeacherApp';
import ParentApp from './apps/parent/ParentApp';
import { Toaster } from 'react-hot-toast';

function RoleRouter() {
  const user = useSelector(selectCurrentUser);
  if (!user) return <Navigate to="/login" replace />;
  switch (user.role) {
    case 'owner':
    case 'super_admin': return <Navigate to="/admin" replace />;
    case 'teacher': return <Navigate to="/teacher" replace />;
    case 'parent': return <Navigate to="/parent" replace />;
    default: return <Navigate to="/login" replace />;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<RoleRouter />} />

        <Route path="/admin/*" element={
          <AuthGuard allowedRoles={['owner', 'super_admin']}>
            <AdminApp />
          </AuthGuard>
        } />

        <Route path="/teacher/*" element={
          <AuthGuard allowedRoles={['teacher']}>
            <TeacherApp />
          </AuthGuard>
        } />

        <Route path="/parent/*" element={
          <AuthGuard allowedRoles={['parent']}>
            <ParentApp />
          </AuthGuard>
        } />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## PHASE 6 — ADMIN DASHBOARD UI (5-7 DAYS)

### Step 6.1 — Admin Layout

#### `src/shared/components/layout/AdminLayout.jsx`
```jsx
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AdminLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

#### `src/shared/components/layout/Sidebar.jsx`
```jsx
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, selectCurrentUser } from '../../../features/auth/authSlice';
import {
  LayoutDashboard, Users, BookOpen, ClipboardList,
  BarChart3, Bell, Settings, LogOut, GraduationCap, Fingerprint
} from 'lucide-react';

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/batches', label: 'Batches', icon: BookOpen },
  { to: '/admin/attendance', label: 'Attendance', icon: ClipboardList },
  { to: '/admin/tests', label: 'Tests & Marks', icon: GraduationCap },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/biometric', label: 'Biometric', icon: Fingerprint },
  { to: '/admin/notifications', label: 'Notifications', icon: Bell },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-surface-900 text-white flex flex-col shrink-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-surface-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="font-semibold text-white">CoachOps</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {ADMIN_NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white'
                    : 'text-surface-400 hover:bg-surface-700 hover:text-white'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Footer */}
      <div className="border-t border-surface-700 p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center text-sm font-medium">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-surface-400 truncate capitalize">{user?.role}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-surface-400 hover:text-white hover:bg-surface-700 rounded-lg transition-colors">
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
```

### Step 6.2 — Dashboard Page

#### `src/features/dashboard/pages/DashboardPage.jsx`
```jsx
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../auth/authSlice';
import StatCard from '../components/StatCard';
import AttendanceChart from '../components/AttendanceChart';
import WeakStudentAlert from '../components/WeakStudentAlert';
import { useGetDashboardStatsQuery } from '../dashboardApi';
import { Users, BookOpen, UserCheck, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser);
  const { data, isLoading } = useGetDashboardStatsQuery();

  if (isLoading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" /></div>;

  const stats = data?.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-surface-900">Dashboard</h1>
        <p className="text-surface-500 text-sm mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={stats?.total_students} icon={Users} color="blue" />
        <StatCard label="Active Batches" value={stats?.total_batches} icon={BookOpen} color="green" />
        <StatCard label="Today's Attendance" value={`${stats?.today_attendance_pct ?? 0}%`} icon={UserCheck} color="purple" />
        <StatCard label="Teachers" value={stats?.total_teachers} icon={TrendingUp} color="orange" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6">
          <h2 className="text-base font-semibold text-surface-900 mb-4">Attendance Trend (Last 30 Days)</h2>
          <AttendanceChart />
        </div>
        <div className="card p-6">
          <h2 className="text-base font-semibold text-surface-900 mb-4">At-Risk Students</h2>
          <WeakStudentAlert />
        </div>
      </div>
    </div>
  );
}
```

#### `src/features/dashboard/components/StatCard.jsx`
```jsx
const colorMap = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-green-50 text-green-600',
  purple: 'bg-purple-50 text-purple-600',
  orange: 'bg-orange-50 text-orange-600',
};

export default function StatCard({ label, value, icon: Icon, color = 'blue', delta }) {
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-surface-500">{label}</p>
          <p className="text-2xl font-bold text-surface-900 mt-1">{value ?? '—'}</p>
          {delta && (
            <p className={`text-xs mt-1 ${delta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {delta >= 0 ? '↑' : '↓'} {Math.abs(delta)}% vs last month
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
```

---

## PHASE 7 — TEACHER & PARENT PORTALS (4-5 DAYS)

### Teacher Portal Key Pages

Teacher sees a simplified UI with:
1. **Today's Batches** — Which batches run today
2. **Batch Attendance** — View biometric attendance for a batch on a date, override if needed
3. **Student List** — For each batch
4. **Marks Entry** — Enter test results

### Teacher App Routes

#### `src/apps/teacher/routes.jsx`
```jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../../shared/components/layout/TeacherLayout';
import DashboardPage from '../../features/dashboard/pages/TeacherDashboardPage';
import BatchDetailPage from '../../features/batches/pages/BatchDetailPage';
import AttendancePage from '../../features/attendance/pages/TeacherAttendancePage';

export default function TeacherRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="batches/:id" element={<BatchDetailPage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="*" element={<Navigate to="" replace />} />
      </Route>
    </Routes>
  );
}
```

### Parent Portal Key Pages

Parent sees:
1. **Child's Profile** — Basic info
2. **Attendance Calendar** — Visual monthly calendar
3. **Test Results** — Score history
4. **Notifications** — All alerts

---

## PHASE 8 — COMMUNICATION LAYER (4-5 DAYS)

### Step 8.1 — Notification Service

#### `src/features/notifications/notifications.service.js`
```javascript
const nodemailer = require('nodemailer');
const pool = require('../../shared/db/pool');
const env = require('../../shared/config/env');
const logger = require('../../shared/utils/logger');

// ─── Email ────────────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

exports.sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({ from: env.SMTP_FROM, to, subject, html });
    logger.info(`Email sent to ${to}`);
    return true;
  } catch (err) {
    logger.error(`Email failed: ${err.message}`);
    return false;
  }
};

// ─── WhatsApp (Twilio) ────────────────────────────────────────────────────────
let twilioClient = null;
if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
  const twilio = require('twilio');
  twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
}

exports.sendWhatsApp = async ({ to, message }) => {
  if (!twilioClient) {
    logger.warn('WhatsApp not configured');
    return false;
  }
  try {
    await twilioClient.messages.create({
      from: `whatsapp:${env.TWILIO_WHATSAPP_FROM}`,
      to: `whatsapp:+91${to.replace(/\D/g, '')}`,
      body: message,
    });
    logger.info(`WhatsApp sent to ${to}`);
    return true;
  } catch (err) {
    logger.error(`WhatsApp failed: ${err.message}`);
    return false;
  }
};

// ─── Template Renderer ────────────────────────────────────────────────────────
exports.renderTemplate = (template, vars) => {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || `{{${key}}}`);
};

// ─── Attendance Alert (called after biometric sync) ───────────────────────────
exports.sendAttendanceAbsentAlert = async (instituteId, studentId, date) => {
  const result = await pool.query(
    `SELECT s.name as student_name, p.phone as parent_phone, p.name as parent_name,
            i.name as institute_name
     FROM students s
     JOIN student_parents sp ON s.id = sp.student_id AND sp.is_primary = TRUE
     JOIN parents p ON sp.parent_id = p.id
     JOIN institutes i ON s.institute_id = i.id
     WHERE s.id = $1 AND s.institute_id = $2`,
    [studentId, instituteId]
  );

  if (!result.rows.length) return;
  const { student_name, parent_phone, parent_name, institute_name } = result.rows[0];

  const message = `Dear ${parent_name}, your ward ${student_name} was marked *ABSENT* on ${new Date(date).toLocaleDateString('en-IN')} at ${institute_name}. Please contact the institute if this is incorrect.`;

  const sent = await exports.sendWhatsApp({ to: parent_phone, message });

  await pool.query(
    `INSERT INTO notification_logs(institute_id,channel,event_type,recipient_phone,content,status,sent_at)
     VALUES($1,'whatsapp','attendance.absent',$2,$3,$4,NOW())`,
    [instituteId, parent_phone, message, sent ? 'sent' : 'failed']
  );
};

// ─── Monthly Report Email ─────────────────────────────────────────────────────
exports.sendMonthlyReport = async (instituteId, studentId, month, year) => {
  const result = await pool.query(
    `SELECT s.name, s.email, p.email as parent_email, p.name as parent_name,
            COUNT(a.id) FILTER (WHERE a.status = 'present') as present,
            COUNT(a.id) as total
     FROM students s
     LEFT JOIN student_parents sp ON s.id = sp.student_id AND sp.is_primary = TRUE
     LEFT JOIN parents p ON sp.parent_id = p.id
     LEFT JOIN attendance a ON a.student_id = s.id
       AND EXTRACT(MONTH FROM a.date) = $3
       AND EXTRACT(YEAR FROM a.date) = $4
     WHERE s.id = $2 AND s.institute_id = $1
     GROUP BY s.name, s.email, p.email, p.name`,
    [instituteId, studentId, month, year]
  );

  if (!result.rows.length) return;
  const row = result.rows[0];
  const pct = row.total > 0 ? Math.round((row.present / row.total) * 100) : 0;

  const emailTo = row.parent_email || row.email;
  if (!emailTo) return;

  const html = `
    <h2>Monthly Attendance Report — ${row.name}</h2>
    <p>Month: ${month}/${year}</p>
    <p>Present: ${row.present} / ${row.total} days</p>
    <p>Attendance: <strong>${pct}%</strong></p>
    ${pct < 75 ? '<p style="color:red">⚠️ Attendance is below 75%. Please contact the institute.</p>' : ''}
  `;

  await exports.sendEmail({
    to: emailTo,
    subject: `Monthly Report — ${row.name}`,
    html,
  });
};
```

### Step 8.2 — Cron Job for Daily Absent Alerts

#### `src/features/notifications/notifications.jobs.js`
```javascript
const cron = require('node-cron');
const pool = require('../../shared/db/pool');
const notifService = require('./notifications.service');
const logger = require('../../shared/utils/logger');

/**
 * Run every day at 7 PM — find students not marked present today
 * and send WhatsApp alert to parent.
 */
cron.schedule('0 19 * * *', async () => {
  logger.info('Running daily absent notification job...');

  const today = new Date().toISOString().split('T')[0];

  // Find active enrolled students NOT present today
  const result = await pool.query(
    `SELECT DISTINCT be.student_id, b.institute_id
     FROM batch_enrollments be
     JOIN batches b ON be.batch_id = b.id
     WHERE be.is_active = TRUE
       AND be.student_id NOT IN (
         SELECT student_id FROM attendance
         WHERE date = $1 AND status = 'present'
       )`,
    [today]
  );

  logger.info(`Found ${result.rows.length} absent students`);

  for (const row of result.rows) {
    try {
      await notifService.sendAttendanceAbsentAlert(row.institute_id, row.student_id, today);
    } catch (err) {
      logger.error(`Failed to send alert for student ${row.student_id}: ${err.message}`);
    }
  }
});

logger.info('Notification jobs registered');
```

Import in `app.js`:
```javascript
require('./features/notifications/notifications.jobs');
```

---

## PHASE 9 — ANALYTICS & AI REPORTS (5-7 DAYS)

### Step 9.1 — Analytics Service

#### `src/features/analytics/analytics.service.js`
```javascript
const pool = require('../../shared/db/pool');

exports.getDashboardStats = async (instituteId) => {
  const today = new Date().toISOString().split('T')[0];

  const [students, batches, teachers, todayAttendance, weekTrend] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM students WHERE institute_id=$1 AND is_active=TRUE', [instituteId]),
    pool.query('SELECT COUNT(*) FROM batches WHERE institute_id=$1 AND is_active=TRUE', [instituteId]),
    pool.query("SELECT COUNT(*) FROM users WHERE institute_id=$1 AND role='teacher' AND is_active=TRUE", [instituteId]),
    pool.query(
      `SELECT
         COUNT(DISTINCT student_id) FILTER (WHERE status='present') as present,
         COUNT(DISTINCT be.student_id) as enrolled
       FROM batch_enrollments be
       JOIN batches b ON be.batch_id = b.id
       LEFT JOIN attendance a ON a.student_id = be.student_id AND a.date = $2
       WHERE b.institute_id = $1 AND be.is_active = TRUE`,
      [instituteId, today]
    ),
    pool.query(
      `SELECT date,
               COUNT(*) FILTER (WHERE status='present') as present,
               COUNT(*) as total
       FROM attendance
       WHERE institute_id=$1
         AND date >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY date ORDER BY date`,
      [instituteId]
    ),
  ]);

  const attendancePct = todayAttendance.rows[0].enrolled > 0
    ? Math.round((todayAttendance.rows[0].present / todayAttendance.rows[0].enrolled) * 100)
    : 0;

  return {
    total_students: parseInt(students.rows[0].count),
    total_batches: parseInt(batches.rows[0].count),
    total_teachers: parseInt(teachers.rows[0].count),
    today_attendance_pct: attendancePct,
    attendance_trend: weekTrend.rows.map(r => ({
      date: r.date,
      pct: r.total > 0 ? Math.round((r.present / r.total) * 100) : 0,
    })),
  };
};

exports.getBatchPerformance = async (instituteId, batchId) => {
  const result = await pool.query(
    `SELECT
       s.id, s.name,
       AVG(r.marks_obtained / t.max_marks * 100) as avg_pct,
       COUNT(r.id) as tests_taken,
       COUNT(a.id) FILTER (WHERE a.status = 'present') as present_days,
       COUNT(a.id) as total_attendance_days
     FROM students s
     JOIN batch_enrollments be ON s.id = be.student_id AND be.batch_id = $2
     LEFT JOIN results r ON r.student_id = s.id
     LEFT JOIN tests t ON r.test_id = t.id AND t.batch_id = $2
     LEFT JOIN attendance a ON a.student_id = s.id AND a.batch_id = $2
     WHERE s.institute_id = $1
     GROUP BY s.id, s.name
     ORDER BY avg_pct DESC NULLS LAST`,
    [instituteId, batchId]
  );
  return result.rows;
};

exports.getWeakStudents = async (instituteId) => {
  const [lowAttendance, lowMarks] = await Promise.all([
    pool.query(
      `SELECT s.id, s.name, 'attendance' as risk_type,
              ROUND(COUNT(a.id) FILTER (WHERE a.status='present')::numeric /
                NULLIF(COUNT(a.id), 0) * 100, 1) as metric
       FROM students s
       LEFT JOIN attendance a ON a.student_id = s.id
         AND a.date >= CURRENT_DATE - INTERVAL '30 days'
       WHERE s.institute_id = $1 AND s.is_active = TRUE
       GROUP BY s.id, s.name
       HAVING COUNT(a.id) > 0
          AND (COUNT(a.id) FILTER (WHERE a.status='present')::numeric / COUNT(a.id)) < 0.75
       ORDER BY metric`,
      [instituteId]
    ),
    pool.query(
      `SELECT s.id, s.name, 'marks' as risk_type,
              ROUND(AVG(r.marks_obtained / t.max_marks * 100), 1) as metric
       FROM students s
       JOIN results r ON r.student_id = s.id
       JOIN tests t ON r.test_id = t.id
       WHERE s.institute_id = $1 AND s.is_active = TRUE
         AND t.test_date >= CURRENT_DATE - INTERVAL '60 days'
       GROUP BY s.id, s.name
       HAVING AVG(r.marks_obtained / t.max_marks * 100) < 50
       ORDER BY metric`,
      [instituteId]
    ),
  ]);

  return {
    low_attendance: lowAttendance.rows,
    low_marks: lowMarks.rows,
  };
};
```

### Step 9.2 — AI Report Generation

#### `src/features/reports/reports.service.js`
```javascript
const pool = require('../../shared/db/pool');
const axios = require('axios');
const env = require('../../shared/config/env');

exports.generateStudentReport = async (instituteId, studentId, month, year) => {
  // 1. Gather data
  const [student, attendance, marks] = await Promise.all([
    pool.query(
      `SELECT s.*, i.name as institute_name FROM students s
       JOIN institutes i ON s.institute_id = i.id
       WHERE s.id=$1 AND s.institute_id=$2`,
      [studentId, instituteId]
    ),
    pool.query(
      `SELECT status, COUNT(*) as count FROM attendance
       WHERE student_id=$1
         AND EXTRACT(MONTH FROM date)=$2
         AND EXTRACT(YEAR FROM date)=$3
       GROUP BY status`,
      [studentId, month, year]
    ),
    pool.query(
      `SELECT t.title, t.max_marks, r.marks_obtained,
              ROUND(r.marks_obtained/t.max_marks*100, 1) as pct
       FROM results r JOIN tests t ON r.test_id = t.id
       WHERE r.student_id=$1
         AND EXTRACT(MONTH FROM t.test_date)=$2
         AND EXTRACT(YEAR FROM t.test_date)=$3
       ORDER BY t.test_date`,
      [studentId, month, year]
    ),
  ]);

  if (!student.rows[0]) throw { status: 404, message: 'Student not found' };

  const data = student.rows[0];
  const att = {};
  attendance.rows.forEach(r => { att[r.status] = parseInt(r.count); });
  const totalDays = (att.present || 0) + (att.absent || 0) + (att.late || 0);
  const attPct = totalDays > 0 ? Math.round((att.present || 0) / totalDays * 100) : 0;
  const avgMarks = marks.rows.length
    ? Math.round(marks.rows.reduce((sum, r) => sum + parseFloat(r.pct), 0) / marks.rows.length)
    : null;

  // 2. Build context for AI summary
  const context = `
Student: ${data.name}
Institute: ${data.institute_name}
Month: ${month}/${year}
Attendance: ${att.present || 0} present, ${att.absent || 0} absent of ${totalDays} days (${attPct}%)
Test Performance: ${marks.rows.map(r => `${r.title}: ${r.marks_obtained}/${r.max_marks} (${r.pct}%)`).join(', ') || 'No tests this month'}
Average Score: ${avgMarks !== null ? avgMarks + '%' : 'N/A'}
  `.trim();

  // 3. AI Summary (if key exists)
  let aiSummary = null;
  if (env.OPENAI_API_KEY) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an educational assistant generating parent-friendly student progress reports. Be concise, supportive, and constructive. Maximum 3 sentences.',
            },
            {
              role: 'user',
              content: `Generate a brief progress summary for the following student data:\n${context}`,
            },
          ],
          max_tokens: 150,
        },
        { headers: { Authorization: `Bearer ${env.OPENAI_API_KEY}` } }
      );
      aiSummary = response.data.choices[0].message.content;
    } catch (err) {
      // AI optional — continue without it
    }
  }

  // 4. Save report
  const reportData = {
    student_name: data.name,
    institute_name: data.institute_name,
    month, year,
    attendance: { ...att, total: totalDays, percentage: attPct },
    marks: marks.rows,
    avg_marks_pct: avgMarks,
  };

  const reportResult = await pool.query(
    `INSERT INTO reports(institute_id,student_id,report_type,period_start,period_end,content,summary_text)
     VALUES($1,$2,'monthly',
            TO_DATE($3||'/'||$4, 'MM/YYYY'),
            (TO_DATE($3||'/'||$4, 'MM/YYYY') + INTERVAL '1 month - 1 day')::date,
            $5,$6)
     ON CONFLICT DO NOTHING RETURNING *`,
    [instituteId, studentId, month, year, JSON.stringify(reportData), aiSummary]
  );

  return { report: reportData, summary: aiSummary };
};
```

---

## PHASE 10 — PRODUCTION HARDENING (4-5 DAYS)

### Step 10.1 — Security Checklist

```javascript
// Add to app.js — additional security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

// Input sanitization (add package: npm i express-mongo-sanitize)
// For SQL injection: pg parameterized queries already protect you — DO NOT use string concatenation in queries.
```

### Step 10.2 — Graceful Shutdown

Add to `server.js`:
```javascript
process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    pool.end();
    process.exit(0);
  });
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled Rejection:', reason);
});
```

### Step 10.3 — API Response Caching (Simple)

For the dashboard stats endpoint (called on every load):
```javascript
// Simple in-memory cache — good for single instance
const cache = new Map();

exports.cached = (ttlSeconds) => (req, res, next) => {
  const key = `${req.user.institute_id}:${req.path}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.ts < ttlSeconds * 1000) {
    return res.json(cached.data);
  }
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    cache.set(key, { data, ts: Date.now() });
    return originalJson(data);
  };
  next();
};
```

### Step 10.4 — Production `package.json` Scripts
```json
{
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js",
    "migrate": "node src/shared/db/migrate.js",
    "migrate:rollback": "node src/shared/db/rollback.js"
  }
}
```

---

## 17. DEPLOYMENT GUIDE

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect GitHub repo → select `/server` as root dir
4. Build command: `npm install && npm run migrate`
5. Start command: `npm start`
6. Add all environment variables from `.env`
7. Select region: Singapore (closest to India)

### Frontend → Hostinger

1. Run `npm run build` in `/client`
2. Upload `/dist` folder to Hostinger via File Manager
3. Set custom domain (e.g. app.coachops.in)
4. Add `.htaccess` for React Router:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### Biometric Sync Service → Institute PC
```bash
# Install as Windows Service (optional)
npm install -g node-windows
# OR simply run in background:
start /B node index.js
```

---

## 18. POSTGRESQL HOSTING OPTIONS & COST

| Provider | Free Tier | Paid Starts At | Best For | Notes |
|---|---|---|---|---|
| **Neon** (Recommended) | 0.5 GB, 1 project | $19/mo (10 GB) | Dev + small prod | Serverless, auto-pause, branches |
| **Render** | 1 GB, 90-day limit | $7/mo (1 GB) | Simple prod | Co-located with your API |
| **Supabase** | 500 MB, 2 projects | $25/mo (8 GB) | Extras (Auth/Storage) | Also gives REST/realtime |
| **Railway** | $5 credit/mo | $5+/mo | Quick setup | Good DX |
| **AWS RDS** | 12 months free (t2.micro) | ~$15-25/mo | Enterprise scale | Most reliable, most complex |

### Recommendation for You
- **Development**: Neon free tier (no credit card needed)
- **First 5 customers**: Render $7/mo (simple, co-located)
- **Scale (20+ institutes)**: Neon Pro $19/mo or AWS RDS

---

## 19. CLIENT PRICING STRATEGY

### Your Operating Costs (Monthly)
```
Render (backend): $7 (starter)
Neon/Render DB:   $7
Hostinger:        ~₹200 (existing)
Twilio WhatsApp:  ₹0.70/message × avg 200 msgs = ₹140
OpenAI API:       ~₹200 (light usage)
─────────────────────────────────
Total cost/inst:  ~₹1,200/month
```

### Recommended Pricing Tiers

| Plan | Target | Price | Features |
|---|---|---|---|
| **Starter** | 1-2 batches, <60 students | ₹999/month | Attendance + Reports + 1 Teacher |
| **Growth** | 3-8 batches, <250 students | ₹1,999/month | + WhatsApp alerts + 3 Teachers + AI reports |
| **Pro** | 8-20 batches, unlimited | ₹3,499/month | + All teachers + Priority support + API access |
| **Enterprise** | Large chain institutes | Custom (₹5,000+) | Multi-branch, custom integrations |

### Unit Economics (At Scale)
```
10 Growth customers × ₹1,999    = ₹19,990/month revenue
Infrastructure (10 customers)    = ~₹3,000/month
─────────────────────────────────────────────────────
Net margin                       = ~₹16,990/month (~85%)
```

### Pricing Justification for Clients
- Replaces: ₹2,000-3,000/month Excel admin salary
- Saves: 10+ hours/week of manual attendance work
- Reduces: Parent complaint calls (automated alerts)
- Value: ₹15,000-20,000/month in time saved → you charge ₹1,999-3,499

---

## 20. COMPLEXITY & TIMELINE ANALYSIS

### Complexity Breakdown

| Module | Backend Complexity | Frontend Complexity | Risk |
|---|---|---|---|
| Auth + Multi-tenancy | High | Medium | Low |
| Student/Batch CRUD | Low | Medium | Low |
| Biometric Integration | **Very High** | Low | **High** |
| Attendance Engine | Medium | Medium | Medium |
| Communication (WhatsApp) | Medium | Low | Medium |
| Analytics/Charts | Medium | **High** | Low |
| AI Reports | Medium | Medium | Low |
| Multi-portal (Admin/Teacher/Parent) | Low | **High** | Medium |

### Timeline Estimate (Solo Developer)

| Phase | Work | Days |
|---|---|---|
| Phase 0 | Setup + DB schema | 2-3 |
| Phase 1 | Backend foundation + Auth | 5-7 |
| Phase 2 | Students + Batches CRUD | 5-7 |
| Phase 3 | Biometric sync service | 5-7 |
| Phase 4 | Attendance engine | 3-4 |
| Phase 5 | Frontend foundation + Redux | 5-7 |
| Phase 6 | Admin Dashboard UI | 5-7 |
| Phase 7 | Teacher + Parent portals | 4-5 |
| Phase 8 | Communication (WhatsApp + Email) | 4-5 |
| Phase 9 | Analytics + AI Reports | 5-7 |
| Phase 10 | Production hardening + Deploy | 4-5 |
| **TOTAL** | | **~55-70 days** |

**Realistic Timeline: 2.5 to 3.5 months** (working 5-6 days/week, 6-8 hours/day)

**If part-time (student + project)**: 4-5 months

### Biggest Risk: Biometric Device
The biometric integration depends heavily on your exact BioMax model.
- If device supports ZKTeco TCP protocol (most do): ~5 days
- If device only has Windows SDK: Add 3-5 days for Electron wrapper
- **Action**: Before starting Phase 3, verify your device model and test TCP connection.

---

## 21. INTEGRATION CHECKLIST

Use this as a running verification list during development.

### Backend Integration Points
- [ ] Biometric sync service can connect to device via TCP/IP
- [ ] Biometric sync service can reach backend API from local network
- [ ] Attendance UNIQUE constraint prevents duplicates
- [ ] JWT refresh flow works (access expires, refresh renews)
- [ ] Institute isolation — users cannot query other institute data
- [ ] WhatsApp number in E.164 format (+91xxxxxxxxxx)
- [ ] Notification cron runs correctly in production timezone
- [ ] All DB queries use parameterized inputs (no SQL injection risk)
- [ ] Migrations run in order without conflicts

### Frontend Integration Points
- [ ] RTK Query cache invalidation after mutations (tagTypes)
- [ ] Role-based route guards prevent unauthorized access
- [ ] Token stored in localStorage + sent in every request header
- [ ] Token refresh on 401 response (interceptor)
- [ ] Loading/error states handled on all async pages
- [ ] Forms use react-hook-form + Zod for validation
- [ ] Parent portal is fully mobile-responsive

### Deployment Verification
- [ ] Environment variables set on Render (not committed to Git)
- [ ] CORS origin set to production frontend URL
- [ ] Database SSL enabled on Render/Neon
- [ ] Biometric sync service configured with production API URL
- [ ] Rate limiting active on auth endpoints
- [ ] Error logger not exposing stack traces to client in production

---

## APPENDIX: API REFERENCE

```
AUTH
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me

INSTITUTES
GET    /api/v1/institutes/:id
PUT    /api/v1/institutes/:id
GET    /api/v1/institutes/:id/stats

BATCHES
POST   /api/v1/batches
GET    /api/v1/batches
GET    /api/v1/batches/:id
GET    /api/v1/batches/:id/students
PUT    /api/v1/batches/:id
DELETE /api/v1/batches/:id

STUDENTS
POST   /api/v1/students
GET    /api/v1/students
GET    /api/v1/students/:id
PUT    /api/v1/students/:id
DELETE /api/v1/students/:id
POST   /api/v1/students/:id/enroll

BIOMETRIC
POST   /api/v1/biometric/sync          ← Device auth
POST   /api/v1/biometric/devices
GET    /api/v1/biometric/devices
POST   /api/v1/biometric/mappings
GET    /api/v1/biometric/mappings
DELETE /api/v1/biometric/mappings/:id

ATTENDANCE
POST   /api/v1/attendance/manual
GET    /api/v1/attendance/batch/:batchId?date=YYYY-MM-DD
GET    /api/v1/attendance/student/:studentId/summary
GET    /api/v1/attendance/daily?date=YYYY-MM-DD
GET    /api/v1/attendance/low?threshold=75

TESTS
POST   /api/v1/tests
GET    /api/v1/tests?batch_id=
GET    /api/v1/tests/:id
POST   /api/v1/tests/:id/results
GET    /api/v1/tests/:id/results

ANALYTICS
GET    /api/v1/analytics/dashboard
GET    /api/v1/analytics/batch/:id/performance
GET    /api/v1/analytics/weak-students

REPORTS
POST   /api/v1/reports/generate/student/:id
GET    /api/v1/reports/student/:id
POST   /api/v1/reports/send-monthly

NOTIFICATIONS
GET    /api/v1/notifications
POST   /api/v1/notifications/send
GET    /api/v1/notifications/templates
POST   /api/v1/notifications/templates
```

---

*End of CoachOps Master Implementation Guide*
*Version 1.0 | Generated for solo fullstack developer*
*Stack: React · Redux Toolkit · Node.js · Express · PostgreSQL*
