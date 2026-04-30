const router = require('express').Router();
const controller = require('./attendance.controller');
const { authenticate, authorize } = require('../auth/auth.middleware');

router.use(authenticate);

router.post('/manual', authorize('teacher','owner','super_admin'), controller.markManual);
router.get('/batch/:batchId', controller.getBatch);
router.get('/student/:studentId/summary', controller.getStudentSummary);
router.get('/daily', controller.getDailyOverview);
router.get('/low', controller.getLow);

module.exports = router;
