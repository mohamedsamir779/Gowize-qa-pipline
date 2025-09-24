const express = require('express');
const {
  authMW, valMW,
} = require('src/shared/middlewares/cp-mw');

const vldtns = require('../transfer.validation');
const ctrl = require('./transfer.controller');

const router = express.Router();
router.use(authMW);

router.post('/', valMW(vldtns.request), ctrl.addApprovedTransaction);

module.exports = router;
module.exports.routerName = 'wallet/transfer';
