//
const {
  Cruds,
} = require('src/common/handlers');
const ChainModel = require('./chain.model');

class ChainService extends Cruds {
  _constructor() {
    this.baseErrorMessage = 'Chain is not valid';
  }
}

module.exports = new ChainService(ChainModel.Model, ChainModel.Schema);
