const express = require('express');

const router = express.Router();
const {
  authMW,
} = require('src/shared/middlewares/cp-mw');

const OrderBookController = require('./orderbook.controller');

// router.use(authMW);

router.get('/', OrderBookController.getPaginate);
router.get('/all', OrderBookController.getAll);

module.exports = router;
module.exports.routerName = 'order-book';
