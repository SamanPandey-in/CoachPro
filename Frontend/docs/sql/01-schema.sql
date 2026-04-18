-- =============================================================
-- ENUMS
-- =============================================================

CREATE TYPE user_role AS ENUM ('admin', 'teacher', 'student');
CREATE TYPE attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE assignment_status AS ENUM ('pending', 'submitted', 'graded', 'overdue');

-- =============================================================
-- PROFILES (extends Supabase auth.users)
-- =============================================================

CREATE TABLE profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  phone       TEXT,
  role        user_role NOT NULL DEFAULT 'student',
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- BATCHES
-- =============================================================

CREATE TABLE batches (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL UNIQUE,       -- e.g. 'Batch A', 'JEE 2025'
  course      TEXT NOT NULL,              -- e.g. 'JEE Advanced', 'NEET'
  start_date  DATE,
  end_date    DATE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- STUDENTS
-- =============================================================

CREATE TABLE students (
  id              SERIAL PRIMARY KEY,
  profile_id      UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  batch_id        INTEGER REFERENCES batches(id) ON DELETE SET NULL,
  roll_number     TEXT NOT NULL UNIQUE,
  date_of_birth   DATE,
  address         TEXT,
  parent_name     TEXT,
  parent_phone    TEXT,
  admission_date  DATE NOT NULL DEFAULT CURRENT_DATE,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- TEACHERS
-- =============================================================

CREATE TABLE teachers (
  id              SERIAL PRIMARY KEY,
  profile_id      UUID NOT NULL UNIQUE REFERENCES profiles(id) ON DELETE CASCADE,
  employee_id     TEXT NOT NULL UNIQUE,
  subject         TEXT NOT NULL,
  qualification   TEXT,
  experience_yrs  INTEGER DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- SUBJECTS
-- =============================================================

CREATE TABLE subjects (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,              -- e.g. 'Mathematics', 'Physics'
  batch_id    INTEGER REFERENCES batches(id) ON DELETE CASCADE,
  teacher_id  INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (name, batch_id)
);

-- =============================================================
-- ATTENDANCE
-- =============================================================

CREATE TABLE attendance (
  id          SERIAL PRIMARY KEY,
  student_id  INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  subject_id  INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
  date        DATE NOT NULL DEFAULT CURRENT_DATE,
  status      attendance_status NOT NULL DEFAULT 'present',
  marked_by   INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
  note        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (student_id, subject_id, date)
);

-- =============================================================
-- TESTS
-- =============================================================

CREATE TABLE tests (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  subject_id   INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  batch_id     INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  test_date    DATE NOT NULL,
  max_marks    INTEGER NOT NULL DEFAULT 100,
  conducted_by INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- TEST RESULTS (Marks)
-- =============================================================

CREATE TABLE test_results (
  id           SERIAL PRIMARY KEY,
  test_id      INTEGER NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
  student_id   INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  marks        NUMERIC(5,2),              -- NULL means not yet uploaded
  is_absent    BOOLEAN NOT NULL DEFAULT false,
  uploaded_by  INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
  uploaded_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (test_id, student_id)
);

-- =============================================================
-- ASSIGNMENTS
-- =============================================================

CREATE TABLE assignments (
  id           SERIAL PRIMARY KEY,
  title        TEXT NOT NULL,
  description  TEXT,
  subject_id   INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  batch_id     INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  due_date     TIMESTAMPTZ NOT NULL,
  created_by   INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE assignment_submissions (
  id              SERIAL PRIMARY KEY,
  assignment_id   INTEGER NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id      INTEGER NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  status          assignment_status NOT NULL DEFAULT 'pending',
  submission_url  TEXT,
  submitted_at    TIMESTAMPTZ,
  grade           NUMERIC(5,2),
  feedback        TEXT,
  graded_at       TIMESTAMPTZ,
  UNIQUE (assignment_id, student_id)
);

-- =============================================================
-- LECTURES / TIMETABLE
-- =============================================================

CREATE TABLE lectures (
  id           SERIAL PRIMARY KEY,
  subject_id   INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  teacher_id   INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  batch_id     INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  day_of_week  SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Mon
  start_time   TIME NOT NULL,
  end_time     TIME NOT NULL,
  room         TEXT,
  is_active    BOOLEAN NOT NULL DEFAULT true
);

-- =============================================================
-- NOTIFICATIONS
-- =============================================================

CREATE TABLE notifications (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  sent_by     UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_role user_role,              -- NULL = all roles
  target_batch_id INTEGER REFERENCES batches(id) ON DELETE SET NULL,
  is_read     BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =============================================================
-- INDEXES (performance)
-- =============================================================

CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_test_results_student ON test_results(student_id);
CREATE INDEX idx_test_results_test ON test_results(test_id);
CREATE INDEX idx_assignments_batch ON assignments(batch_id);
CREATE INDEX idx_lectures_batch ON lectures(batch_id);
CREATE INDEX idx_notifications_role ON notifications(target_role);

-- =============================================================
-- UPDATED_AT TRIGGER (auto-update profiles.updated_at)
-- =============================================================

CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE PROCEDURE handle_updated_at();

-- =============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =============================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE handle_new_user();
