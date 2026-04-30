const pool = require('../../shared/db/pool');

exports.getDashboardStats = async (instituteId) => {
  const today = new Date().toISOString().split('T')[0];

  const [students, batches, teachers, presentToday, attendanceTrend] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS count FROM students WHERE institute_id = $1 AND is_active = TRUE', [instituteId]),
    pool.query('SELECT COUNT(*)::int AS count FROM batches WHERE institute_id = $1 AND is_active = TRUE', [instituteId]),
    pool.query("SELECT COUNT(*)::int AS count FROM users WHERE institute_id = $1 AND role = 'teacher' AND is_active = TRUE", [instituteId]),
    pool.query(
      `SELECT
         COUNT(*) FILTER (WHERE a.status = 'present')::int AS present_count,
         COUNT(*)::int AS total_count
       FROM attendance a
       WHERE a.institute_id = $1 AND a.date = $2`,
      [instituteId, today]
    ),
    pool.query(
      `SELECT date,
              COUNT(*) FILTER (WHERE status = 'present')::int AS present_count,
              COUNT(*)::int AS total_count
       FROM attendance
       WHERE institute_id = $1 AND date >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY date
       ORDER BY date ASC`,
      [instituteId]
    ),
  ]);

  const attendancePct = presentToday.rows[0].total_count > 0
    ? Math.round((presentToday.rows[0].present_count / presentToday.rows[0].total_count) * 100)
    : 0;

  return {
    total_students: students.rows[0].count,
    total_batches: batches.rows[0].count,
    total_teachers: teachers.rows[0].count,
    today_attendance_pct: attendancePct,
    attendance_trend: attendanceTrend.rows.map((row) => ({
      date: row.date,
      pct: row.total_count > 0 ? Math.round((row.present_count / row.total_count) * 100) : 0,
    })),
  };
};

exports.getBatchPerformance = async (instituteId, batchId) => {
  const result = await pool.query(
    `SELECT s.id, s.name,
            ROUND(AVG((r.marks_obtained / NULLIF(t.max_marks, 0)) * 100), 1) AS average_percentage,
            COUNT(r.id)::int AS tests_taken,
            COUNT(a.id) FILTER (WHERE a.status = 'present')::int AS present_days,
            COUNT(a.id)::int AS total_attendance_days
     FROM students s
     JOIN batch_enrollments be ON be.student_id = s.id AND be.batch_id = $2 AND be.is_active = TRUE
     LEFT JOIN results r ON r.student_id = s.id
     LEFT JOIN tests t ON t.id = r.test_id AND t.batch_id = $2
     LEFT JOIN attendance a ON a.student_id = s.id AND a.batch_id = $2
     WHERE s.institute_id = $1 AND s.is_active = TRUE
     GROUP BY s.id, s.name
     ORDER BY average_percentage DESC NULLS LAST, s.name ASC`,
    [instituteId, batchId]
  );

  return result.rows;
};

exports.getWeakStudents = async (instituteId) => {
  const result = await pool.query(
    `SELECT s.id, s.name,
            ROUND(COALESCE(AVG((r.marks_obtained / NULLIF(t.max_marks, 0)) * 100), 0), 1) AS average_marks,
            ROUND(COALESCE((COUNT(a.id) FILTER (WHERE a.status = 'present')::numeric / NULLIF(COUNT(a.id), 0)) * 100, 0), 1) AS attendance_pct
     FROM students s
     LEFT JOIN results r ON r.student_id = s.id
     LEFT JOIN tests t ON t.id = r.test_id
     LEFT JOIN attendance a ON a.student_id = s.id AND a.date >= CURRENT_DATE - INTERVAL '30 days'
     WHERE s.institute_id = $1 AND s.is_active = TRUE
     GROUP BY s.id, s.name
     HAVING COALESCE((COUNT(a.id) FILTER (WHERE a.status = 'present')::numeric / NULLIF(COUNT(a.id), 0)) * 100, 0) < 75
        OR COALESCE(AVG((r.marks_obtained / NULLIF(t.max_marks, 0)) * 100), 0) < 50
     ORDER BY s.name ASC`,
    [instituteId]
  );

  return result.rows;
};