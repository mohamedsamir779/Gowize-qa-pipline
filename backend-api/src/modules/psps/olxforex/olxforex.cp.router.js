const express = require('express');

const router = express.Router();

const {
  authMW, valMW,
} = require('src/shared/middlewares/cp-mw');
const ctrl = require('./olxforex.controller');
const vldtns = require('./olxforex.validations');

//router.use(authMW);

router.post('/pay', authMW, valMW(vldtns.olxforexDepositCheckout), ctrl.pay);

router.get('/status', ctrl.paymentStatus);

module.exports = router;
module.exports.routerName = 'psp/olxforex';
