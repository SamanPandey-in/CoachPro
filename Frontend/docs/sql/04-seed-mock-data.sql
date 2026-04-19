-- =============================================================
-- CoachPro Smoke Seed Data
-- Safe to run multiple times (idempotent patterns where possible)
-- =============================================================

BEGIN;

-- 1) Batch
INSERT INTO batches (name, course, start_date, end_date)
VALUES ('Smoke Batch 2026', 'Smoke Verification Course', '2026-04-01', '2026-12-31')
ON CONFLICT (name) DO UPDATE SET
  course = EXCLUDED.course,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date;

-- 2) Subjects for the batch
WITH b AS (
  SELECT id FROM batches WHERE name = 'Smoke Batch 2026' LIMIT 1
)
INSERT INTO subjects (name, batch_id, teacher_id)
SELECT s.name, b.id, NULL
FROM b
CROSS JOIN (VALUES ('Smoke Mathematics'), ('Smoke Physics')) AS s(name)
ON CONFLICT (name, batch_id) DO NOTHING;

-- 3) One test per subject
WITH b AS (
  SELECT id FROM batches WHERE name = 'Smoke Batch 2026' LIMIT 1
), sub AS (
  SELECT id, name, batch_id FROM subjects
  WHERE batch_id = (SELECT id FROM b)
    AND name IN ('Smoke Mathematics', 'Smoke Physics')
)
INSERT INTO tests (title, subject_id, batch_id, test_date, max_marks, conducted_by)
SELECT
  'Smoke Test - ' || sub.name,
  sub.id,
  sub.batch_id,
  CURRENT_DATE,
  100,
  NULL
FROM sub
WHERE NOT EXISTS (
  SELECT 1
  FROM tests t
  WHERE t.title = 'Smoke Test - ' || sub.name
    AND t.batch_id = sub.batch_id
);

-- 4) Broadcast notification
INSERT INTO notifications (title, body, sent_by, target_role, target_batch_id)
SELECT
  'Smoke Verification Notification',
  'Seeded via SQL to validate notifications and dashboard feeds.',
  NULL,
  NULL,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM notifications WHERE title = 'Smoke Verification Notification'
);

-- 5) Optional marks seed (only when at least 1 student exists in this batch)
WITH b AS (
  SELECT id FROM batches WHERE name = 'Smoke Batch 2026' LIMIT 1
),
st AS (
  SELECT id FROM students WHERE batch_id = (SELECT id FROM b) ORDER BY id LIMIT 20
),
tt AS (
  SELECT id FROM tests WHERE batch_id = (SELECT id FROM b)
)
INSERT INTO test_results (test_id, student_id, marks, is_absent, uploaded_by)
SELECT
  tt.id,
  st.id,
  60 + ((st.id + tt.id) % 41),
  false,
  NULL
FROM st
CROSS JOIN tt
ON CONFLICT (test_id, student_id) DO NOTHING;

COMMIT;

-- Quick verification queries:
-- SELECT * FROM batches WHERE name = 'Smoke Batch 2026';
-- SELECT * FROM subjects WHERE name LIKE 'Smoke %';
-- SELECT * FROM tests WHERE title LIKE 'Smoke Test - %';
-- SELECT * FROM notifications WHERE title = 'Smoke Verification Notification';
-- SELECT count(*) FROM test_results tr JOIN tests t ON t.id = tr.test_id WHERE t.title LIKE 'Smoke Test - %';
