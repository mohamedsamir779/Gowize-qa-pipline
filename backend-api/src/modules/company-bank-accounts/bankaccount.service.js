const { Cruds } = require('src/common/handlers');
// const { CONSTANTS } = require('../../common/data');
// const { EVENT_TYPES, LOG_TYPES, LOG_LEVELS } = require('../../common/data/constants');
// const { systemEmailService, customerService } = require('../services');
const CompanyBankAccountModel = require('./bankaccount.model');

class BankAccountService extends Cruds {
  async addBankAccount(params = {}) {
    // SendEvent(
    //   EVENT_TYPES.EVENT_LOG,
    //   LOG_TYPES.ADD_BANK_ACCOUNT,
    //   {
    //     userId: params.userId,
    //     triggeredBy: params.userId ? 1 : 0,
    //     userLog: true,
    //     level: LOG_LEVELS.INFO,
    //     details: {},
    //     content: params,
    //   },
    // );
    return this.create(params);
  }

  async editBankAccount(id, params = {}) {
    // SendEvent(
    //   EVENT_TYPES.EVENT_LOG,
    //   LOG_TYPES.EDIT_BANK_ACCOUNT,
    //   {
    //     customerId: params.customerId,
    //     userId: params.userId,
    //     triggeredBy: params.userId ? 1 : 0,
    //     userLog: true,
    //     level: LOG_LEVELS.INFO,
    //     details: {},
    //     content: params,
    //   },
    // );
    return this.updateById(id, params);
  }

  async deleteBankAccount(id) {
    // SendEvent(
    //   EVENT_TYPES.EVENT_LOG,
    //   LOG_TYPES.DELETE_BANK_ACCOUNT,
    //   {
    //     customerId: params.customerId,
    //     userId: params.userId,
    //     triggeredBy: params.userId ? 1 : 0,
    //     userLog: true,
    //     level: LOG_LEVELS.INFO,
    //     details: {},
    //     content: {},
    //   },
    // );
    return this.deleteById(id);
  }
}

module.exports = new
BankAccountService(CompanyBankAccountModel.Model, CompanyBankAccountModel.Schema);
