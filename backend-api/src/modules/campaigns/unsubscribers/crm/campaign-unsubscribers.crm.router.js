const express = require('express');

const router = express.Router();
const { validationMiddleware, authorizeMW, authMiddleware } = require('src/shared/middlewares/crm-mw');
const vldtns = require('../campaign-unsubscribers.validations');
const ctrl = require('./campaign-unsubscribers.controller');

router.use(authMiddleware);

router.get('/', authorizeMW('emailCampaign', 'get'), validationMiddleware(vldtns.listing), ctrl.getUnsubscribers);

module.exports = router;
