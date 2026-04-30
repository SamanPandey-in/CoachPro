const pool = require('../../shared/db/pool');
const { paginateMeta } = require('../../shared/utils/pagination');

exports.create = async (instituteId, data) => {
  const result = await pool.query(
    `INSERT INTO tests (institute_id, batch_id, title, subject_id, test_date, max_marks, passing_marks, type)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [
      instituteId,
      data.batch_id,
      data.title,
      data.subject_id || null,
      data.test_date,
      data.max_marks || 100,
      data.passing_marks || null,
      data.type || 'test',
    ]
  );
  return result.rows[0];
};

exports.getAll = async (instituteId, { batch_id, page = 1, limit = 20 }) => {
  const offset = (Number(page) - 1) * Number(limit);
  const params = [instituteId];
  let whereClause = 'WHERE t.institute_id = $1';

  if (batch_id) {
    params.push(batch_id);
    whereClause += ` AND t.batch_id = $${params.length}`;
  }

  const rows = await pool.query(
    `SELECT t.*, b.name AS batch_name, s.name AS subject_name,
            COUNT(r.id)::int AS results_count
     FROM tests t
     JOIN batches b ON b.id = t.batch_id
     LEFT JOIN subjects s ON s.id = t.subject_id
     LEFT JOIN results r ON r.test_id = t.id
     ${whereClause}
     GROUP BY t.id, b.name, s.name
     ORDER BY t.test_date DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, Number(limit), offset]
  );

  const count = await pool.query(`SELECT COUNT(*)::int AS count FROM tests t ${whereClause}`, params);

  return { data: rows.rows, meta: paginateMeta(count.rows[0].count, page, limit) };
};

exports.getById = async (instituteId, id) => {
  const result = await pool.query(
    `SELECT t.*, b.name AS batch_name, s.name AS subject_name
     FROM tests t
     JOIN batches b ON b.id = t.batch_id
     LEFT JOIN subjects s ON s.id = t.subject_id
     WHERE t.id = $1 AND t.institute_id = $2`,
    [id, instituteId]
  );
  return result.rows[0] || null;
};

exports.addResults = async (instituteId, testId, results) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const saved = [];

    for (const resultRow of results) {
      const inserted = await client.query(
        `INSERT INTO results (institute_id, test_id, student_id, marks_obtained, is_absent, remarks, entered_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (test_id, student_id)
         DO UPDATE SET marks_obtained = EXCLUDED.marks_obtained,
                       is_absent = EXCLUDED.is_absent,
                       remarks = EXCLUDED.remarks,
                       entered_by = EXCLUDED.entered_by
         RETURNING *`,
        [
          instituteId,
          testId,
          resultRow.student_id,
          resultRow.marks_obtained ?? null,
          Boolean(resultRow.is_absent),
          resultRow.remarks || null,
          resultRow.entered_by || null,
        ]
      );
      saved.push(inserted.rows[0]);
    }

    await client.query('COMMIT');
    return saved;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.getResults = async (instituteId, testId) => {
  const result = await pool.query(
    `SELECT r.*, s.name AS student_name
     FROM results r
     JOIN students s ON s.id = r.student_id
     WHERE r.test_id = $1 AND r.institute_id = $2
     ORDER BY s.name`,
    [testId, instituteId]
  );
  return result.rows;
};