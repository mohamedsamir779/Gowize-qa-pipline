const express = require('express');

const router = express.Router();

const {
  authMW, valMW
} = require('src/shared/middlewares/cp-mw');

const ctrl = require('./skrill.controller');
const vldtns = require('./skrill.validations');

//router.use(authMW);

router.post('/pay', authMW, valMW(vldtns.skrillDepositCheckout), ctrl.pay);
router.post('/verify-transaction', ctrl.verify);

module.exports = router;
module.exports.routerName = 'psp/skill';
