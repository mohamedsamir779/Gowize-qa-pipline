const express = require('express');

const router = express.Router();

const {
  authMW, valMW
} = require('src/shared/middlewares/cp-mw');

const ctrl = require('./walaoPay.controller');
const vldtns = require('./walaoPay.validations');

//router.use(authMW);

router.post('/pay', authMW, valMW(vldtns.walaoPayDepositCheckout), ctrl.pay);
//router.post('/verify-transaction', ctrl.verify);

router.get(
  "/postback",
  ctrl.postback
);
router.post(
  "/postback",
  ctrl.postback
);
router.get(
  "/success",
  ctrl.successCallback
);
router.get("/failure", ctrl.failureCallback);


module.exports = router;
module.exports.routerName = 'psp/walaoPay';
