const express = require('express');

const router = express.Router();

const {
  authMW, valMW
} = require('src/shared/middlewares/cp-mw');

const ctrl = require('./knet.controller');
const vldtns = require('./knet.validations');

router.post('/pay', authMW, valMW(vldtns.knetDepositCheckout), ctrl.pay);
 router.get('/verify/:orderId', ctrl.verify);
// router.get('/failed', authMW, ctrl.failed);

module.exports = router;
module.exports.routerName = 'psp/knet';
