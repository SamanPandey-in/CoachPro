const service = require('./biometric.service');
const { success, error } = require('../../shared/utils/response');

exports.sync = async (req, res, next) => {
  try {
    const deviceId = req.deviceId;
    const { logs } = req.body;
    if (!Array.isArray(logs)) return error(res, 'Invalid logs', 400, 'BAD_REQUEST');
    const result = await service.syncLogs(deviceId, logs);
    return success(res, result, 'Sync processed');
  } catch (err) { next(err); }
};

exports.createDevice = async (req, res, next) => {
  try {
    const device = await service.createDevice(req.user.institute_id, req.body);
    return success(res, device, 'Device created', 201);
  } catch (err) { next(err); }
};

exports.getDevices = async (req, res, next) => {
  try {
    const result = await require('../../shared/db/pool').query('SELECT * FROM biometric_devices WHERE institute_id=$1', [req.user.institute_id]);
    return success(res, result.rows);
  } catch (err) { next(err); }
};

exports.createMapping = async (req, res, next) => {
  try {
    const mapping = await service.createMapping(req.user.institute_id, req.body);
    return success(res, mapping, 'Mapping created', 201);
  } catch (err) { next(err); }
};

exports.getMappings = async (req, res, next) => {
  try {
    const mappings = await service.getMappings(req.user.institute_id);
    return success(res, mappings);
  } catch (err) { next(err); }
};

exports.deleteMapping = async (req, res, next) => {
  try {
    await service.deleteMapping(req.user.institute_id, req.params.id);
    return success(res, null, 'Deleted');
  } catch (err) { next(err); }
};
