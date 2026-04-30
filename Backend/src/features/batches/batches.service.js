const pool = require('../../shared/db/pool');
const paginateMeta = (total, page, limit) => ({ total: parseInt(total), page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) });

exports.create = async (instituteId, data) => {
  const { name, subject_id, teacher_id, schedule, room, max_strength } = data;
  const result = await pool.query(
    `INSERT INTO batches(institute_id,name,subject_id,teacher_id,schedule,room,max_strength)
     VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [instituteId, name, subject_id || null, teacher_id || null, schedule ? JSON.stringify(schedule) : null, room, max_strength || 60]
  );
  return result.rows[0];
};

exports.getAll = async (instituteId, { page = 1, limit = 20, search } = {}) => {
  const offset = (page - 1) * limit;
  const params = [instituteId];
  let where = 'WHERE b.institute_id = $1 AND b.is_active = TRUE';
  if (search) { params.push(`%${search}%`); where += ` AND b.name ILIKE $${params.length}`; }

  const query = `SELECT b.*, u.name as teacher_name, s.name as subject_name FROM batches b LEFT JOIN users u ON b.teacher_id = u.id LEFT JOIN subjects s ON b.subject_id = s.id ${where} ORDER BY b.created_at DESC LIMIT $${params.length+1} OFFSET $${params.length+2}`;
  const rows = await pool.query(query, [...params, limit, offset]);
  const countResult = await pool.query('SELECT COUNT(*) FROM batches WHERE institute_id=$1 AND is_active=TRUE', [instituteId]);
  return { data: rows.rows, meta: paginateMeta(countResult.rows[0].count, page, limit) };
};

exports.getById = async (instituteId, id) => {
  const result = await pool.query('SELECT b.*, u.name as teacher_name FROM batches b LEFT JOIN users u ON b.teacher_id = u.id WHERE b.id = $1 AND b.institute_id = $2', [id, instituteId]);
  return result.rows[0];
};

exports.update = async (instituteId, id, data) => {
  const { name, subject_id, teacher_id, schedule, room, max_strength } = data;
  const result = await pool.query(
    `UPDATE batches SET name=$1,subject_id=$2,teacher_id=$3,schedule=$4,room=$5,max_strength=$6,updated_at=NOW()
     WHERE id=$7 AND institute_id=$8 RETURNING *`,
    [name, subject_id, teacher_id, schedule ? JSON.stringify(schedule) : null, room, max_strength, id, instituteId]
  );
  return result.rows[0];
};

exports.delete = async (instituteId, id) => {
  await pool.query('UPDATE batches SET is_active=FALSE WHERE id=$1 AND institute_id=$2', [id, instituteId]);
};

exports.getStudents = async (instituteId, batchId) => {
  const result = await pool.query(
    `SELECT s.*, be.enrolled_at FROM students s JOIN batch_enrollments be ON s.id = be.student_id WHERE be.batch_id = $1 AND s.institute_id = $2 AND be.is_active = TRUE ORDER BY s.name`,
    [batchId, instituteId]
  );
  return result.rows;
};
