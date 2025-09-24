// Role srvice

const { Cruds, SendEvent } = require('src/common/handlers');
const { UTMCampaignModel, UTMCampaignSchema } = require('./utm-campaign.model');

class UTMCampaignService extends Cruds {
  async getPromotions(params = {}) {
    const { query = {}, params: paramsValue = {} } = params;
    return this.findWithPagination(
      query,
      {
        lean: true,
        sort: { _id: -1 },
        populate: {
          path: 'userId',
          model: 'users',
          select: 'email _id firstName lastName',
        },
        ...paramsValue,
      },
    );
  }
}

module.exports = new UTMCampaignService(UTMCampaignModel, UTMCampaignSchema);
