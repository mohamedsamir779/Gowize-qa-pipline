const baseFunctions = [
  'createAccount',
  'getAccount',
  'getEquity',
  'getBalance',
  'updateAccount',
  'changePassword',
  'changeLeverage',
  'deposit',
  'withdraw',
  'creditIn',
  'creditOut',
  'makeCommission',
  'addCommission',
  'addRebate',
  'getOpenPositions',
  'getClosePositions',
];
class TradingInterface {
  constructor() {
    baseFunctions.forEach((funName) => {
      if (!this[funName]) {
        throw new Error(`${funName} function must be defined`);
      }
    });
  }
}
module.exports = TradingInterface;
