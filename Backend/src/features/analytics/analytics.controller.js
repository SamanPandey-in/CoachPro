const service = require('./analytics.service');
const { success } = require('../../shared/utils/response');

exports.getDashboardStats = async (req, res, next) => {
  try {
    const data = await service.getDashboardStats(req.user.institute_id);
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

exports.getBatchPerformance = async (req, res, next) => {
  try {
    const data = await service.getBatchPerformance(req.user.institute_id, req.params.id);
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

exports.getWeakStudents = async (req, res, next) => {
  try {
    const data = await service.getWeakStudents(req.user.institute_id);
    return success(res, data);
  } catch (err) {
    next(err);
  }
};