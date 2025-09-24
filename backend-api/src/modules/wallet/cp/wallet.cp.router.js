const express = require('express');

const router = express.Router();
const {
  authMW,
} = require('src/shared/middlewares/cp-mw');

const WalletsController = require('./wallet.controller');

router.get('/', authMW, WalletsController.getPaginate);

module.exports = router;
module.exports.routerName = 'wallets';
