const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

const signAccess = (payload) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN || '15m' });

const signRefresh = (payload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN || '7d' });

const verifyAccess = (token) => jwt.verify(token, env.JWT_SECRET);
const verifyRefresh = (token) => jwt.verify(token, env.JWT_REFRESH_SECRET);

const hashRefreshToken = (token) =>
  crypto.createHmac('sha256', env.REFRESH_TOKEN_HASH_KEY).update(token).digest('hex');

module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh, hashRefreshToken };
