const express = require('express');

const router = express.Router();
const { authMW } = require('src/shared/middlewares/cp-mw');

const ctr = require('./bankaccount.controller');

router.use(authMW);

router.get('/', ctr.getBankAccounts);

module.exports = router;
module.exports.routerName = 'company-bank-accounts';
