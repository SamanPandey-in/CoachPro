const { verifyAccess } = require('../../shared/utils/jwt');
const { error } = require('../../shared/utils/response');

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return error(res, 'No token provided', 401, 'UNAUTHORIZED');
  }
  try {
    const token = authHeader.split(' ')[1];
    req.user = verifyAccess(token);
    next();
  } catch (err) {
    return error(res, 'Invalid or expired token', 401, 'UNAUTHORIZED');
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) return error(res, 'Unauthorized', 401, 'UNAUTHORIZED');
  if (!roles.includes(req.user.role)) return error(res, 'Forbidden', 403, 'FORBIDDEN');
  next();
};

module.exports = { authenticate, authorize };
