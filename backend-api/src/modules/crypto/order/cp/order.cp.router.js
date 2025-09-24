const express = require('express');

const router = express.Router();
const {
  authMW, valMW, vlPathMw,
} = require('src/shared/middlewares/cp-mw');
const vldtns = require('./order.validations');

const OrderController = require('./order.controller');

router.use(authMW);
// for adding record
router.post('/', valMW(vldtns.create), OrderController.createOrder);

// for paginate records
router.get('/', valMW(vldtns.listing, true), OrderController.getPaginate);

// for update records
// router.patch('/', validationMiddleware(vldtns.update), OrderController.updateMarket);

// for get record by id
router.get('/:id', vlPathMw(vldtns.UDOrder), OrderController.getRecordById);

router.delete('/:id', vlPathMw(vldtns.UDOrder), OrderController.cancelOrder);

module.exports = router;
module.exports.routerName = 'orders';
