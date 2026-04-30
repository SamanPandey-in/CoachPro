const service = require('./attendance.service');
const { success, error } = require('../../shared/utils/response');

exports.markManual = async (req, res, next) => {
  try {
    const attendance = await service.markManual(req.user.institute_id, req.user.id, req.body);
    return success(res, attendance, 'Attendance marked', 201);
  } catch (err) { next(err); }
};

exports.getBatch = async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const rows = await service.getBatchAttendance(req.user.institute_id, req.params.batchId, date);
    return success(res, rows);
  } catch (err) { next(err); }
};

exports.getStudentSummary = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const data = await service.getStudentSummary(req.params.studentId, req.query.batch_id, parseInt(month), parseInt(year));
    return success(res, data);
  } catch (err) { next(err); }
};

exports.getDailyOverview = async (req, res, next) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const data = await service.getDailyOverview(req.user.institute_id, date);
    return success(res, data);
  } catch (err) { next(err); }
};

exports.getLow = async (req, res, next) => {
  try {
    const threshold = parseInt(req.query.threshold) || 75;
    const data = await service.getLowAttendanceStudents(req.user.institute_id, threshold);
    return success(res, data);
  } catch (err) { next(err); }
};
