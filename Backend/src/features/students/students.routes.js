const router = require('express').Router();
const controller = require('./students.controller');
const { authenticate, authorize } = require('../auth/auth.middleware');

router.use(authenticate);

router.post('/', authorize('owner','super_admin'), controller.create);
router.get('/', controller.getAll);
router.get('/:id', controller.getById);
router.put('/:id', authorize('owner','super_admin'), controller.update);
router.delete('/:id', authorize('owner','super_admin'), controller.delete);
router.post('/:id/enroll', authorize('owner','super_admin'), controller.enroll);

module.exports = router;
