//

const { Cruds, SendEvent } = require('src/common/handlers');
const { CONSTANTS } = require('../../common/data');
const { EVENT_TYPES, LOG_TYPES, LOG_LEVELS } = require('../../common/data/constants');
const { systemEmailService, customerService } = require('../services');
const BankAccountModel = require('./bankaccount.model');

class BankAccountService extends Cruds {
  async addBankAccount(params = {}) {
    const customer = await customerService.findById(params.customerId);
    systemEmailService.sendSystemEmail(
      CONSTANTS.EMAIL_ACTIONS.BANK_ADDED,
      {
        to: customer.email,
        lang: customer?.language,
      }, {
        bankName: params.bankName,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
    );
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.ADD_BANK_ACCOUNT,
      {
        customerId: params.customerId,
        userId: params.createdBy,
        triggeredBy: params.createdBy ? 1 : 0,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: {},
        content: params,
      },
    );
    return this.create(params);
  }

  async editBankAccount(id, params = {}) {
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.EDIT_BANK_ACCOUNT,
      {
        customerId: params.customerId,
        userId: params.updatedBy,
        triggeredBy: params.updatedBy ? 1 : 0,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: {},
        content: params,
      },
    );
    const customer = await customerService.findById(params.customerId);
    systemEmailService.sendSystemEmail(
      CONSTANTS.EMAIL_ACTIONS.BANK_UPDATED,
      {
        to: customer?.email,
        lang: customer?.language,
      }, {
        bankName: params.bankName,
        firstName: customer?.firstName,
        lastName: customer?.lastName,
      },
    );

    return this.updateById(id, params);
  }

  async deleteBankAccount(id, params = {}) {
    const customer = await customerService.findById(params.customerId);
    systemEmailService.sendSystemEmail(
      CONSTANTS.EMAIL_ACTIONS.BANK_DELETED,
      {
        to: customer?.email,
        lang: customer?.language,
      }, {
        firstName: customer?.firstName,
        lastName: customer?.lastName,
      },
    );
    SendEvent(
      EVENT_TYPES.EVENT_LOG,
      LOG_TYPES.DELETE_BANK_ACCOUNT,
      {
        customerId: params.customerId,
        userId: params.deletedBy,
        triggeredBy: params.deletedBy ? 1 : 0,
        userLog: false,
        level: LOG_LEVELS.INFO,
        details: {},
        content: {},
      },
    );
    return this.deleteById(id);
  }
}

module.exports = new BankAccountService(BankAccountModel.Model, BankAccountModel.Schema);
