const authService = require('./auth.service');
const { success, error } = require('../../shared/utils/response');

exports.register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    return success(res, user, 'Registered successfully', 201);
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const data = await authService.login(req.body);
    return success(res, data, 'Login successful');
  } catch (err) { next(err); }
};

exports.refresh = async (req, res, next) => {
  try {
    const data = await authService.refresh(req.body);
    return success(res, data);
  } catch (err) { next(err); }
};

exports.logout = async (req, res, next) => {
  try {
    await authService.logout(req.body);
    return success(res, null, 'Logged out');
  } catch (err) { next(err); }
};

exports.me = async (req, res, next) => {
  try {
    if (!req.user && !req.headers.authorization) return error(res, 'No token provided', 401, 'UNAUTHORIZED');
    // If token present and auth middleware not used, attempt to verify token
    if (!req.user && req.headers.authorization) {
      try {
        const { verifyAccess } = require('../../shared/utils/jwt');
        const token = req.headers.authorization.split(' ')[1];
        req.user = verifyAccess(token);
      } catch (e) { return error(res, 'Invalid token', 401, 'UNAUTHORIZED'); }
    }
    const pool = require('../../shared/db/pool');
    const result = await pool.query('SELECT id, name, email, role, institute_id, avatar_url FROM users WHERE id = $1', [req.user.id]);
    return success(res, result.rows[0]);
  } catch (err) { next(err); }
};
