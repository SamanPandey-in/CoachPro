const pool = require('../../shared/db/pool');
const notifications = require('../notifications/notifications.service');

exports.generateStudentReport = async (instituteId, studentId, month, year) => {
  const [studentResult, attendanceResult, resultsResult] = await Promise.all([
    pool.query(
      `SELECT s.id, s.name, s.email, i.name AS institute_name
       FROM students s
       JOIN institutes i ON i.id = s.institute_id
       WHERE s.id = $1 AND s.institute_id = $2`,
      [studentId, instituteId]
    ),
    pool.query(
      `SELECT status, COUNT(*)::int AS count
       FROM attendance
       WHERE student_id = $1
         AND EXTRACT(MONTH FROM date) = $2
         AND EXTRACT(YEAR FROM date) = $3
       GROUP BY status`,
      [studentId, month, year]
    ),
    pool.query(
      `SELECT t.title, t.max_marks, r.marks_obtained,
              ROUND((r.marks_obtained / NULLIF(t.max_marks, 0)) * 100, 1) AS percentage
       FROM results r
       JOIN tests t ON t.id = r.test_id
       WHERE r.student_id = $1
         AND EXTRACT(MONTH FROM t.test_date) = $2
         AND EXTRACT(YEAR FROM t.test_date) = $3
       ORDER BY t.test_date ASC`,
      [studentId, month, year]
    ),
  ]);

  const student = studentResult.rows[0];
  if (!student) {
    throw { status: 404, message: 'Student not found', code: 'NOT_FOUND' };
  }

  const attendance = attendanceResult.rows.reduce((accumulator, row) => {
    accumulator[row.status] = row.count;
    return accumulator;
  }, {});
  const totalDays = Object.values(attendance).reduce((sum, count) => sum + count, 0);
  const presentDays = attendance.present || 0;
  const attendancePct = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;
  const averageMarks = resultsResult.rows.length
    ? Math.round(resultsResult.rows.reduce((sum, row) => sum + Number(row.percentage || 0), 0) / resultsResult.rows.length)
    : null;

  const content = {
    student_name: student.name,
    institute_name: student.institute_name,
    month,
    year,
    attendance: {
      present: attendance.present || 0,
      absent: attendance.absent || 0,
      late: attendance.late || 0,
      total: totalDays,
      percentage: attendancePct,
    },
    results: resultsResult.rows,
    average_marks: averageMarks,
  };

  const summary = averageMarks === null
    ? `Attendance ${attendancePct}%. No test results recorded for this period.`
    : `Attendance ${attendancePct}%. Average marks ${averageMarks}%.`;

  await pool.query(
    `INSERT INTO reports (institute_id, student_id, report_type, period_start, period_end, content, summary_text)
     VALUES ($1, $2, 'monthly', TO_DATE($3 || '-' || $4 || '-01', 'YYYY-MM-DD'),
             (DATE_TRUNC('month', TO_DATE($3 || '-' || $4 || '-01', 'YYYY-MM-DD')) + INTERVAL '1 month - 1 day')::date,
             $5, $6)`,
    [instituteId, studentId, year, month, JSON.stringify(content), summary]
  );

  return { content, summary };
};

exports.getStudentReports = async (instituteId, studentId) => {
  const result = await pool.query(
    `SELECT *
     FROM reports
     WHERE institute_id = $1 AND student_id = $2
     ORDER BY generated_at DESC`,
    [instituteId, studentId]
  );
  return result.rows;
};

exports.sendMonthlyReport = async (instituteId, studentId, month, year) => {
  await notifications.sendMonthlyReport(instituteId, studentId, month, year);
  return { queued: true };
};