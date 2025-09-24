const axios = require('axios');
const { keys } = require('src/common/data');

const conversionRateService = require('./conversionRate.service');

module.exports = async function (agenda) {
  agenda.define('fetchConversionRates', async () => {
    const cryptoData = await axios.get(`http://api.coinlayer.com/live?access_key=${keys.coinLayerAccessKey}&base=USD`);
    const fiatData = await axios.get('https://api.apilayer.com/fixer/latest?base=USD', { headers: { apiKey: keys.apiLayerAccessKey } });
    conversionRateService.getAllConversionRates(
      cryptoData.data,
      fiatData.data,
    );
  });
};
