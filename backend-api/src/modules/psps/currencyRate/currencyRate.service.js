const {
    Cruds
  } = require('src/common/handlers');
  
const currencyRatesModel = require('./currency.model')
  class CurrencyRatesService extends Cruds {

  }
  
module.exports = new CurrencyRatesService(currencyRatesModel.Model, currencyRatesModel.Schema);
