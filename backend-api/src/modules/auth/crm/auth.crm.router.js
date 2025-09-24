const express = require('express');
const { validationMiddleware, authMiddleware } = require('src/shared/middlewares/crm-mw');
const ctrl = require('./auth.controller');

const router = express.Router();

const authValidations = require('./auth.validations');

router.post('/login', validationMiddleware(authValidations.login), ctrl.loginCrm);

router.post('/verify_otp', validationMiddleware(authValidations.verify), ctrl.verifyTwoFactorAuth);

router.use(authMiddleware);

router.get('/profile', ctrl.getProfile);

router.get('/generateQR', ctrl.generateQR);

module.exports = router;
module.exports.routerName = 'auth';
