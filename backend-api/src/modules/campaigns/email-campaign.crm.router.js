const express = require('express');

const router = express.Router();
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('./email-campaign.validations');
const ctrl = require('./email-campaign.controller');

router.use(authMiddleware);

router.post('/', authorizeMW('emailCampaign', 'create'), validationMiddleware(vldtns.create), ctrl.createRecord);

router.get('/', authorizeMW('emailCampaign', 'get'), validationMiddleware(vldtns.listing, true), ctrl.getPaginate);

router.patch('/:id', authorizeMW('emailCampaign', 'update'), validationPathMiddleware(vldtns.getEmailCampaign), validationMiddleware(vldtns.create), ctrl.updateRecordById);

router.delete('/:id', authorizeMW('emailCampaign', 'delete'), validationPathMiddleware(vldtns.getEmailCampaign), ctrl.deleteRecordById);

module.exports = router;
