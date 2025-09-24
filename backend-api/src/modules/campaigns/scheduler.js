const { Types } = require('mongoose');
const agenda = require('src/common/lib/agenda');

const scheduler = {
  sendEmailCampaign: async (params) => {
    const {
      scheduleDate: runTime,
      templateId,
      language,
      groups,
      replyTo,
      fromEmail,
      name: campaignName,
    } = params;
    return agenda.schedule(runTime, 'sendEmailCampaign', {
      templateId, language, groups, replyTo, fromEmail, campaignName,
    });
  },
  updateEmailCampaign: async (params) => {
    const {
      scheduleDate: updatedRunTime,
      templateId,
      language,
      groups,
      replyTo,
      fromEmail,
      jobId,
    } = params;
    const jobs = await agenda.jobs(Types.ObjectId(jobId));
    const job = jobs[0];
    if (job) {
      job.attrs.data = {
        templateId, language, groups, replyTo, fromEmail,
      };
      job.attrs.lastModifiedAt = new Date();
      job.schedule(updatedRunTime);
      job.save();
      return job;
    }
    return null;
  },
  deleteEmailCampaign: async (jobId) => {
    const jobs = await agenda.jobs({ _id: jobId });
    const job = jobs[0];
    if (job) {
      agenda.cancel({ _id: jobId });
    }
  },
};

module.exports = scheduler;
