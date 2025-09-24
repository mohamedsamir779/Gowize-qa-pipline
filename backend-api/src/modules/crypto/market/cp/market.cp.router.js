const express = require('express');

const router = express.Router();
const MarketController = require('./market.controller');

// for paginate records
router.get('/', MarketController.getPaginate);
router.get('/markets/all', MarketController.getAll);

// for get record by id
router.get('/:id', MarketController.getRecordById);

module.exports = router;
module.exports.routerName = 'markets';
