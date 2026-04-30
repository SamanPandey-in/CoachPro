-- migrations/004_tests_reports.sql

CREATE TABLE IF NOT EXISTS tests (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    batch_id        UUID NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
    title           TEXT NOT NULL,
    subject_id      UUID REFERENCES subjects(id),
    test_date       DATE NOT NULL,
    max_marks       NUMERIC(6,2) NOT NULL DEFAULT 100,
    passing_marks   NUMERIC(6,2),
    type            TEXT DEFAULT 'test',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS results (
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

CREATE TABLE IF NOT EXISTS reports (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    student_id      UUID REFERENCES students(id),
    batch_id        UUID REFERENCES batches(id),
    report_type     TEXT NOT NULL,
    period_start    DATE,
    period_end      DATE,
    content         JSONB,
    summary_text    TEXT,
    generated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
