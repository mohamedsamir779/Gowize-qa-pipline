const express = require('express');

const router = express.Router();

const {
  authMW, valMW, vlPathMw, verifyAccMw, haveFxIb, haveFx,
} = require('src/shared/middlewares/cp-mw');

const ctrl = require('./mastercard.controller');
const vldtns = require('./mastercard.validations');

router.use(authMW);

router.post('/pay', authMW, valMW(vldtns.mastercardDepositCheckout), ctrl.pay);
router.post('/verify', ctrl.verifyPayment);

module.exports = router;
module.exports.routerName = 'psp/mastercard';
