const router = require('express').Router();
const multer = require('multer');
const controller = require('./institutes.controller');
const { authenticate } = require('../auth/auth.middleware');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.use(authenticate);

router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.get('/:id/stats', controller.getStats);
router.get('/:id/users', controller.getUsers);
router.get('/:id/users/export', controller.exportUsers);
router.post('/:id/users', controller.createUser);
router.post('/:id/users/import', upload.single('file'), controller.importUsers);

module.exports = router;