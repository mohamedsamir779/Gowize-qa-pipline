const express = require('express');

const router = express.Router();

const { valMW, authMW } = require('src/shared/middlewares/cp-mw');

const { login, verify } = require('./auth.validations');
const AuthController = require('./auth.controller');

router.post('/login', valMW(login), AuthController.login);
router.get('/profile', authMW, AuthController.getProfile);
// router.post('/verify_first_otp', valMW(verify), authMW, AuthController.firstTime2FAVerification);
router.post('/verify_otp', valMW(verify), AuthController.verifyTwoFactorAuth);
router.get('/generateQR', authMW, AuthController.generateQR);

module.exports = router;
module.exports.routerName = 'auth';
