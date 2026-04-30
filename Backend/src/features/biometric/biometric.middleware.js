const { error } = require('../../shared/utils/response');

// Device authentication — uses API key instead of JWT
exports.deviceAuth = async (req, res, next) => {
  const deviceKey = req.headers['x-biometric-key'];
  const deviceId = req.headers['x-device-id'];

  if (!deviceKey || deviceKey !== process.env.BIOMETRIC_SYNC_SECRET) {
    return error(res, 'Invalid device key', 401, 'UNAUTHORIZED');
  }

  if (!deviceId) {
    return error(res, 'Device ID required', 400, 'BAD_REQUEST');
  }

  req.deviceId = deviceId;
  next();
};
