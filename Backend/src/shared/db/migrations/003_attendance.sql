-- migrations/003_attendance.sql

CREATE TABLE IF NOT EXISTS biometric_devices (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    device_name     TEXT NOT NULL,
    device_serial   TEXT UNIQUE,
    location        TEXT,
    api_key         TEXT NOT NULL UNIQUE,
    last_sync_at    TIMESTAMPTZ,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS biometric_mappings (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    device_id       UUID NOT NULL REFERENCES biometric_devices(id),
    device_user_id  TEXT NOT NULL,
    student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    enrolled_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(device_id, device_user_id)
);

CREATE TABLE IF NOT EXISTS biometric_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id       UUID NOT NULL REFERENCES biometric_devices(id),
    device_user_id  TEXT NOT NULL,
    raw_timestamp   TIMESTAMPTZ NOT NULL,
    processed       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attendance (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    student_id      UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    batch_id        UUID REFERENCES batches(id),
    date            DATE NOT NULL,
    status          TEXT NOT NULL,
    source          TEXT NOT NULL DEFAULT 'biometric',
    marked_by       UUID REFERENCES users(id),
    biometric_log_id UUID REFERENCES biometric_logs(id),
    notes           TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, batch_id, date)
);

CREATE INDEX IF NOT EXISTS idx_attendance_institute_date ON attendance(institute_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_batch ON attendance(batch_id);
