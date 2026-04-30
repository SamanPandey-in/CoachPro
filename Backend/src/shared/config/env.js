require('dotenv').config();

const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT) || 5000,
  DATABASE_URL: process.env.DATABASE_URL || null,
  JWT_SECRET: process.env.JWT_SECRET || null,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || null,
  REFRESH_TOKEN_HASH_KEY: process.env.REFRESH_TOKEN_HASH_KEY || null,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '15m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  CLIENT_URLS: (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:3000,http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: parseInt(process.env.SMTP_PORT) || 587,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_PASS: process.env.SMTP_PASS,
  SMTP_FROM: process.env.SMTP_FROM,
  BIOMETRIC_SYNC_SECRET: process.env.BIOMETRIC_SYNC_SECRET,
};

['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'REFRESH_TOKEN_HASH_KEY'].forEach((key) => {
  if (!env[key]) throw new Error(`Missing required env: ${key}`);
});

module.exports = env;
