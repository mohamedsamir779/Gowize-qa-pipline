const { Cruds } = require('src/common/handlers');

const campaignUnsubscribers = require('../campaign-unsubscribers.model');

class CampaignUnsubscribersService extends Cruds {}

const service = new CampaignUnsubscribersService(
  campaignUnsubscribers.Model, campaignUnsubscribers.Schema,
);
service.emailConfig = {};
module.exports = service;
