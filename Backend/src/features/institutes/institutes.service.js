const bcrypt = require('bcryptjs');
const XLSX = require('xlsx');
const pool = require('../../shared/db/pool');

const ALLOWED_USER_ROLES = new Set(['teacher', 'student']);

const normalizeRole = (role) => {
  const value = String(role || '').trim().toLowerCase();
  return ALLOWED_USER_ROLES.has(value) ? value : null;
};

const normalizeText = (value) => String(value || '').trim();

const normalizeEmail = (value) => normalizeText(value).toLowerCase();

const normalizeNamePart = (value) => normalizeText(value).toLowerCase().replace(/[^a-z0-9]+/g, '');

const splitName = (row = {}) => {
  const firstName = normalizeText(row.first_name || row.firstname || row.first || row.given_name || row.givenname);
  const lastName = normalizeText(row.last_name || row.lastname || row.last || row.surname || row.family_name || row.familyname);
  const fullName = normalizeText(row.name || row.full_name || row.fullname || row.student_name || row.teacher_name);

  if (firstName || lastName) {
    return {
      firstName,
      lastName,
      name: normalizeText([firstName, lastName].filter(Boolean).join(' ')),
    };
  }

  if (!fullName) {
    return { firstName: '', lastName: '', name: '' };
  }

  const parts = fullName.split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || parts[0] || '',
    name: fullName,
  };
};

const generatePasswordFromName = (row) => {
  const { firstName, lastName, name } = splitName(row);
  const normalizedFirst = normalizeNamePart(firstName || name);
  const normalizedLast = normalizeNamePart(lastName || firstName || name);

  if (normalizedFirst && normalizedLast) {
    return `${normalizedFirst}@${normalizedLast}`;
  }

  if (normalizedFirst) {
    return `${normalizedFirst}@${normalizedFirst}`;
  }

  return '';
};

const getDisplayName = (row) => splitName(row).name;

const buildUserPayload = ({ instituteId, row = {}, defaultRole } = {}) => {
  const role = normalizeRole(row.role || defaultRole);
  const email = normalizeEmail(row.email);
  const name = getDisplayName(row);
  const password = normalizeText(row.password || row.temp_password || row.generated_password);
  const phone = normalizeText(row.phone);

  return {
    instituteId,
    role,
    email,
    name,
    password: password || generatePasswordFromName(row),
    phone: phone || null,
  };
};

const createUserRecord = async (client, { instituteId, role, email, name, password, phone }) => {
  if (!role) {
    throw { status: 400, message: 'Role must be teacher or student', code: 'INVALID_ROLE' };
  }

  if (!name) {
    throw { status: 400, message: 'Name is required', code: 'INVALID_NAME' };
  }

  if (!email) {
    throw { status: 400, message: 'Email is required', code: 'INVALID_EMAIL' };
  }

  if (!password) {
    throw { status: 400, message: 'Password could not be generated from the provided name', code: 'INVALID_PASSWORD' };
  }

  const existing = await client.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length) {
    throw { status: 409, message: `Email already exists: ${email}`, code: 'DUPLICATE_EMAIL' };
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const result = await client.query(
    `INSERT INTO users(institute_id, name, email, phone, password_hash, role)
     VALUES($1,$2,$3,$4,$5,$6)
     RETURNING id, institute_id, name, email, phone, role, is_active, created_at`,
    [instituteId, name, email, phone, passwordHash, role]
  );

  return {
    ...result.rows[0],
    temp_password: password,
  };
};

const exportUserRow = (user) => {
  const parts = splitName(user);
  return {
    name: user.name,
    first_name: parts.firstName,
    last_name: parts.lastName,
    email: user.email,
    phone: user.phone || '',
    role: user.role,
    is_active: user.is_active ? 'yes' : 'no',
    created_at: user.created_at,
    last_login_at: user.last_login_at || '',
  };
};

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

exports.getUsers = async (instituteId, { role } = {}) => {
  const params = [instituteId];
  let where = 'WHERE institute_id = $1';

  if (role && role !== 'all') {
    const normalizedRole = normalizeRole(role);
    if (!normalizedRole) {
      throw { status: 400, message: 'Role must be teacher or student', code: 'INVALID_ROLE' };
    }
    params.push(normalizedRole);
    where += ` AND role = $${params.length}`;
  }

  const result = await pool.query(
    `SELECT id, institute_id, name, email, phone, role, is_active, created_at, last_login_at
     FROM users
     ${where}
     ORDER BY created_at DESC`,
    params
  );

  return result.rows;
};

exports.createUser = async (instituteId, data) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const user = await createUserRecord(client, { instituteId, ...buildUserPayload({ instituteId, row: data, defaultRole: data.role }) });
    await client.query('COMMIT');
    return user;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.importUsers = async (instituteId, rows = [], defaultRole) => {
  const client = await pool.connect();
  const created = [];
  const errors = [];

  try {
    for (let index = 0; index < rows.length; index += 1) {
      const rowNumber = index + 2;
      const payload = buildUserPayload({ instituteId, row: rows[index], defaultRole });

      try {
        const user = await createUserRecord(client, payload);
        created.push(user);
      } catch (err) {
        errors.push({ row: rowNumber, email: payload.email || normalizeEmail(rows[index].email), message: err.message || 'Failed to create user' });
      }
    }

    return {
      created,
      errors,
      summary: {
        total: rows.length,
        created: created.length,
        failed: errors.length,
      },
    };
  } finally {
    client.release();
  }
};

exports.exportUsers = async (instituteId, { role = 'all', format = 'xlsx' } = {}) => {
  const users = await exports.getUsers(instituteId, { role });
  const rows = users.map(exportUserRow);
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

  if (format === 'csv') {
    return {
      buffer: Buffer.from(XLSX.utils.sheet_to_csv(worksheet)),
      filename: `coachops-users-${role === 'all' ? 'all' : role}.csv`,
      contentType: 'text/csv; charset=utf-8',
    };
  }

  return {
    buffer: XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' }),
    filename: `coachops-users-${role === 'all' ? 'all' : role}.xlsx`,
    contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };
};