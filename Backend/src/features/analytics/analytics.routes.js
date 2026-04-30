const router = require('express').Router();
const controller = require('./analytics.controller');
const { authenticate } = require('../auth/auth.middleware');

router.use(authenticate);

router.get('/dashboard', controller.getDashboardStats);
router.get('/batch/:id/performance', controller.getBatchPerformance);
router.get('/weak-students', controller.getWeakStudents);

module.exports = router;