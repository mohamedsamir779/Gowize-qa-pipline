const express = require('express');

const router = express.Router();

const {
  authMW,
} = require('src/shared/middlewares/cp-mw');

const ctrl = require('./sumsub.controller');

// router.use(authMW);

// Generate access token
router.get('/generate/:customerId', ctrl.generateAccessToken);

router.post('/webhook', ctrl.webhook);

module.exports.routerName = 'sumsub';
module.exports = router;
