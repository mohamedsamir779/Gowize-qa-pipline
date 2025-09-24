const express = require('express');

const router = express.Router();

const CryptoAPIController = require('./cryptoapi.controller');

router.post('/deposit-callback', CryptoAPIController.depositCallback);
router.post('/deposit-callback/token', CryptoAPIController.depositCallbackToken);

router.post('/withdraw-callback/:blockchain/:network/:address/:transactionId', CryptoAPIController.withdrawCallback);

router.delete('/subscription/:id', CryptoAPIController.deleteSubscription);

module.exports = router;
module.exports.routerName = 'cryptoapi';
