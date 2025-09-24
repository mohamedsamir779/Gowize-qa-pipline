//
const { Cruds } = require('src/common/handlers');
const { logger } = require('src/common/lib');
const SettingsModal = require('./settings.model');
const {
  systemEmailService,
} = require('src/modules/services');
const { CONSTANTS } = require('../../common/data');
class SettingsService extends Cruds {
  async getSettings(key = '') {
    if (!this.settings) {
      logger.warn('Fetching settings from database');
      this.settings = await this.findOne({});
    } else {
      logger.warn('Taking data from variable');
    }
    return key === '' ? this.settings : this.settings[key];
  }

  async addExchange(exchangeData = {}) {
    const exchanges = await this.getSettings('exchanges');
    // TODO: check if exchange is implemented or not
    if (exchanges.findIndex((x) => x.name === exchangeData.name) !== -1) {
      throw new Error('Exchange already exists');
    }
    if (exchangeData.default && exchanges.findIndex((x) => x.default) !== -1) {
      throw new Error('There already is a default exchange');
    }
    // need to setup ws here for the exchange added
    return this.Model.findOneAndUpdate({}, {
      $push: {
        exchanges: exchangeData,
      },
    }, { new: true });
  }

  async removeExchange(exchangeName = '') {
    const exchanges = await this.getSettings('exchanges');
    if (exchanges.findIndex((x) => x.name === exchangeName) === -1) {
      throw new Error('Exchange does not exists');
    }
    // need to setup ws here for the exchange added
    this.settings = await this.Model.findOneAndUpdate({}, {
      $pull: {
        exchanges: {
          name: exchangeName,
        },
      },
    }, { new: true });
    return this.settings;
  }

  async updateExchange(exchangeName, exchangeData = {}) {
    let updateModel = {};
    if (exchangeData.apiKey) {
      updateModel = {
        ...updateModel,
        'exchanges.$.apiKey': exchangeData.apiKey,
      };
    }
    if (exchangeData.secret) {
      updateModel = {
        ...updateModel,
        'exchanges.$.secret': exchangeData.secret,
      };
    }
    if (exchangeData.extraParams) {
      updateModel = {
        ...updateModel,
        'exchanges.$.extraParams': exchangeData.extraParams,
      };
    }
    this.settings = await this.Model.findOneAndUpdate({
      exchanges: {
        $elemMatch: { name: exchangeName },
      },
    }, {
      $set: updateModel,
    }, { new: true });
    return this.settings;
  }

  async getExchangeDetails(exchangeName) {
    return this.settings.exchanges.find((x) => x.name === exchangeName);
  }

  async getDefaultExchange() {
    return this.settings.exchanges
      ? this.settings.exchanges.find((ex) => ex.default === true)
      : {};
  }

  async getEmailConfig() {
    const rec = await this.Model.findOne({});
    if (rec && rec.email && rec.email.smtp) {
      const { password, ...smtpWithoutPassword } = rec.email.smtp;
      return {
          ...rec.email,
          smtp: smtpWithoutPassword
      };
  }
    return rec.email;
  }

  async updateEmailConfig(data) {
    const rec = await this.Model.findOne({});
    switch (data.type) {
      case 'smtp':
        rec.email.smtp = {
          fromEmail: data.fromEmail,
          server: data.server,
          port: data.port,
          secure: data.secure,
          user: data.user,
          password: data.password,
        };
        break;
      case 'sendGrid':
        rec.email.sendGrid = {
          apiKey: data.apiKey,
          fromEmail: data.senderEmail,
        };
        break;
      default:
        break;
    }
    const res = await rec.save();
    // Verify email config by sending a test email to the user
    // if it fails, revert the changes
    if (await systemEmailService.testEmailConfig(res?._doc?.email, data.type)) {
      // if updated email config is updated for current provider, then re-setup the config
      if (res.email.currentProvider === data.type) {
        await systemEmailService.setupEmailsConfig(res?._doc?.email);
      }
      return {
        message: 'Email config updated successfully',
        isEmailConfigValid: true,
        email: res?._doc?.email,
      };
    }
    return {
      message: 'Email config updated successfully but test email failed. Please check your email config.',
      isEmailConfigValid: false,
      email: res?._doc?.email,
    };
  }

  async activateEmailConfig(data) {
    const rec = await this.Model.findOne({});
    switch (data.type) {
      case 'smtp':
        rec.email.smtp = {
          fromEmail: data.fromEmail,
          server: data.server,
          port: data.port,
          secure: data.secure,
          user: data.user,
          password: data.password,
        };
        break;
      case 'sendGrid':
        rec.email.sendGrid = {
          apiKey: data.apiKey,
          fromEmail: data.senderEmail,
        };
        break;
      default:
        break;
    }
    const res = await rec.save();
    if (await systemEmailService.testEmailConfig(res?._doc?.email, data.type)) {
      res.email.currentProvider = data.type;
      await res.save();
      await systemEmailService.setupEmailsConfig(res?._doc?.email);
      return {
        message: 'Config activated successfully',
        isEmailConfigValid: true,
        email: res?._doc?.email,
      };
    }
    return {
      message: 'Config is invalid. Please check your email config.',
      isEmailConfigValid: false,
      email: res?._doc?.email,
    };
  }

  async testEmailConfig(data) {
    const rec = await this.Model.findOne({});
    switch (data.type) {
      case 'smtp':
        rec.email.smtp = {
          fromEmail: data.fromEmail,
          server: data.server,
          port: data.port,
          secure: data.secure,
          user: data.user,
          password: data.password,
        };
        break;
      case 'sendGrid':
        rec.email.sendGrid = {
          apiKey: data.apiKey,
          fromEmail: data.senderEmail,
        };
        break;
      default:
        break;
    }
    const res = await rec.save();
    if (await systemEmailService.testEmailConfig(res?._doc?.email, data.type)) {
      return {
        message: 'Config is valid',
        isEmailConfigValid: true,
        email: res?._doc?.email,
      };
    }
    return {
      message: 'Invalid email config. Please check your email config.',
      isEmailConfigValid: false,
      email: res?._doc?.email,
    };
  }

  async getNotificationGroups() {
    const rec = await this.Model.findOne({});
    return rec.notification;
  }

  async updateNotificationGroups(data) {
    const rec = await this.Model.findOne({});
    rec.notification = {
      ...data,
    };
    const res = await rec.save();
    return res.notification;
  }

  async fetchUsersForAction(action) {
    const groups = CONSTANTS.NOTIFICATION_GROUPS;
    const rec = await this.Model.findOne({});
    const users = new Set();
    Object.keys(groups).forEach((key) => {
      if (groups[key].includes(action)) {
        rec.notification[key].forEach((user) => {
          users.add(user);
        });
      }
    });
    return [...users];
  }
}

module.exports = new SettingsService(SettingsModal.Model, SettingsModal.Schema);
