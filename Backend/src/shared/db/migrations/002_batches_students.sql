-- migrations/002_batches_students.sql

CREATE TABLE IF NOT EXISTS subjects (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS batches (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    subject_id      UUID REFERENCES subjects(id),
    teacher_id      UUID REFERENCES users(id),
    schedule        JSONB,
    room            TEXT,
    max_strength    INT DEFAULT 60,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_batches_institute ON batches(institute_id);
CREATE INDEX IF NOT EXISTS idx_batches_teacher ON batches(teacher_id);

CREATE TABLE IF NOT EXISTS students (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),
    name            TEXT NOT NULL,
    dob             DATE,
    gender          TEXT,
    phone           TEXT,
    email           TEXT,
    address         TEXT,
    enrollment_no   TEXT,
    enrolled_at     DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_students_institute ON students(institute_id);

CREATE TABLE IF NOT EXISTS parents (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id),
    name            TEXT NOT NULL,
    phone           TEXT NOT NULL,
    email           TEXT,
    relation        TEXT DEFAULT 'parent',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_parents (
    student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    parent_id       UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    is_primary      BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (student_id, parent_id)
);

CREATE TABLE IF NOT EXISTS batch_enrollments (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    batch_id        UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    enrolled_at     DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(batch_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_batch ON batch_enrollments(batch_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON batch_enrollments(student_id);
