const slugify = require('slugify');

const { Cruds, SendEvent } = require('src/common/handlers');
const SystemEmailModel = require('./campaign-templates.model');
const templateService = require('../../system-emails/template.service');
const { EVENT_TYPES, LOG_TYPES, LOG_LEVELS } = require('../../../common/data/constants');

const baseFields = ['cpUrl', 'crmUrl', 'firstName', 'lastName', 'email', 'clientName', 'customerSupportName'];

class SystemEmailService extends Cruds {
  create(params) {
    const obj = {
      ...params,
      key: slugify(params.title),
      fields: params.fields ? params.fields : baseFields,
    };
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.ADD_CAMPAIGN_TEMPLATE,
      {
        customerId: null,
        userId: params.createdBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          ...params,
        },
      },
    );
    return super.create(obj);
  }

  async updateById(id, params) {
    const oldData = await this.findById(id);

    const obj = {
      ...params,
      key: slugify(params.title),
    };
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.EDIT_CAMPAIGN_TEMPLATE,
      {
        customerId: null,
        userId: params.createdBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          oldData,
          newData: { ...params },
        },
      },
    );
    return super.updateById(id, obj);
  }

  async deleteById(id) {
    const params = await this.findById(id);
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.DELETE_CAMPAIGN_TEMPLATE,
      {
        customerId: null,
        userId: params.createdBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          title: params.title,
        },
      },
    );
    return super.deleteById(id);
  }

  async getPreviewContent(id, lang) {
    const rec = await this.findById(id);
    if (!rec) return '';
    return templateService.getSubjectBody(rec, '', lang);
  }
}

const service = new SystemEmailService(SystemEmailModel.Model, SystemEmailModel.Schema);
service.emailConfig = {};
module.exports = service;
