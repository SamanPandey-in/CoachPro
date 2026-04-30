const pool = require('../../shared/db/pool');

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

exports.getBatchAttendance = async (instituteId, batchId, date) => {
  const result = await pool.query(
    `SELECT s.id, s.name, s.phone, a.status, a.source, a.created_at as marked_at
     FROM students s
     JOIN batch_enrollments be ON s.id = be.student_id
     LEFT JOIN attendance a ON a.student_id = s.id AND a.batch_id = $2 AND a.date = $3
     WHERE be.batch_id = $2 AND be.is_active = TRUE AND s.institute_id = $1
     ORDER BY s.name`,
    [instituteId, batchId, date]
  );
  return result.rows;
};

exports.getStudentSummary = async (studentId, batchId, month, year) => {
  const result = await pool.query(
    `SELECT date, status, source FROM attendance WHERE student_id=$1 AND ($2::uuid IS NULL OR batch_id=$2) AND EXTRACT(MONTH FROM date)=$3 AND EXTRACT(YEAR FROM date)=$4 ORDER BY date`,
    [studentId, batchId || null, month, year]
  );
  const total = result.rows.length;
  const present = result.rows.filter(r => r.status === 'present').length;
  const absent = result.rows.filter(r => r.status === 'absent').length;
  return { records: result.rows, summary: { total_days: total, present_days: present, absent_days: absent, percentage: total > 0 ? Math.round((present / total) * 100) : 0 } };
};

exports.getDailyOverview = async (instituteId, date) => {
  const result = await pool.query(
    `SELECT COUNT(DISTINCT be.student_id) FILTER (WHERE a.status = 'present') as present_count,
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

exports.getLowAttendanceStudents = async (instituteId, threshold = 75, days = 30) => {
  const result = await pool.query(
    `WITH student_attendance AS (
       SELECT s.id, s.name, s.phone,
         COUNT(a.id) FILTER (WHERE a.status = 'present') as present_days,
         COUNT(a.id) as total_days
       FROM students s
       JOIN batch_enrollments be ON s.id = be.student_id AND be.is_active = TRUE
       LEFT JOIN attendance a ON a.student_id = s.id AND a.date >= CURRENT_DATE - INTERVAL '${days} days'
       WHERE s.institute_id = $1 AND s.is_active = TRUE
       GROUP BY s.id, s.name, s.phone
     )
     SELECT *, CASE WHEN total_days > 0 THEN ROUND((present_days::numeric / total_days) * 100, 1) ELSE 0 END as attendance_pct
     FROM student_attendance
     WHERE total_days > 0 AND (present_days::numeric / total_days * 100) < $2
     ORDER BY attendance_pct`,
    [instituteId, threshold]
  );
  return result.rows;
};
