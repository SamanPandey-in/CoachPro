const pool = require('../../shared/db/pool');
const paginateMeta = (total, page, limit) => ({ total: parseInt(total), page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) });

exports.create = async (instituteId, data) => {
  const { name, dob, gender, phone, email, address, enrollment_no, batch_id, parent } = data;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const studentResult = await client.query(
      `INSERT INTO students(institute_id,name,dob,gender,phone,email,address,enrollment_no)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [instituteId, name, dob || null, gender || null, phone, email, address, enrollment_no]
    );
    const student = studentResult.rows[0];
    if (batch_id) {
      await client.query('INSERT INTO batch_enrollments(batch_id, student_id) VALUES($1,$2)', [batch_id, student.id]);
    }
    if (parent?.name && parent?.phone) {
      const parentResult = await client.query(
        `INSERT INTO parents(institute_id, name, phone, email, relation) VALUES($1,$2,$3,$4,$5) RETURNING id`,
        [instituteId, parent.name, parent.phone, parent.email || null, parent.relation || 'parent']
      );
      await client.query('INSERT INTO student_parents(student_id, parent_id) VALUES($1,$2)', [student.id, parentResult.rows[0].id]);
    }
    await client.query('COMMIT');
    return student;
  } catch (err) { await client.query('ROLLBACK'); throw err; } finally { client.release(); }
};

exports.getAll = async (instituteId, { page = 1, limit = 20, search, batch_id } = {}) => {
  const offset = (page - 1) * limit;
  const params = [instituteId];
  let where = 'WHERE s.institute_id = $1 AND s.is_active = TRUE';
  if (search) { params.push(`%${search}%`); where += ` AND (s.name ILIKE $${params.length} OR s.phone ILIKE $${params.length})`; }
  if (batch_id) { params.push(batch_id); where += ` AND be.batch_id = $${params.length} AND be.is_active = TRUE`; }

  const query = `SELECT DISTINCT s.*, p.name as parent_name, p.phone as parent_phone, array_agg(b.name) FILTER (WHERE b.id IS NOT NULL) as batch_names FROM students s LEFT JOIN student_parents sp ON s.id = sp.student_id LEFT JOIN parents p ON sp.parent_id = p.id AND sp.is_primary = TRUE LEFT JOIN batch_enrollments be ON s.id = be.student_id AND be.is_active = TRUE LEFT JOIN batches b ON be.batch_id = b.id ${where} GROUP BY s.id, p.name, p.phone ORDER BY s.name LIMIT $${params.length+1} OFFSET $${params.length+2}`;
  const countQuery = `SELECT COUNT(DISTINCT s.id) FROM students s LEFT JOIN batch_enrollments be ON s.id = be.student_id AND be.is_active = TRUE ${where}`;
  const [rows, countResult] = await Promise.all([ pool.query(query, [...params, limit, offset]), pool.query(countQuery, params) ]);
  return { data: rows.rows, meta: paginateMeta(countResult.rows[0].count, page, limit) };
};

exports.getById = async (instituteId, id) => {
  const [student, parents, batches, recentAttendance] = await Promise.all([
    pool.query('SELECT * FROM students WHERE id=$1 AND institute_id=$2', [id, instituteId]),
    pool.query(`SELECT p.* FROM parents p JOIN student_parents sp ON p.id = sp.parent_id WHERE sp.student_id = $1`, [id]),
    pool.query(`SELECT b.*, be.enrolled_at FROM batches b JOIN batch_enrollments be ON b.id = be.batch_id WHERE be.student_id = $1 AND be.is_active = TRUE`, [id]),
    pool.query(`SELECT date, status FROM attendance WHERE student_id = $1 ORDER BY date DESC LIMIT 30`, [id]),
  ]);
  if (!student.rows[0]) return null;
  return { ...student.rows[0], parents: parents.rows, batches: batches.rows, recent_attendance: recentAttendance.rows };
};

exports.update = async (instituteId, id, data) => {
  const { name, dob, gender, phone, email, address, enrollment_no } = data;
  const result = await pool.query(`UPDATE students SET name=$1,dob=$2,gender=$3,phone=$4,email=$5,address=$6,enrollment_no=$7,updated_at=NOW() WHERE id=$8 AND institute_id=$9 RETURNING *`, [name, dob, gender, phone, email, address, enrollment_no, id, instituteId]);
  return result.rows[0];
};

exports.delete = async (instituteId, id) => {
  await pool.query('UPDATE students SET is_active=FALSE WHERE id=$1 AND institute_id=$2', [id, instituteId]);
};

exports.enrollBatch = async (instituteId, studentId, batchId) => {
  const student = await pool.query('SELECT id FROM students WHERE id=$1 AND institute_id=$2', [studentId, instituteId]);
  if (!student.rows.length) throw { status: 404, message: 'Student not found' };
  await pool.query(`INSERT INTO batch_enrollments(batch_id, student_id) VALUES($1,$2) ON CONFLICT(batch_id, student_id) DO UPDATE SET is_active=TRUE, enrolled_at=CURRENT_DATE`, [batchId, studentId]);
};
