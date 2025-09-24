const agenda = require('src/common/lib/agenda');

const scheduler = {
  getConversionRates: async () => {
    await agenda.every('8 hours', 'fetchConversionRates');
  },
};

module.exports = scheduler;
