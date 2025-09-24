const { Types } = require('mongoose');
const { Cruds, SendEvent } = require('src/common/handlers');

const EmailCampaign = require('./email-campaign.model');
const campaignScheduler = require('./scheduler');
const { EVENT_TYPES, LOG_TYPES, LOG_LEVELS } = require('../../common/data/constants');

class EmailCampaignService extends Cruds {
  async createCampaign(params) {
    params.templateId = Types.ObjectId(params.templateId);
    const job = await campaignScheduler.sendEmailCampaign(params);
    params.jobId = job.attrs._id;
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.ADD_CAMPAIGN,
      {
        customerId: null,
        userId: params.createdBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: params,
      },
    );
    return super.create(params);
  }

  async updateCampaign(id, params, updatedBy) {
    const oldData = await this.findById(id);
    params.templateId = Types.ObjectId(params.templateId);
    const job = await campaignScheduler.updateEmailCampaign(params);
    params.jobId = job.attrs._id;
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.EDIT_CAMPAIGN,
      {
        customerId: null,
        userId: updatedBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          oldData,
          newData: params,
        },
      },
    );
    return super.updateById(id, params);
  }

  async deleteById(id) {
    const oldData = await this.findById(id);
    campaignScheduler.deleteEmailCampaign(oldData.jobId);
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.DELETE_CAMPAIGN,
      {
        customerId: null,
        userId: oldData.createdBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: oldData,
      },
    );
    return super.deleteById(id);
  }
}

const service = new EmailCampaignService(EmailCampaign.Model, EmailCampaign.Schema);
service.emailConfig = {};
module.exports = service;
