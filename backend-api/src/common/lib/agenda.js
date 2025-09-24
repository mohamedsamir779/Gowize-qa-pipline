const Agenda = require('agenda');
const campaignAgenda = require('src/modules/campaigns/agenda');
const conversionRateAgenda = require('src/modules/conversionRate/agenda');
// const blockChainAgenda = require('src/modules/crypto/newBlockchain/agenda');
const todoAgenda = require('src/modules/todos/agenda');

const connectionOpts = {
  db: { address: process.env.MONGO_URI, collection: 'agendaJobs' },
};
const agend = new Agenda(connectionOpts);

(async () => {
  agend.on('ready', () => {
    campaignAgenda(agend);
    conversionRateAgenda(agend);
    // blockChainAgenda(agend);
    todoAgenda(agend);
    agend.start();
  });
})();

module.exports = agend;
