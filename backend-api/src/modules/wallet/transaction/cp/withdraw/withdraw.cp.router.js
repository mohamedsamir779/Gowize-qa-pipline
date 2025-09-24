const express = require('express');

const router = express.Router();
const {
  authMW, valMW,
} = require('src/shared/middlewares/cp-mw');
const vldtns = require('../transaction.validations');

const WithdrawController = require('./withdraw.controller');

router.use(authMW);

// for adding record
router.post('/', valMW(vldtns.withdrawBasic), WithdrawController.basicWithdraw);
router.post('/crypto', valMW(vldtns.withdrawCrypto), WithdrawController.cryptoWithdraw);

router.get('/', valMW(vldtns.listing, true), WithdrawController.getRecords);

router.get('/gateways', WithdrawController.getGateways);

module.exports = router;
module.exports.routerName = 'transactions/withdraw';
