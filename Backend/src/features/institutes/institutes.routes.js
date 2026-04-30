const router = require('express').Router();
const controller = require('./institutes.controller');
const { authenticate } = require('../auth/auth.middleware');

router.use(authenticate);

router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.get('/:id/stats', controller.getStats);

module.exports = router;