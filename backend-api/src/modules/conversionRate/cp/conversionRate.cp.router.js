const express = require('express');

const router = express.Router();

const {
  authMiddleware, validationPathMiddleware,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('../conversionRate.validation');
const ConversionRateController = require('../conversionRate.controller');

router.use(authMiddleware);

// get converison rate for a given currency/currencies
router.get('/conversion-rate', validationPathMiddleware(vldtns.getConversionRate), ConversionRateController.getConversionRate);

// get final value of a conversion multiplying the final conversion rate by the amount
router.get('/conversion-rate-value', validationPathMiddleware(vldtns.getConversionValue), ConversionRateController.getConversionRateValue);

module.exports = router;
module.exports.routerName = 'conversionRates';
