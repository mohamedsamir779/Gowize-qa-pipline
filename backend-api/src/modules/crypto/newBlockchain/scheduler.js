const agenda = require('src/common/lib/agenda');

const scheduler = {
  getEthUpdates: async () => {
    await agenda.every('10 minutes', 'getEthBalanceUpdates');
  },
};

module.exports = scheduler;
