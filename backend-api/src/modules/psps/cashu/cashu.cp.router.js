const express = require('express');

const router = express.Router();

const {
  authMW, valMW
} = require('src/shared/middlewares/cp-mw');

const ctrl = require('./cashu.controller');
const vldtns = require('./cashu.validations');

router.post('/pay', authMW, valMW(vldtns.cashuDepositCheckout), ctrl.pay);
router.post('/success', ctrl.successCallback);
router.post('/fail', ctrl.failureCallback);

module.exports = router;
module.exports.routerName = 'psp/cashu';
