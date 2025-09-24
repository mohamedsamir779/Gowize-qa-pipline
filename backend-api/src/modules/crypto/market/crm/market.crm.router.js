const express = require('express');

const router = express.Router();
const {
  validationMiddleware, authMiddleware, authorizeMW, validationPathMiddleware,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('./market.validations');

const MarketController = require('./market.controller');

router.use(authMiddleware);

// for adding record
router.post('/', authorizeMW('currencyPairs', 'create'), validationMiddleware(vldtns.create), MarketController.createMarket);

// for paginate records
router.get('/', authorizeMW('currencyPairs', 'get'), validationMiddleware(vldtns.listing, true), MarketController.getPaginate);

// for update records
router.patch('/', authorizeMW('currencyPairs', 'update'), validationMiddleware(vldtns.update), MarketController.updateMarket);

// for get record by id
router.get('/:id', authorizeMW('currencyPairs', 'get'), MarketController.getRecordById);

// switching markets status (active, inactive)
router.post('/:id/:status', authorizeMW('currencyPairs', 'update'), validationPathMiddleware(vldtns.marketStatus), MarketController.updateRecordStatus);

module.exports = router;
module.exports.routerName = 'markets';
