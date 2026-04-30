const pool = require('../../shared/db/pool');

exports.getById = async (id) => {
  const result = await pool.query('SELECT * FROM institutes WHERE id = $1', [id]);
  return result.rows[0] || null;
};

exports.update = async (id, data) => {
  const result = await pool.query(
    `UPDATE institutes
     SET name = $1,
         address = $2,
         phone = $3,
         email = $4,
         logo_url = $5,
         updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [data.name, data.address || null, data.phone || null, data.email || null, data.logo_url || null, id]
  );
  return result.rows[0] || null;
};

exports.getStats = async (instituteId) => {
  const [students, batches, teachers, parents, devices, tests, reports] = await Promise.all([
    pool.query('SELECT COUNT(*)::int AS count FROM students WHERE institute_id = $1 AND is_active = TRUE', [instituteId]),
    pool.query('SELECT COUNT(*)::int AS count FROM batches WHERE institute_id = $1 AND is_active = TRUE', [instituteId]),
    pool.query("SELECT COUNT(*)::int AS count FROM users WHERE institute_id = $1 AND role = 'teacher' AND is_active = TRUE", [instituteId]),
    pool.query("SELECT COUNT(*)::int AS count FROM users WHERE institute_id = $1 AND role = 'parent' AND is_active = TRUE", [instituteId]),
    pool.query('SELECT COUNT(*)::int AS count FROM biometric_devices WHERE institute_id = $1 AND is_active = TRUE', [instituteId]),
    pool.query('SELECT COUNT(*)::int AS count FROM tests WHERE institute_id = $1', [instituteId]),
    pool.query('SELECT COUNT(*)::int AS count FROM reports WHERE institute_id = $1', [instituteId]),
  ]);

  return {
    total_students: students.rows[0].count,
    total_batches: batches.rows[0].count,
    total_teachers: teachers.rows[0].count,
    total_parents: parents.rows[0].count,
    total_devices: devices.rows[0].count,
    total_tests: tests.rows[0].count,
    total_reports: reports.rows[0].count,
  };
};