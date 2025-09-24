const express = require('express');

const router = express.Router();
const {
  validationMiddleware, validationPathMiddleware, authMiddleware, authorizeMW,
} = require('src/shared/middlewares/crm-mw');
const vldtns = require('./campaign-templates.validations');
const ctrl = require('./campaign-templates.controller');

router.use(authMiddleware);

router.post('/', authorizeMW('emailCampaign', 'create'), validationMiddleware(vldtns.create), ctrl.createRecord);

router.get('/', authorizeMW('emailCampaign', 'get'), validationMiddleware(vldtns.listing, true), ctrl.getPaginate);

router.patch('/:id', authorizeMW('emailCampaign', 'update'), validationPathMiddleware(vldtns.getCampaignTemplate), validationMiddleware(vldtns.update), ctrl.updateRecordById);

router.delete('/:id', authorizeMW('emailCampaign', 'delete'), validationPathMiddleware(vldtns.getCampaignTemplate), ctrl.deleteRecordById);

router.get('/:id/preview/:lang', authorizeMW('emailCampaign', 'get'), validationPathMiddleware(vldtns.previewEmail), ctrl.getContentPreview);

module.exports = router;
