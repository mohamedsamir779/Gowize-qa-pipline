const express = require('express');

const router = express.Router();
const {
  validationMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('./orderbook.validations');

const OrderBookController = require('./orderbook.controller');

router.use(authMiddleware);

router.get('/', authorizeMW('orderBooks', 'get'), validationMiddleware(vldtns.listing, true), OrderBookController.getPaginate);

module.exports = router;
module.exports.routerName = 'order-book';
