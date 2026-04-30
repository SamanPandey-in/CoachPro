const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { globalLimiter } = require('./shared/middleware/rateLimiter') || {};
const errorHandler = require('./shared/middleware/errorHandler');
const env = require('./shared/config/env');

const app = express();

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV !== 'test') app.use(morgan('combined'));

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Mount existing placeholder routes if present
try {
  app.use('/api/v1/auth', require('./features/auth/auth.routes'));
} catch (e) {
  // ignore if routes not yet created
}
try {
  app.use('/api/v1/biometric', require('./features/biometric/biometric.routes'));
} catch (e) {}

try {
  app.use('/api/v1/notifications', require('./features/notifications/notifications.routes'));
} catch (e) {}

try {
  app.use('/api/v1/batches', require('./features/batches/batches.routes'));
} catch (e) {}
try {
  app.use('/api/v1/students', require('./features/students/students.routes'));
} catch (e) {}

try {
  app.use('/api/v1/attendance', require('./features/attendance/attendance.routes'));
} catch (e) {}

// Register notification jobs (cron)
try {
  require('./features/notifications/notifications.jobs');
} catch (e) {}


// 404
app.use((req, res) => res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Route not found' } }));

app.use(errorHandler);

module.exports = app;
