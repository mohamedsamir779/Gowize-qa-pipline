const { ObjectId } = require('mongoose').Types;
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const { twoFAClientName } = require('src/common/data/keys');
const allServices = require('src/modules/services');
const {
  Cruds, encryptPassword, comparePassword, generatePassword, SendEvent,
} = require('src/common/handlers');
const { CONSTANTS, keys, ResponseMessages } = require('src/common/data');
const { logger, redis } = require('src/common/lib');
const { getBody } = require('../system-emails/template.service');
const UserModel = require('./users.model');
const { getInitialPushNotificationsSettings } = require('../notifications/notifications.service');

const service = new Cruds(UserModel.Model, UserModel.Schema);
module.exports = service;

const { rolesService } = allServices;

let systemEmailService;

const {
  LOG_TYPES,
  LOG_LEVELS,
  EMAIL_ACTIONS,
  EVENT_TYPES,
} = CONSTANTS;

class UserService extends Cruds {
  async create(params) {
    const addObj = await super.create(params);
    delete addObj.password;
    return addObj;
  }

  async createUser(params) {
    const user = await this.findOne({ email: params.email });
    if (user) throw new Error('User already registered.');
    const newUser = new UserModel.Model(params);
    newUser.password = await encryptPassword(newUser.password);
    const userAdded = await newUser.save();
    const token = newUser.generateAuthToken();
    userAdded.password = undefined;
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.CREATE_USER,
      {
        customerId: null,
        userId: params.createdBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: userAdded,
      },
    );
    return { user: userAdded, token };
  }

  async checkPassword(
    params,
    checkConfirm = true,
    checkOld = true,
    checkSame = true,
  ) {
    const {
      oldPassword,
      newPassword,
      cnfPassword = '',
      id,
    } = params;
    if (checkConfirm && newPassword !== cnfPassword) {
      throw new Error('Confirm Password not matching with password');
    }
    const user = await this.Model.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    if (checkOld) {
      const compare = await comparePassword(oldPassword, user._doc.password);
      if (!compare) {
        throw new Error('Incorrect old password');
      }
    }
    // if (checkSame) {
    //   const compare = await comparePassword(newPassword, user._doc.password);
    //   if (compare) {
    //     throw new Error('Password is the same, please provide a new password');
    //   }
    // }
    return true;
  }

  async updatePassword(params) {
    const {
      newPassword,
      id,
    } = params;
    await this.checkPassword(params, true, true);
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.CHANGE_PASSWORD,
      {
        customerId: null,
        userId: id,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {},
      },
    );
    return this.changePasswordById(newPassword, id);
  }

  async resetPassword(params) {
    const {
      password,
      id,
    } = params;
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.CHANGE_PASSWORD,
      {
        customerId: null,
        userId: id,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {},
      },
    );
    return this.changePasswordById(password, id);
  }

  async changePasswordById(password, id) {
    return super.updateById(id, {
      password: encryptPassword(password),
    });
  }

  async loginCrm(email, password) {
    const user = await this.findOne({ email: email?.toLowerCase() }, {}, {
      lean: false,
      populate: [{
        path: 'roleId',
        select: 'title key permissions isActive isAdmin',
      }],
    });
    const userObj = JSON.parse(JSON.stringify(user));
    if (!user || !user.isActive || !user.roleId || !user.roleId.isActive) {
      throw new Error(ResponseMessages.LOGIN_FAIL.message);
    }
    const passwordMatch = await comparePassword(password, user.password);
    if (!passwordMatch) throw new Error(ResponseMessages.LOGIN_FAIL.message);
    if (passwordMatch && user.settings && user.settings?.twoFactorAuthEnabled) {
      return {
        twoFactorAuthEnabled: user.settings?.twoFactorAuthEnabled,
      };
    }
    if (passwordMatch && !user.settings?.twoFactorAuthEnabled) {
      const token = user.generateAuthToken();
      redis.setKey(`${user._id.toString()}:${token}`, userObj, keys.crmTokenTime.seconds);
      return {
        token,
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        roleId: user.roleId,
      };
    }
    throw new Error(ResponseMessages.LOGIN_FAIL.message);
  }

  async updateRedisToken(userId, token) {
    const key = `${userId.toString()}:${token}`;
    if (redis.exists(key)) {
      const getUser = await this.findById(userId, {}, false, [{
        path: 'roleId',
        select: 'title key permissions isActive isAdmin',
      }]);
      const userObj = JSON.parse(JSON.stringify(getUser));
      const currentTTL = await redis.ttl(key);
      redis.setKey(key, userObj, currentTTL);
    } else {
      logger.error(`Redis key not found for user ${userId}`);
    }
  }

  async getUserById(id) {
    return this.findById(id, { password: 0 }, true, [{
      path: 'roleId',
      select: 'title key permissions',
    }]);
  }

  async checkEmail(email) {
    const customer = await this.findOne({ email });
    if (customer) {
      throw new Error('Email already registered');
    }
    return true;
  }

  async findById(id, projection = {}, lean = true, populate = []) {
    return super.findById(id, { ...projection, password: 0 }, lean, populate);
  }

  async find(params = {}, projection = {}, options = {}) {
    return super.find(params, { ...projection, password: 0 }, options);
  }

  async findWithPagination(params = {}, options = {}) {
    return super.findWithPagination(params, { ...options, projection: { password: 0 } });
  }

  async getAssignableUsers(params = {}, options = {}) {
    const assignableRoles = await rolesService.find({
      'permissions.users.canBeAssigned': true,
      isActive: true,
    }, { _id: 1 });
    return super.findWithPagination(
      { ...params, roleId: { $in: assignableRoles.map((obj) => obj._id) } },
      { ...options, projection: { password: 0 } },
    );
  }

  async findTeamMembers(params = {}, options = {}) {
    const memberRoles = await rolesService.find({
      'permissions.users.canBeTeamMember': true,
    }, { _id: 1 });
    return super.findWithPagination(
      {
        ...params,
        roleId: { $in: memberRoles.map((obj) => obj._id) },
        memberTeamId: { $eq: null },
      },
      { ...options, projection: { password: 0 } },
    );
  }

  async findPossibleTeamManagers(params = {}, options = {}) {
    const memberRoles = await rolesService.find({
      'permissions.users.canBeTeamManager': true,
    }, { _id: 1 });
    return super.findWithPagination(
      {
        ...params,
        roleId: { $in: memberRoles.map((obj) => obj._id) },
        memberTeamId: { $eq: null },
      },
      { ...options, projection: { password: 0 } },
    );
  }

  async updateById(id, params, updatedBy) {
    const user = await this.findById(id);
    if (!user) throw new Error('User does not exist');
    // if (user.email === 'admin@admin.com') throw new Error('This User Cannot be Updated');
    if (!params.settings) {
      SendEvent(
        EVENT_TYPES.EVENT_LOG,
        LOG_TYPES.UPDATE_USER,
        {
          customerId: null,
          userId: updatedBy,
          triggeredBy: 1,
          userLog: true,
          level: LOG_LEVELS.INFO,
          details: { previousData: user, newData: params },
          content: {},
        },
      );
    }
    return super.updateById(id, params);
  }

  async deleteById(id, deletedBy) {
    const user = await this.findById(id);
    if (!user) throw new Error('User does not exist');
    if (user.email === 'admin@admin.com') throw new Error('This User Cannot be Deleted');
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.DELETE_USER,
      {
        customerId: null,
        userId: deletedBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: { deletedUserEmail: user.email },
      },
    );
    return super.deleteById(id);
  }

  async endAllSessions(userId) {
    redis.deleteUserTokens(userId);
    return true;
  }

  async endAllSessionsByRole(roleId) {
    const users = await this.find({ roleId: ObjectId(roleId) });
    users.forEach((obj) => {
      redis.deleteUserTokens(obj._id.toString());
    });
    return true;
  }
  // async update() {
  //   throw new Error('This function not allowed here');
  // }

  async forgotPassword(email, _id) {
    const customer = email
      ? await this.findOne({ email }, {}, { lean: false })
      : await this.findOne({ _id }, {}, { lean: false });
    if (!customer) throw new Error(ResponseMessages.JOI_VALIDATION_ERROR.message);
    if (!customer.isActive) throw new Error(ResponseMessages.JOI_VALIDATION_ERROR.message);
    const token = customer.generateResetPasswordToken();
    redis.setKey(`${customer._id.toString()}:forgot_password:${token}`, { email: customer.email }, keys.cpTokenTime.seconds);
    const resetLink = `<a href="${keys.crmURL}/reset-password?token=${token}" target="_blank"> <strong><i>Reset Password</i></strong> </a>`;
    console.log(`Reset link: ${resetLink}`);
    systemEmailService.sendSystemEmail(EMAIL_ACTIONS.RESET_CRM_PASSWORD_LINK, {
      to: customer.email,
      resetLink,
      ...customer._doc,
      lang: customer?.language,
    });
    return true;
  }

  async changePassword(customerId, password = '') {
    const pass = encryptPassword(password || generatePassword());
    logger.warn(['password changed to ', pass, ' for ', customerId]);
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.CHANGE_PASSWORD,
      {
        customerId: null,
        userId: customerId,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {},
      },
    );
    return this.updateById(customerId, { password: pass });
  }

  async verifyTwoFactorAuth(params) {
    const {
      code,
      email,
      type = 'verify',
    } = params;
    const user = await this.findOne({ email }, {}, {
      lean: false,
      populate: [{
        path: 'roleId',
        select: 'title key permissions isActive',
      }],
    });
    const userObj = JSON.parse(JSON.stringify(user));
    if (!user) {
      throw new Error('Invalid email');
    }
    let secret;
    if (type === 'enable') {
      secret = await redis.getKey(`${user._id.toString()}:${email}:enable2FA`);
    } else {
      secret = user.twoFactorSecret;
    }
    const verified = speakeasy.totp.verify({
      secret: secret.ascii,
      encoding: 'ascii',
      token: code,
    });
    if (!verified) {
      throw new Error('Invalid two factor authentication code');
    }
    switch (type) {
      case 'login':
        // eslint-disable-next-line no-case-declarations
        const token = user.generateAuthToken();
        redis.setKey(`${user._id.toString()}:${token}`, userObj, keys.crmTokenTime.seconds);
        return {
          token,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          roleId: user.roleId,
        };
      case 'enable':
        if (user.settings?.twoFactorAuthEnabled) {
          throw new Error('2FA is already enabled');
        }
        SendEvent(
          EVENT_TYPES.EVENT_LOG,
          LOG_TYPES.ENABLE_2FA,
          {
            customerId: null,
            userId: user._id,
            triggeredBy: 1,
            userLog: true,
            level: LOG_LEVELS.INFO,
            details: {},
            content: {
              name: `${user.firstName} ${user.lastName}`,
            },
          },
        );
        systemEmailService.sendSystemEmail(
          CONSTANTS.EMAIL_ACTIONS.TWOFA_ENABLED,
          { to: user.email },
          {
            firstName: user.firstName,
            lastName: user.lastName,
          },
        );
        redis.getClient.del(`${user._id.toString()}:${email}:enable2FA`);
        await this.updateById(user._id, {
          settings: {
            ...user.settings,
            twoFactorAuthEnabled: true,
          },
          twoFactorSecret: secret,
        });
        return verified;
      case 'disable':
        if (!user.settings?.twoFactorAuthEnabled) {
          throw new Error('2FA is already disabled');
        }
        await this.updateById(user._id, {
          settings: {
            ...user.settings,
            twoFactorAuthEnabled: false,
          },
          twoFactorSecret: {},
        });
        SendEvent(
          EVENT_TYPES.EVENT_LOG,
          LOG_TYPES.DISABLE_2FA,
          {
            customerId: null,
            userId: user._id,
            triggeredBy: 1,
            userLog: true,
            level: LOG_LEVELS.INFO,
            details: {},
            content: {
              name: `${user.firstName} ${user.lastName}`,
            },
          },
        );
        systemEmailService.sendSystemEmail(
          CONSTANTS.EMAIL_ACTIONS.TWOFA_DISABLED,
          { to: user.email },
          {
            firstName: user.firstName,
            lastName: user.lastName,
          },
        );
        return verified;
      default:
        return verified;
    }
  }

  async generateQRCode(params) {
    const { email, _id } = params;
    const user = await this.findById(_id, {}, { lean: true });
    const secret = speakeasy.generateSecret({
      name: `${twoFAClientName} (CRM) / (${email})`,
    });
    if (!user.settings?.twoFactorAuthEnabled) {
      redis.setKey(`${user._id.toString()}:${email}:enable2FA`, secret, keys.twoFactorAuthTokenTime.seconds);
    } else {
      throw new Error('Already enabled 2FA');
    }
    const qrCodeData = await qrcode.toDataURL(secret.otpauth_url);
    if (!qrCodeData) {
      throw new Error('Cannot generate qr');
    }
    return qrCodeData;
  }

  async disableTwoFactorAuth(userId, disabledBy) {
    const user = await this.findOne({ _id: ObjectId(userId) });
    if (!user) throw new Error('Cannot find user');
    if (!user.settings?.twoFactorAuthEnabled) {
      throw new Error('Two factor authentication already disabled');
    }
    const res = await this.updateById(user._id, {
      settings: {
        ...user.settings,
        twoFactorAuthEnabled: false,
      },
      twoFactorSecret: {},
    });
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.DISABLE_2FA,
      {
        customerId: null,
        userId: disabledBy,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          name: `${user.firstName} ${user.lastName}`,
        },
      },
    );
    systemEmailService.sendSystemEmail(
      CONSTANTS.EMAIL_ACTIONS.TWOFA_DISABLED,
      { to: user.email },
      {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    );
    return res;
  }

  async updateUserSettings(userId, updatedBy, settingsToUpdate, currentToken) {
    const user = await this.findOne({ _id: ObjectId(userId) });
    if (!user) throw new Error('Cannot find user');
    let settings = {
      ...user?.settings,
    };
    let userLogDetails = {};
    let isEqual = false;
    Object.keys(settingsToUpdate).forEach((key) => {
      switch (key) {
        case 'pushNotifications':
          if (user.settings.pushNotifications === settingsToUpdate[key]) {
            logger.info(`Already set ${settingsToUpdate[key]}`);
            break;
          }
          settings = {
            ...settings,
            pushNotifications: settingsToUpdate[key],
          };
          userLogDetails = {
            customerId: null,
            userId: updatedBy,
            triggeredBy: 1,
            userLog: true,
            level: LOG_LEVELS.INFO,
            details: {},
            content: {
              updatedSetting: 'pushNotifications',
              oldSetting: user.settings.pushNotifications,
              newSetting: settingsToUpdate[key],
            },
          };
          break;
        case 'salesDashboard':
          isEqual = (user.settings?.salesDashboard?.length === settingsToUpdate[key].length)
            && (settingsToUpdate[key].every((val) => user.settings?.salesDashboard.includes(val)));
          if (isEqual) {
            logger.info(`Already set ${settingsToUpdate[key]}`);
            break;
          }
          settings = {
            ...settings,
            salesDashboard: settingsToUpdate[key],
          };
          userLogDetails = {
            customerId: null,
            userId: updatedBy,
            triggeredBy: 1,
            userLog: true,
            level: LOG_LEVELS.INFO,
            details: {},
            content: {
              updatedSetting: 'salesDashboard',
              oldSetting: user.settings?.salesDashboard,
              newSetting: settingsToUpdate[key],
            },
          };
          break;
        case 'salesDashboardLimit':
          if (user.settings?.salesDashboardLimit === settingsToUpdate[key]) {
            logger.info(`Already set ${settingsToUpdate[key]}`);
            break;
          }
          settings = {
            ...settings,
            salesDashboardLimit: settingsToUpdate[key],
          };
          userLogDetails = {
            customerId: null,
            userId: updatedBy,
            triggeredBy: 1,
            userLog: true,
            level: LOG_LEVELS.INFO,
            details: {},
            content: {
              updatedSetting: 'salesDashboardLimit',
              oldSetting: user.settings?.salesDashboardLimit,
              newSetting: settingsToUpdate[key],
            },
          };
          break;
        case 'enableCallStatusColors':
          if (user.settings?.enableCallStatusColors === settingsToUpdate[key]) {
            logger.info(`Already set ${settingsToUpdate[key]}`);
            break;
          }
          settings = {
            ...settings,
            enableCallStatusColors: settingsToUpdate[key],
          };
          userLogDetails = {
            customerId: null,
            userId: updatedBy,
            triggeredBy: 1,
            userLog: true,
            level: LOG_LEVELS.INFO,
            details: {},
            content: {
              updatedSetting: 'enableCallStatusColors',
              oldSetting: user.settings?.enableCallStatusColors,
              newSetting: settingsToUpdate[key],
            },
          };
          break;
        case 'callStatusColors':
          isEqual = (
            Object.keys(user.settings?.callStatusColors || {}).length
            === Object.keys(settingsToUpdate[key]).length
          )
            && !(Object
              .keys(user.settings?.callStatusColors || {})
              .some((val) => user.settings?.callStatusColors[val] !== settingsToUpdate[key][val]));
          if (isEqual) {
            logger.info(`Already set ${JSON.stringify(settingsToUpdate[key])}`);
            break;
          }
          settings = {
            ...settings,
            callStatusColors: settingsToUpdate[key],
          };
          userLogDetails = {
            customerId: null,
            userId: updatedBy,
            triggeredBy: 1,
            userLog: true,
            level: LOG_LEVELS.INFO,
            details: {},
            content: {
              updatedSetting: 'callStatusColors',
              oldSetting: user.settings?.callStatusColors,
              newSetting: settingsToUpdate[key],
            },
          };
          break;
        default:
          logger.error(`Invalid setting, cannot find this setting ${key}`);
      }
    });
    await this.updateById(user._id, {
      settings,
    });
    this.updateRedisToken(user._id, currentToken);
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.UPDATE_USER_SETTINGS,
      userLogDetails,
    );
    return settings;
  }

  async updateEmailConfig(data) {
    const rec = await this.Model.findById(data.userId);
    switch (data.type) {
      case 'smtp':
        rec.emails.smtp = {
          fromEmail: data.fromEmail,
          server: data.server,
          port: data.port,
          secure: data.secure,
          user: data.user,
          password: data.password,
        };
        break;
      case 'sendGrid':
        rec.emails.sendGrid = {
          apiKey: data.apiKey,
          fromEmail: data.senderEmail,
        };
        break;
      default:
        break;
    }
    const res = await rec.save();
    if (await systemEmailService.testEmailConfig(res?._doc?.emails, data.type)) {
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
    const rec = await this.Model.findById(data.userId);
    switch (data.type) {
      case 'smtp':
        rec.emails.smtp = {
          fromEmail: data.fromEmail,
          server: data.server,
          port: data.port,
          secure: data.secure,
          user: data.user,
          password: data.password,
        };
        break;
      case 'sendGrid':
        rec.emails.sendGrid = {
          apiKey: data.apiKey,
          fromEmail: data.senderEmail,
        };
        break;
      default:
        break;
    }
    const res = await rec.save();
    if (await systemEmailService.testEmailConfig(res?._doc?.emails, data.type)) {
      res.emails.currentProvider = data.type;
      await res.save();
      await systemEmailService.setupEmailsConfig();
      return {
        message: 'Config activated successfully',
        isEmailConfigValid: true,
        email: res?._doc?.email,
        type: data.type,
      };
    }
    return {
      message: 'Config is invalid. Please check your email config.',
      isEmailConfigValid: false,
      email: res?._doc?.email,
    };
  }

  async testEmailConfig(data) {
    const rec = await this.Model.findById(data.userId);
    switch (data.type) {
      case 'smtp':
        rec.emails.smtp = {
          fromEmail: data.fromEmail,
          server: data.server,
          port: data.port,
          secure: data.secure,
          user: data.user,
          password: data.password,
        };
        break;
      case 'sendGrid':
        rec.emails.sendGrid = {
          apiKey: data.apiKey,
          fromEmail: data.senderEmail,
        };
        break;
      default:
        break;
    }
    const res = await rec.save();
    if (await systemEmailService.testEmailConfig(res?._doc?.emails, data.type)) {
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

  async sendEmail(params = {}, userId) {
    const {
      from, to, subject, body, attachments, provider,
    } = params;
    if (!to) throw new Error('Email recipient not speicified');
    if (!from) throw new Error('Email sender not speicified');
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.USER_EMAIL,
      {
        customerId: null,
        userId,
        triggeredBy: 1,
        userLog: true,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {
          from, to, subject, body, attachments,
        },
      },
    );
    return this.sendMail({
      from, to, subject, body, attachments, provider,
    }, params.fields, params.clientData);
  }

  // eslint-disable-next-line consistent-return
  async sendMail(params = {}, fields, data) {
    const {
      from, to, subject = '', body = '', attachments = [], provider, language = 'en',
    } = params;
    if (!provider) {
      throw new Error('Email provider not speicified');
    }
    const content = getBody(body, fields, data, language);
    const msg = {
      from: from.fromEmail,
      to,
      subject,
      html: content,
      attachments,
    };
    switch (provider) {
      case 'sendGrid':
        sgMail.setApiKey(from.apiKey);
        return sgMail
          .send(msg)
          .then((res) => {
            logger.info('Email send success response');
            return res;
          })
          .catch((error) => {
            logger.error('Email send error response');
            logger.error(error);
            throw error;
          });
      case 'smtp':
        // eslint-disable-next-line no-case-declarations
        return nodemailer.createTransport({
          host: from.server,
          port: from.port,
          secure: from.secure, // true for 465, false for other ports
          auth: {
            user: from.user, // generated ethereal user
            pass: from.password, // generated ethereal password
          },
        }).sendMail(msg).then((res) => {
          logger.info('Email send success response');
          return { messageId: res.messageId };
        })
          .catch((error) => {
            logger.error('Email send error response');
            logger.error(error);
            throw error;
          });
      default:
        break;
    }
  }
}

module.exports = new UserService(UserModel.Model, UserModel.Schema);

setTimeout(() => {
  // eslint-disable-next-line global-require
  const services = require('src/modules/services');
  systemEmailService = services.systemEmailService;
}, 0);
