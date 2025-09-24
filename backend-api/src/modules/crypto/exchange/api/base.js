const ccxt = require('ccxt');
const { CONSTANTS } = require('src/common/data');

const {
  CREATE_MARKET_ORDER,
  CREATE_LIMIT_ORDER,
  BUY,
  SELL,
} = CONSTANTS;

class BaseExchange {
  constructor(id, options = { enableRateLimit: true }) {
    if (!ccxt.exchanges.includes(id)) { throw new Error('Exchange does not exist'); }
    this.id = id;
    // TODO: Change this when moving to production
    options = {
      ...options,
      // verbose: true,
      adjustForTimeDifference: true,
      enableRateLimit: true,
    };
    this.exchange = new ccxt[id](options);
  }

  getMarkets() {
    return this.exchange.loadMarkets();
  }

  getSymbols() {
    if (this.exchange.symbols) return this.exchange.symbols;
    throw new Error('Please load markets before accessing symbols');
  }

  getOrderbook(symbol, limit = 25) {
    return this.exchange.fetchOrderBook(symbol, limit);
  }

  getOhlc(
    symbol,
    timeframe,
    since = undefined,
    limit = undefined,
    params = {},
  ) {
    if (!this.exchange.has.fetchOHLCV) { throw new Error('Exchange does not OHLCV through ccxt'); }
    if (!this.exchange.timeframes[timeframe]) { throw new Error('Exchange does not support this timeframe'); }
    return this.exchange.fetchOHLCV(symbol, timeframe, since, limit, params);
  }

  getFetchBalance() {
    if (!this.exchange.has.fetchBalance) { throw new Error('Exchange does not support balances through ccxt'); }
    return this.exchange.fetchBalance();
  }

  getAvailableTimeframes() {
    return this.exchange.timeframes;
  }

  getExchange() {
    return this.exchange;
  }

  setTestNet() {
    this.exchange.urls.api = this.exchange.urls.test;
  }

  setLeverage() {
    throw new Error('Need to implement this method');
  }

  static _calculateLiquidation() {
    throw new Error('Need to implement this method');
  }

  async createMarketOrder(symbol, side, amount, params = {}) {
    if (!this.exchange.has[CREATE_MARKET_ORDER]) { throw new Error('This exchange does not support market orders'); }
    // eslint-disable-next-line default-case
    switch (side) {
      case BUY:
        return this.exchange.createMarketBuyOrder(
          symbol,
          amount,
          params,
        );
      case SELL:
        return this.exchange.createMarketSellOrder(
          symbol,
          amount,
          params,
        );
    }
    throw new Error('Side is not specified');
  }

  async createLimitOrder(symbol, side, amount, price, params) {
    if (!this.exchange.has[CREATE_LIMIT_ORDER]) { throw new Error('This exchange does not support limit orders'); }
    return this.exchange.createLimitOrder(
      symbol,
      side,
      amount,
      price,
      params,
    );
  }

  async getOrders(symbol) {
    if (!this.exchange.has.fetchOrder) { throw new Error('This exchange does not support fetching an order'); }
    return this.exchange.fetchOrders(symbol);
  }

  async getOrder(orderId, symbol) {
    if (!this.exchange.has.fetchOrder) { throw new Error('This exchange does not support fetching an order'); }
    return this.exchange.fetchOrder(orderId, symbol);
  }

  async getAllSymbolOrders(symbol) {
    if (!this.exchange.has.fetchOrders) { throw new Error('This exchange does not support fetching orders'); }
    return this.exchange.fetchOrders(symbol);
  }

  async closeOpenPositions() {
    throw new Error('Need to implement this method');
  }

  async cancelOpenOrder(orderId, symbol, params = {}) {
    if (!this.exchange.has.cancelOrder) {
      throw new Error(
        'This exchange does not support cancelling an order',
      );
    }
    return this.exchange.cancelOrder(orderId, symbol, params);
  }

  async getTrades(symbol, since, limit, params = {}) {
    if (!this.exchange.hasFetchMyTrades) { throw new Error('This exchange does not support getting trades'); }
    return this.exchange.fetchMyTrades(symbol, since, limit, params);
  }

  async getTickerPrice(symbol) {
    if (!this.exchange.hasFetchTicker) {
      throw new Error(
        'This exchange does not support getting ticker price',
      );
    }
    return this.exchange.fetchTicker(symbol);
  }

  async fetchExchangeAccounts(params = {}) {
    if (!this.exchange.hasFetchAccounts) {
      throw new Error(
        'This exchange does not support fetching accounts',
      );
    }
    return this.exchange.fetchAccounts(params);
  }

  async fetchExchangeAccountBalances() {
    if (!this.exchange.hasFetchBalance) {
      throw new Error(
        'This exchange does not support fetching account balances',
      );
    }
    return this.exchange.fetchBalance();
  }

  async withdraw(code, amount, address, tag = undefined, params = {}) {
    return this.exchange.withdraw(code, amount, address, tag, params);
  }
}

module.exports = BaseExchange;
