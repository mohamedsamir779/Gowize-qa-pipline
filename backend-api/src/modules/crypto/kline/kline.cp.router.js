const express = require('express');

const router = express.Router();
const {
  authMW, valMW,
} = require('src/shared/middlewares/cp-mw');
const vldtns = require('./kline.validations');

const KlineController = require('./kline.controller');

// router.use(authMiddleware);

// for adding record

router.get('/', valMW(vldtns.getKline, true), KlineController.getKlineData);
router.get('/all', valMW(vldtns.getAllKline, true), KlineController.getAllMarketsKline);

module.exports = router;
module.exports.routerName = 'kline';
