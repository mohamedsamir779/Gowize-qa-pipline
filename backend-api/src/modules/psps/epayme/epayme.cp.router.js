const express = require('express');

const router = express.Router();
const { authMW } = require('../../../shared/middlewares/cp-mw');
const EpaymeController = require('./epayme.controller');

router.post('/pay', authMW, EpaymeController.pay);
router.post('/deposit/callback', EpaymeController.depositCallback);

module.exports = router;
module.exports.routerName = 'psp/epayme';
