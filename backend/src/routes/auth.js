const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const validate = require('../middleware/validate');
const { protect } = require('../middleware/auth');
const { registerSchema, loginSchema, refreshTokenSchema } = require('../validators/authValidators');

router.post('/register', validate(registerSchema), auth.register);
router.post('/login', validate(loginSchema), auth.login);
router.post('/refresh', validate(refreshTokenSchema), auth.refreshToken);
router.post('/logout', auth.logout);
router.get('/me', protect, auth.getMe);

module.exports = router;
