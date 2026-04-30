-- migrations/005_notifications.sql

CREATE TABLE IF NOT EXISTS notification_templates (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    channel         TEXT NOT NULL,
    event_type      TEXT NOT NULL,
    template_body   TEXT NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notification_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID NOT NULL REFERENCES institutes(id) ON DELETE CASCADE,
    recipient_id    UUID REFERENCES users(id),
    channel         TEXT NOT NULL,
    event_type      TEXT,
    recipient_phone TEXT,
    recipient_email TEXT,
    content         TEXT,
    status          TEXT NOT NULL DEFAULT 'pending',
    error_message   TEXT,
    sent_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    institute_id    UUID REFERENCES institutes(id),
    user_id         UUID REFERENCES users(id),
    action          TEXT NOT NULL,
    entity_type     TEXT,
    entity_id       UUID,
    old_value       JSONB,
    new_value       JSONB,
    ip_address      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
