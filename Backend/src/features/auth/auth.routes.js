const router = require('express').Router();
const controller = require('./auth.controller');
const validate = require('../../shared/middleware/validate') || (() => (req,res,next)=>next());
const { authLimiter } = require('../../shared/middleware/rateLimiter');

router.post('/register', authLimiter, controller.register);
router.post('/login', authLimiter, controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.get('/me', controller.me);

module.exports = router;
