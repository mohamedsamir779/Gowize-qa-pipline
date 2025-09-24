/* eslint-disable no-case-declarations */
/**
 * Service for system generated Emails
 */
const slugify = require('slugify');
const { ObjectId } = require('mongoose').Types;
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const handlebars = require('handlebars');

const { Cruds, SendEvent } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const SystemEmailModel = require('./systememail.model');
const templateService = require('./template.service');
const { EVENT_TYPES, LOG_TYPES, LOG_LEVELS } = require('../../common/data/constants');

let settingsService;

const baseFields = ['cpUrl', 'crmUrl', 'firstName', 'lastName', 'email', 'clientName', 'customerSupportName'];

class SystemEmailService extends Cruds {
  async setupEmailsConfig(emailConfig) {
    if (!emailConfig) {
      this.emailConfig = await settingsService.getSettings('email');
    } else {
      this.emailConfig = emailConfig;
    }
    if (this.emailConfig) {
      switch (this.emailConfig.currentProvider) {
        case 'sendGrid':
          sgMail.setApiKey(this.emailConfig.sendGrid.apiKey);
          logger.info('sendgrid key set');
          break;
        case 'smtp':
          this.transporter = nodemailer.createTransport({
            host: this.emailConfig.smtp.server,
            port: this.emailConfig.smtp.port,
            secure: this.emailConfig.smtp.secure, // true for 465, false for other ports
            auth: {
              user: this.emailConfig.smtp.user, // generated ethereal user
              pass: this.emailConfig.smtp.password, // generated ethereal password
            },
          });
          logger.info('smtp transporter set');
          break;
        default:
          logger.error('No email provider set');
          break;
      }
    }
  }

  create(params) {
    const obj = {
      ...params,
      key: slugify(params.title),
      fields: params.fields ? params.fields : baseFields,
    };
    return super.create(obj);
  }

  createUserTemplate(params) {
    const obj = {
      ...params,
      key: slugify(params.title),
      action: slugify(params.title),
      userTemplate: true,
    };
    return super.create(obj);
  }

  updateById(id, params) {
    const obj = {
      ...params,
      key: slugify(params.title),
    };
    return super.updateById(id, obj);
  }

  updateStatus(id, params) {
    return super.updateById(id, params);
  }

  updateContentById(id, language, subject, body) {
    return this.update({
      _id: ObjectId(id),
    }, {
      [`content.${language}`]: {
        subject,
        body,
      },
    });
  }

  async getPreviewContent(id, lang) {
    const rec = await this.findById(id);
    if (!rec) return '';

    return templateService.getSubjectBody(rec, lang);
  }

  async sendMail({
    to, subject = '', body = '', bcc = [], attachments = [], replyTo = undefined,
  }) {
    if (!to) throw new Error('Email recipient not speicified');
    if (bcc.length > 0) {
      (bcc = [...new Set(bcc)]);
    }
    if (this.emailConfig && this.emailConfig.currentProvider) {
      let msg;
      switch (this.emailConfig.currentProvider) {
        case 'sendGrid':
          msg = {
            from: this.emailConfig.sendGrid.fromEmail,
            to,
            subject,
            html: body,
            attachments,
            bcc,
            replyTo,
          };
          return sgMail
            .send(msg)
            .then((res) => {
              logger.info('Email send success response (SendGrid)');
              return res;
            })
            .catch((error) => {
              logger.error('Email send error response (SendGrid)');
              logger.error(error);
              return { messageId: null, error };
            });
        case 'smtp':
          return this.transporter.sendMail({
            from: `${this.emailConfig.smtp.fromEmail}`,
            to,
            subject,
            html: body,
            attachments,
            bcc,
            replyTo,
          }).then((res) => {
            logger.info('Email send success response (SMTP)');
            return { messageId: res.messageId };
          })
            .catch((error) => {
              logger.error('Email send error response (SMTP)');
              logger.error(error);
              return { messageId: null, error };
            });
        default:
          break;
      }
    }
    return {};
  }

