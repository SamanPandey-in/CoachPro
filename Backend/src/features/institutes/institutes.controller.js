const service = require('./institutes.service');
const { success, error } = require('../../shared/utils/response');

const canAccessInstitute = (req, instituteId) => req.user.role === 'super_admin' || req.user.institute_id === instituteId;

exports.getById = async (req, res, next) => {
  try {
    if (!canAccessInstitute(req, req.params.id)) {
      return error(res, 'Forbidden', 403, 'FORBIDDEN');
    }

    const institute = await service.getById(req.params.id);
    if (!institute) return error(res, 'Institute not found', 404, 'NOT_FOUND');

    return success(res, institute);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (!canAccessInstitute(req, req.params.id)) {
      return error(res, 'Forbidden', 403, 'FORBIDDEN');
    }

    const institute = await service.update(req.params.id, req.body);
    if (!institute) return error(res, 'Institute not found', 404, 'NOT_FOUND');

    return success(res, institute, 'Institute updated');
  } catch (err) {
    next(err);
  }
};

exports.getStats = async (req, res, next) => {
  try {
    if (!canAccessInstitute(req, req.params.id)) {
      return error(res, 'Forbidden', 403, 'FORBIDDEN');
    }

    const stats = await service.getStats(req.params.id);
    return success(res, stats);
  } catch (err) {
    next(err);
  }
};