const service = require('./reports.service');
const { success } = require('../../shared/utils/response');

exports.generateStudentReport = async (req, res, next) => {
  try {
    const { month, year } = req.body;
    const data = await service.generateStudentReport(req.user.institute_id, req.params.id, month, year);
    return success(res, data, 'Report generated', 201);
  } catch (err) {
    next(err);
  }
};

exports.getStudentReports = async (req, res, next) => {
  try {
    const data = await service.getStudentReports(req.user.institute_id, req.params.id);
    return success(res, data);
  } catch (err) {
    next(err);
  }
};

exports.sendMonthlyReport = async (req, res, next) => {
  try {
    const { month, year, student_id } = req.body;
    const data = await service.sendMonthlyReport(req.user.institute_id, student_id, month, year);
    return success(res, data, 'Monthly report queued');
  } catch (err) {
    next(err);
  }
};