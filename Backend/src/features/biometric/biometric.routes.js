const router = require('express').Router();
const controller = require('./biometric.controller');
const { deviceAuth } = require('./biometric.middleware');
const { authenticate, authorize } = require('../auth/auth.middleware') || {};

router.post('/sync', deviceAuth, controller.sync);

// Admin routes — require JWT
router.use((req, res, next) => {
  if (!authenticate) return next();
  return authenticate(req, res, next);
});

router.post('/devices', (req, res, next) => {
  if (!authorize) return next();
  return authorize('owner','super_admin')(req, res, next);
}, controller.createDevice);

router.get('/devices', (req, res, next) => {
  if (!authorize) return next();
  return authorize('owner','super_admin')(req, res, next);
}, controller.getDevices);

router.post('/mappings', (req, res, next) => {
  if (!authorize) return next();
  return authorize('owner','super_admin')(req, res, next);
}, controller.createMapping);

router.get('/mappings', (req, res, next) => {
  if (!authorize) return next();
  return authorize('owner','super_admin')(req, res, next);
}, controller.getMappings);

router.delete('/mappings/:id', (req, res, next) => {
  if (!authorize) return next();
  return authorize('owner','super_admin')(req, res, next);
}, controller.deleteMapping);

module.exports = router;
