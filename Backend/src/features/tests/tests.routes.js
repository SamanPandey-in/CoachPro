const router = require('express').Router();
const controller = require('./tests.controller');
const { authenticate, authorize } = require('../auth/auth.middleware');

router.use(authenticate);

router.post('/', authorize('owner', 'super_admin'), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.post('/:id/results', authorize('owner', 'super_admin', 'teacher'), controller.addResults);
router.get('/:id/results', controller.getResults);

module.exports = router;