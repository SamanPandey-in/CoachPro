-- =============================================================
-- USEFUL POSTGRESQL VIEWS
-- =============================================================

-- Student overview: name, batch, course, rank, avg score, attendance %
CREATE OR REPLACE VIEW student_overview AS
SELECT
  s.id AS student_id,
  p.name,
  p.email,
  p.phone,
  s.roll_number,
  b.name AS batch,
  b.course,
  s.admission_date,
  ROUND(AVG(tr.marks), 1) AS avg_score,
  COUNT(tr.id) AS tests_taken,
  ROUND(
    100.0 * SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END)
    / NULLIF(COUNT(a.id), 0), 1
  ) AS attendance_pct,
  RANK() OVER (PARTITION BY s.batch_id ORDER BY AVG(tr.marks) DESC) AS batch_rank
FROM students s
JOIN profiles p ON p.id = s.profile_id
LEFT JOIN batches b ON b.id = s.batch_id
LEFT JOIN test_results tr ON tr.student_id = s.id AND tr.is_absent = false
LEFT JOIN attendance a ON a.student_id = s.id
WHERE s.is_active = true
GROUP BY s.id, p.name, p.email, p.phone, s.roll_number, b.name, b.course, s.admission_date, s.batch_id;

-- Today's attendance summary by batch
CREATE OR REPLACE VIEW today_attendance_summary AS
SELECT
  b.name AS batch,
  COUNT(s.id) AS total,
  SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS present,
  SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS absent,
  SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) AS late
FROM students s
JOIN batches b ON b.id = s.batch_id
LEFT JOIN attendance a ON a.student_id = s.id AND a.date = CURRENT_DATE
WHERE s.is_active = true
GROUP BY b.name;

-- Teacher load: lectures per week, student count, subjects
CREATE OR REPLACE VIEW teacher_load AS
SELECT
  t.id AS teacher_id,
  p.name,
  p.email,
  t.employee_id,
  t.subject,
  t.experience_yrs,
  COUNT(DISTINCT l.id) AS weekly_lectures,
  COUNT(DISTINCT s.id) AS student_count
FROM teachers t
JOIN profiles p ON p.id = t.profile_id
LEFT JOIN lectures l ON l.teacher_id = t.id AND l.is_active = true
LEFT JOIN subjects sub ON sub.teacher_id = t.id
LEFT JOIN students s ON s.batch_id = sub.batch_id
WHERE t.is_active = true
GROUP BY t.id, p.name, p.email, t.employee_id, t.subject, t.experience_yrs;
