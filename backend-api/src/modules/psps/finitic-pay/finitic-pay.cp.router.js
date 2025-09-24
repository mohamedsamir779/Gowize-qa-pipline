const express = require('express');

const router = express.Router();

const {
  authMW,
} = require('src/shared/middlewares/cp-mw');

const ctrl = require('./finitic-pay.controller');

router.post('/pay', authMW, ctrl.getCheckoutURL);
router.post('/checkout', ctrl.startCheckout);
router.get('/fees', ctrl.getFees);

router.post('/webhook/:orderId', ctrl.verify);

module.exports = router;
module.exports.routerName = 'psp/finitic-pay';
