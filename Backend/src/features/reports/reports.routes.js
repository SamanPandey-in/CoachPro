const router = require('express').Router();
const controller = require('./reports.controller');
const { authenticate, authorize } = require('../auth/auth.middleware');

router.use(authenticate);

router.post('/generate/student/:id', authorize('owner', 'super_admin', 'teacher'), controller.generateStudentReport);
router.get('/student/:id', controller.getStudentReports);
router.post('/send-monthly', authorize('owner', 'super_admin', 'teacher'), controller.sendMonthlyReport);

module.exports = router;