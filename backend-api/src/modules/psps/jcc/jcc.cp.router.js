const express = require('express');

const router = express.Router();

const {
  authMW, valMW
} = require('src/shared/middlewares/cp-mw');

const ctrl = require('./jcc.controller');
const vldtns = require('./jcc.validations');

router.post('/genSignature', authMW, valMW(vldtns.jccDepositCheckout), ctrl.generateSignature);
router.post('/verify', ctrl.verify);

module.exports = router;
module.exports.routerName = 'psp/jcc';
