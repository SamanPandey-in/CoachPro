const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  logger.error(`${req.method} ${req.path} — ${err.message}`);

  if (err.name === 'ZodError') {
    return res.status(422).json({ success: false, error: { code: 'VALIDATION_ERROR', message: err.errors } });
  }

  if (err.code === '23505') {
    return res.status(409).json({ success: false, error: { code: 'DUPLICATE_ENTRY', message: 'Record already exists' } });
  }

  res.status(err.status || 500).json({ success: false, error: { code: err.code || 'SERVER_ERROR', message: err.message || 'Internal server error' } });
};
