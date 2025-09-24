const express = require('express');

const router = express.Router();
const {
  authMW,
} = require('src/shared/middlewares/cp-mw');

const WalletsController = require('./ib-wallet.controller');

router.get('/', authMW, WalletsController.getWalletDetails);

router.post('/transfer', authMW, WalletsController.transfer);

module.exports = router;
module.exports.routerName = 'ib-wallet';
