const express = require('express');

const router = express.Router();

const {
  authMW, valMW
} = require('src/shared/middlewares/cp-mw');

const ctrl = require('./myFatoorah.controller');
const vldtns = require('./myFatoorah.validations');

router.post('/status_update', authMW, valMW(vldtns.myFatoorahDepositCheckout), ctrl.pay);
router.get('/success', authMW, ctrl.success);
router.get('/failed', authMW, ctrl.failed);

module.exports = router;
module.exports.routerName = 'psp/myFatoorah';
