const BaseExchange = require('./base');

class FTX extends BaseExchange {
  constructor(options) {
    const id = 'ftx';
    super(id, options);
  }
}

module.exports = FTX;
