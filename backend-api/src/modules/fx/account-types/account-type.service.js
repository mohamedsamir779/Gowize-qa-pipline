// trading service for handling trading accounts

const {
  Cruds,
} = require('src/common/handlers');
const AccountTypeModel = require('./account-type.model');

class AccountType extends Cruds {
  async getNextSequence(accountTypeId) {
    const accountObj = await this.findById(accountTypeId, 'sequence');
    if (accountObj.sequence === undefined) return undefined;
    const doc = await this.Model.findOneAndUpdate({ _id: accountTypeId }, { $inc: { sequence: 1 } }, { new: true, fields: 'sequence' });
    return doc.sequence;
  }
}

const accountTypeService = new AccountType(AccountTypeModel.Model, AccountTypeModel.Schema);
module.exports = accountTypeService;
