const express = require('express');

const router = express.Router();

const {
  authMW, valMW, vlPathMw, verifyAccMw, haveFxIb, haveFx,
} = require('src/shared/middlewares/cp-mw');

const ctrl = require('./neteller.controller');
const vldtns = require('./neteller.validations');

//router.use(authMW);

router.post('/pay', authMW, valMW(vldtns.netellerDepositCheckout), ctrl.pay);

router.post('/response', ctrl.response);
router.get('/response', ctrl.getResponse);

router.get('/success', ctrl.success);
router.get('/cancel', ctrl.cancel);
router.get('/fail', ctrl.fail);

module.exports = router;
module.exports.routerName = 'psp/neteller';
