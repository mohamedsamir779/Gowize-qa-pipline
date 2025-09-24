const campaignTemplateService = require('./templates/campaign-templates.service');
const templateService = require('./templates/template.service');
const { systemEmailService } = require('../services');
const { getSubscribedClientsData, personalizeEmail } = require('./helpers');
const { SendEvent } = require('../../common/handlers');
const { EVENT_TYPES, LOG_TYPES, LOG_LEVELS } = require('../../common/data/constants');

module.exports = async function (agenda) {
  agenda.define('sendEmailCampaign', async (job) => {
    const { data } = job.attrs;
    const clients = await getSubscribedClientsData(data.groups);

    const template = await campaignTemplateService.findById(data.templateId);
    const { subject, body } = templateService.getSubjectBody(template, {}, data.lang);

    const personalizations = clients.map((client) => personalizeEmail(client));

    systemEmailService.sendCampaignMail({
      personalizations,
      replyTo: data.replyTo,
      subject,
      body,
    });

    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.RUN_CAMPAIGN,
      {
        customerId: null,
        userId: null,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          name: data.campaignName,
          groups: data.groups,
        },
      },
    );
  });
};
