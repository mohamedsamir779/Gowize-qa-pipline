const express = require('express');

const router = express.Router();

const PricingController = require('./pricing.controller');

router.get('/', PricingController.getPaginate);

module.exports = router;
module.exports.routerName = 'pricing';