  async sendCampaignMail({
    subject = '', body: html = '', bcc = [], attachments = [], replyTo = null, personalizations = [],
  }) {
    if (personalizations.length === 0) throw new Error('Email recipients not speicified');
    if (this.emailConfig && this.emailConfig.currentProvider) {
      let msg;
      // eslint-disable-next-line default-case
      switch (this.emailConfig.currentProvider) {
        case 'sendGrid':
          msg = {
            from: this.emailConfig.sendGrid.fromEmail,
            personalizations,
            subject,
            html,
            attachments,
            replyTo,
          };
          return sgMail
            .send(msg)
            .then((res) => {
              logger.info('Emails sent successefully (sendGrid)');
              return res;
            })
            .catch((error) => {
              logger.error('Emails not sent (sendGrid)');
              logger.error(error);
              return { messageId: null, error };
            });
        case 'smtp':
          const compiledTemplate = handlebars.compile(html);
          const messages = personalizations.map((p) => {
            const { to, substitutions } = p;
            const personalizedHtml = compiledTemplate(substitutions);
            return {
              from: this.emailConfig.smtp.fromEmail,
              to,
              subject,
              html: personalizedHtml,
              attachments,
              bcc,
              replyTo,
            };
          });
          Promise.all(messages.map((message) => this.transporter.sendMail(message)))
            .then((res) => {
              logger.info('Emails sent successefully (SMTP)');
              return { messageId: res.messageId };
            })
            .catch((error) => {
              logger.error('Emails not sent (SMTP)');
              logger.error(error);
              return { messageId: null, error };
            });
      }
    }
    return {};
  }

  async testEmailConfig(emailConfig, type) {
    const msg = {
      to: 'abcdef@mailinator.com',
      subject: 'Test Email',
      html: 'Test Email',
    };
    let isTestSuccess = false;
    switch (type) {
      case 'sendGrid':
        sgMail.setApiKey(emailConfig.sendGrid.apiKey);
        msg.from = emailConfig.sendGrid.fromEmail;
        logger.info('Test sendgrid key set');
        try {
          const res = await sgMail.send(msg);
          logger.info('Test Email send success response');
          logger.info(res);
          isTestSuccess = true;
        } catch (error) {
          logger.error('Test Email send error response');
          logger.error(error);
        }
        break;
      case 'smtp':
        // eslint-disable-next-line no-case-declarations
        this.transporter = nodemailer.createTransport({
          maxConnections: 1,
          maxMessages: 1,
          rateDelta: 500,
          rateLimit: 1,
          host: emailConfig.smtp.server,
          port: emailConfig.smtp.port,
          secure: emailConfig.smtp.secure, // true for 465, false for other ports
          auth: {
            user: emailConfig.smtp.user, // generated ethereal user
            pass: emailConfig.smtp.password, // generated ethereal password
          },
        });
        msg.from = emailConfig.smtp.fromEmail;
        logger.info('Test smtp transporter set');
        try {
          const res = await this.transporter.sendMail(msg);
          logger.info('Test Email send success response');
          logger.info(res);
          isTestSuccess = true;
        } catch (error) {
          logger.error('Test Email send error response');
          logger.error(error);
        }
        break;
      default:
        break;
    }
    await this.setupEmailsConfig(this.emailConfig);
    return isTestSuccess;
  }

  async sendSystemEmail(action, emailParams = {}, extraParams = {}) {
    const {
      to, cc, attachments, lang = 'en', _doc,
    } = emailParams;
    const bcc = await settingsService.fetchUsersForAction(action);
    if (!to) throw new Error('Email recipient / customer not speicified');
    logger.info(['Email Params ', to, cc, bcc, attachments]);
    logger.info(['Extra Params ', extraParams]);

    const emailObj = await this.findOne({ action });
    if (!emailObj) throw new Error('Email for this action not found');
    const { subject, body } = templateService.getSubjectBody(
      emailObj, { ...emailParams, ...extraParams, ..._doc }, lang,
    );
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.SYSTEM_EMAIL,
      {
        customerId: null,
        userId: null,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          to, subject, body, cc, bcc, attachments,
        },
      },
    );
    return this.sendMail({
      to, subject, body, cc, bcc, attachments,
    });
  }

  async getUsedActions() {
    const res = await this.aggregate(
      [{ $group: { _id: null, actions: { $addToSet: '$action' } } }],
    );
    if (res && res[0]) {
      return res[0].actions;
    }
    return [];
  }
}

const service = new SystemEmailService(SystemEmailModel.Model, SystemEmailModel.Schema);
service.emailConfig = {};
module.exports = service;

setTimeout(() => {
  // eslint-disable-next-line global-require
  settingsService = require('src/modules/services').settingService;
  service.setupEmailsConfig();
}, 0);
