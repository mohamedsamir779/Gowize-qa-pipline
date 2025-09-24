const express = require('express');

const router = express.Router();
const { validationMiddleware } = require('src/shared/middlewares/crm-mw');
const vldtns = require('../campaign-unsubscribers.validations');
const ctrl = require('./campaign-unsubscribers.controller');

router.post('/unsubscribe', validationMiddleware(vldtns.unsubscribe), ctrl.unsubscribe);

module.exports = router;
