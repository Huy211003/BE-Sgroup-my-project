const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const checkMailController = require('../controllers/checkmail.controller');
const authenticateToken = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/users', authenticateToken.authenticateToken, authController.getAllUsers);


router.post('/test', checkMailController.sendResetPasswordEmail)

router.post('/forgotPassword', authController.forgotPassword);
router.post('/resetPassword', authController.resetPassword);

module.exports = router;