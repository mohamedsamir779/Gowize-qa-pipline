const express = require('express');

const router = express.Router();
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('./order.validations');

const OrderController = require('./order.controller');

router.use(authMiddleware);

// for adding record
router.post('/', authorizeMW('orders', 'create'), validationMiddleware(vldtns.create), OrderController.createOrder);

// for paginate records
router.get('/', authorizeMW('orders', 'get'), validationMiddleware(vldtns.listing, true), OrderController.getPaginate);

// for update records
// router.patch('/', validationMiddleware(vldtns.update), OrderController.updateMarket);

// for get record by id
router.get('/:id', authorizeMW('orders', 'get'), validationPathMiddleware(vldtns.UDOrder), OrderController.getRecordById);

router.delete('/:id', authorizeMW('orders', 'delete'), validationPathMiddleware(vldtns.UDOrder), OrderController.cancelOrder);

module.exports = router;
module.exports.routerName = 'order';
