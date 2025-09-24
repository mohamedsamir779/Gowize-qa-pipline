const express = require('express');
const router = express.Router();
const {
  authMW,
} = require('src/shared/middlewares/cp-mw');
const ctrl = require('./paymaxis.controller');
// router.use(authMW);
router.post('/pay', authMW, ctrl.pay);
router.post('/status', ctrl.paymentStatus);
router.get('/payment-status', ctrl.renderPaymentStatus);
module.exports = router;
module.exports.routerName = 'psp/paymaxis';