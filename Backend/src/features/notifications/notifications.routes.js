const router = require('express').Router();
const { authenticate, authorize } = require('../auth/auth.middleware');
const notifService = require('./notifications.service');
const { success, error } = require('../../shared/utils/response');

router.use(authenticate);

router.post('/send/attendance-absent', authorize('owner','super_admin'), async (req, res, next) => {
  try {
    const { studentId, date } = req.body;
    await notifService.sendAttendanceAbsentAlert(req.user.institute_id, studentId, date);
    return success(res, null, 'Queued');
  } catch (err) { next(err); }
});

router.post('/send/monthly-report', authorize('owner','super_admin'), async (req, res, next) => {
  try {
    const { studentId, month, year } = req.body;
    await notifService.sendMonthlyReport(req.user.institute_id, studentId, month, year);
    return success(res, null, 'Sent');
  } catch (err) { next(err); }
});

module.exports = router;
