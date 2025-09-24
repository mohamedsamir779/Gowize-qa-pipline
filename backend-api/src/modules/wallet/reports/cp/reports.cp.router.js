const express = require('express');
const {
  authMW, valMW,
} = require('src/shared/middlewares/cp-mw');

const ctrl = require('./reports.controller');
const vldtns = require('../reports.validation');

const router = express.Router();
router.use(authMW);

router.get('/', valMW(vldtns.listing), ctrl.getPaginate);

module.exports = router;
module.exports.routerName = 'wallet/report';
