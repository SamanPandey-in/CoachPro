const bcrypt = require('bcryptjs');
const pool = require('../../shared/db/pool');
const { signAccess, signRefresh, verifyRefresh, hashRefreshToken } = require('../../shared/utils/jwt');

exports.register = async ({ name, email, password, institute_name }) => {
  const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
  if (existing.rows.length) throw { status: 409, message: 'Email already registered', code: 'DUPLICATE_EMAIL' };

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    let instituteId = null;
    if (institute_name) {
      const inst = await client.query('INSERT INTO institutes(name) VALUES($1) RETURNING id', [institute_name]);
      instituteId = inst.rows[0].id;
    }

    const password_hash = await bcrypt.hash(password, 12);
    const userResult = await client.query(
      `INSERT INTO users(institute_id, name, email, password_hash, role)
       VALUES($1,$2,$3,$4,$5) RETURNING id, institute_id, name, email, role`,
      [instituteId, name, email, password_hash, institute_name ? 'owner' : 'teacher']
    );

    await client.query('COMMIT');
    return userResult.rows[0];
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
};

exports.login = async ({ email, password }) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1 AND is_active = TRUE', [email]);
  const user = result.rows[0];
  if (!user) throw { status: 401, message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw { status: 401, message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' };

  const payload = { id: user.id, institute_id: user.institute_id, role: user.role };
  const accessToken = signAccess(payload);
  const refreshToken = signRefresh(payload);
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await pool.query(
    'INSERT INTO refresh_tokens(user_id, token, token_hash, expires_at) VALUES($1,$2,$3,$4)',
    [user.id, null, refreshTokenHash, expiresAt]
  );
  await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = $1', [user.id]);

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, institute_id: user.institute_id },
  };
};

exports.refresh = async ({ refresh_token }) => {
  let payload;
  try { payload = verifyRefresh(refresh_token); } catch { throw { status: 401, message: 'Invalid refresh token', code: 'UNAUTHORIZED' }; }

  const refreshTokenHash = hashRefreshToken(refresh_token);
  const result = await pool.query(
    'SELECT * FROM refresh_tokens WHERE (token_hash = $1 OR token = $2) AND expires_at > NOW()',
    [refreshTokenHash, refresh_token]
  );
  if (!result.rows.length) throw { status: 401, message: 'Refresh token expired', code: 'UNAUTHORIZED' };

  const accessToken = signAccess({ id: payload.id, institute_id: payload.institute_id, role: payload.role });
  return { access_token: accessToken };
};

exports.logout = async ({ refresh_token }) => {
  const refreshTokenHash = hashRefreshToken(refresh_token);
  await pool.query('DELETE FROM refresh_tokens WHERE token_hash = $1 OR token = $2', [refreshTokenHash, refresh_token]);
};
