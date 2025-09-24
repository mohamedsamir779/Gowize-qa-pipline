const express = require('express');

const router = express.Router();

const {
  authMW, valMW
} = require('src/shared/middlewares/cp-mw');

const ctrl = require('./coinPayments.controller');
const vldtns = require('./coinPayments.validations');

//router.use(authMW);

router.post('/pay', authMW, valMW(vldtns.coinPaymentsDepositCheckout), ctrl.pay);

router.post(
  '/payment-verification',
  ctrl.ipnCallback,
);
router.get(
  '/cancel',
  ctrl.canceled,
);

router.get(
  '/success',
  ctrl.success,
)

module.exports = router;
module.exports.routerName = 'psp/coinPayments';
