const router = require('express').Router();
const controller = require('./batches.controller');
const { authenticate, authorize } = require('../auth/auth.middleware');

router.use(authenticate);

router.post('/', authorize('owner', 'super_admin'), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.get('/:id/students', controller.getStudents);
router.put('/:id', authorize('owner', 'super_admin'), controller.update);
router.delete('/:id', authorize('owner', 'super_admin'), controller.delete);

module.exports = router;
