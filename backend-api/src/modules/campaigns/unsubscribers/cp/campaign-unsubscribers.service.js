const { Cruds, SendEvent } = require('src/common/handlers');

const campaignUnsubscribers = require('../campaign-unsubscribers.model');
const customerService = require('../../../customers/customer.service');
const { EVENT_TYPES, LOG_TYPES, LOG_LEVELS } = require('../../../../common/data/constants');

class CampaignUnsubscribersService extends Cruds {
  async unsubscribe({ email }) {
    const customer = await customerService.findOne({ email });
    if (!customer) {
      return {
        status: false,
        message: 'Email does not exist',
      };
    }
    const isUnsubbed = await this.findOne({ customerId: customer._id });
    if (isUnsubbed) {
      return {
        status: false,
        message: 'You are already unsubscribed',
      };
    }
    this.create({ customerId: customer._id });
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.CAMPAIGN_UNSUBSCRIBE,
      {
        customerId: customer._id,
        userId: null,
        triggeredBy: 0,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          email,
        },
      },
    );

    return {
      status: true,
      message: 'You have unsubscribed successfully from our mailing list',
    };
  }
}

const service = new CampaignUnsubscribersService(
  campaignUnsubscribers.Model, campaignUnsubscribers.Schema,
);
service.emailConfig = {};
module.exports = service;
