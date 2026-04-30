CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE refresh_tokens
  ADD COLUMN IF NOT EXISTS token_hash TEXT;

ALTER TABLE refresh_tokens
  ALTER COLUMN token DROP NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_refresh_tokens_token_hash ON refresh_tokens(token_hash);

DO $$
DECLARE
  demo_institute_id UUID;
BEGIN
  SELECT id
    INTO demo_institute_id
    FROM institutes
   WHERE name = 'CoachPro Demo Institute'
   ORDER BY created_at DESC
   LIMIT 1;

  IF demo_institute_id IS NULL THEN
    INSERT INTO institutes (name, address, email, plan)
    VALUES ('CoachPro Demo Institute', 'Demo Campus', 'demo@coachpro.local', 'starter')
    RETURNING id INTO demo_institute_id;
  END IF;

  INSERT INTO users (institute_id, name, email, phone, password_hash, role)
  VALUES
    (NULL, 'System Admin', 'admin@coachpro.local', NULL, crypt('Coach@1234', gen_salt('bf', 12)), 'super_admin'),
    (demo_institute_id, 'Demo Owner', 'owner@coachpro.local', NULL, crypt('Coach@1234', gen_salt('bf', 12)), 'owner'),
    (demo_institute_id, 'Demo Teacher', 'teacher@coachpro.local', NULL, crypt('Coach@1234', gen_salt('bf', 12)), 'teacher'),
    (demo_institute_id, 'Demo Parent', 'parent@coachpro.local', NULL, crypt('Coach@1234', gen_salt('bf', 12)), 'parent'),
    (demo_institute_id, 'Demo Student', 'student@coachpro.local', NULL, crypt('Coach@1234', gen_salt('bf', 12)), 'student')
  ON CONFLICT (email) DO NOTHING;
END $$;