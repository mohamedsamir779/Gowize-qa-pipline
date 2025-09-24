const express = require('express');

const router = express.Router();
const { valMW, authMW } = require('src/shared/middlewares/cp-mw');
const UtmCampaginController = require('./utm-campaign.controller');
const { addUtmCampaign, editUtmCampaign } = require('./utm-campaign.validations');

router.post('/', authMW, valMW(addUtmCampaign), UtmCampaginController.addPromotion);
router.get('/', authMW, UtmCampaginController.getPromotions);
router.put('/:campaignToken', authMW, valMW(editUtmCampaign), UtmCampaginController.editPromotion);
router.delete('/:campaignToken', authMW, UtmCampaginController.deletePromotion);

module.exports = router;
module.exports.routerName = 'utm-campaign';
