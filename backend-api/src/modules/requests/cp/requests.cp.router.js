const express = require('express');

const router = express.Router();

const {
  authMW, valMW, vlPathMw, verifyAccMw, haveFxIb, haveFx,
} = require('src/shared/middlewares/cp-mw');

const ctrl = require('./requests.controller');
const ctrlCRM = require('../crm/request.controller.js');
const vldtns = require('./requests.validations');

router.use(authMW);
router.use(haveFx);

router.post('/ib', ctrl.createIbRequest);
router.get('/ib', ctrl.getIbRequest);

// change leverage request handlers
router.post('/change-leverage', valMW(vldtns.createChangeLeverageRequest), ctrl.createChangeLeverageRequest, ctrlCRM.approveLeverageRequest);

// Create account request
router.post('/account', valMW(vldtns.createAccountRequest), ctrl.createAccountRequest);

module.exports = router;
