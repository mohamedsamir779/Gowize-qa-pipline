const moment = require('moment');
const { Spot } = require('@binance/connector');
const { keys } = require('src/common/data');
const { logger } = require('src/common/lib');
const {
  tradeService,
  pricingService,
  orderBookService,
  marketService,
  klineService,
} = require('src/modules/services');

const OrderIdCheck = new RegExp(/^\d{5,9}___\w{24}$/);

const decodeExecutionReport = (data) => ({
  eventType: data.e,
  eventTime: data.E,
  symbol: data.s,
  clientOrderId: data.c,
  side: data.S,
  type: data.o,
  timeInForce: data.f,
  orderQty: data.q,
  orderPrice: data.p,
  stopPrice: data.P,
  trailingDelta: data.d,
  icebergQty: data.F,
  orderListId: data.g,
  origClientOrderId: data.C,
  executionType: data.x,
  orderStatus: data.X,
  orderRejectReason: data.r,
  orderId: data.i,
  lastExQty: data.l,
  cumFilledQty: data.z,
  lastExPrice: data.L,
  commissionPrice: data.n,
  commissionAsset: data.N,
  transactionTime: data.T,
  tradeId: data.t,
  orderBook: data.w,
  maker: data.m,
  orderCreationTime: data.o,
  cumQuoteQty: data.Z,
  lastQuoteQty: data.Y,
  quoteOrderQty: data.Q,
  exchangeName: 'binance',
});

const decodeMiniTicker = (data) => ({
  eventType: data.e,
  eventTime: data.E,
  symbol: data.s,
  close: data.c,
  open: data.o,
  high: data.h,
  low: data.l,
  baseAssetVolume: data.v,
  quoteAssetVolume: data.q,
});

const decodeDepth = (data) => ({
  eventType: data.e,
  eventTime: data.E,
  symbol: data.s,
  firstUpdate: data.U,
  lastUpdate: data.u,
  bids: data.b,
  asks: data.a,
});

const decodeKline = (data) => ({
  eventType: data.e,
  eventTime: data.E,
  symbol: data.s,
  kline: {
    startTime: data.k.t,
    endTime: data.k.T,
    symbol: data.k.s,
    interval: data.k.i,
    firstTradeId: data.k.f,
    lastTradeId: data.k.L,
    open: data.k.o,
    high: data.k.h,
    low: data.k.l,
    close: data.k.c,
    volume: data.k.v,
    numberTrades: data.k.n,
    closed: data.k.x,
    quoteAssetVolume: data.k.q,
    takerBuyBaseVol: data.k.V,
    takerBuyQuoteVol: data.k.Q,
    ignore: data.k.B,
  },
});

const defaultUserDataMessageDecoder = async (message) => {
  if (message.e === 'executionReport' && (OrderIdCheck.test(message.c) || OrderIdCheck.test(message.C))) {
    await tradeService.onBinanceOrderUpdate(decodeExecutionReport(message));
  } else {
    logger.error(`Not executionReport type or orderIdCheck failed, Event: ${message.e}, orderId: ${message.c}`);
  }
};

const defaultMiniTickerMessageDecoder = async (message, exchangeName = 'binance') => {
  if (message[0].e === '24hrMiniTicker') {
    message = message.map((x) => decodeMiniTicker(x));
    // await pricingService.pushAllData(message, exchangeName);
  } else {
    logger.error(`Not 24hrMiniTicker type, Event: ${message.e}`);
  }
};

const defaultDepthMessageDecoder = async (message, exchangeName = 'binance', symbol) => {
  if (message.e === 'depthUpdate') {
    message = decodeDepth(message);
    // await orderBookService.updateLocalOrderBookFromExchange(message, symbol, exchangeName);
  } else {
    logger.error(`Not 24hrMiniTicker type, Event: ${message.e}`);
  }
};

const defaultKlineMessageDecoder = async (message, exchangeName = 'binance', symbol) => {
  if (message.e === 'kline') {
    message = decodeKline(message);
    // console.log('kline', message);
    // await klineService.updateKlineData(exchangeName, message);
    // await orderBookService.updateLocalOrderBookFromExchange(message, symbol, exchangeName);
  } else {
    logger.error(`Not kline type, Event: ${message.e}`);
  }
};
const defaultTradeMessageDecoder = async (message, exchangeName = 'binance', symbol) => {
  if (message.e === 'trade') {
    // message = decodeKline(message);
    // console.log('kline', message);
    // await klineService.updateKlineData(exchangeName, message);
    // await orderBookService.updateLocalOrderBookFromExchange(message, symbol, exchangeName);
  } else {
    logger.error(`Not trade type, Event: ${message.e}`);
  }
};
class BinanceWS {
  constructor(options) {
    this.apiKey = options.apiKey || keys.binanceKeys.apiKey || '';
    this.secret = options.secret || keys.binanceKeys.secret || '';
    this.testnet = options.testnet || false;
    this.regexCheck = new RegExp(/^\w{24}___\w{24}$/);
    this.depthWS = {};
    this.defaultUserDataMessageDecoder = defaultUserDataMessageDecoder;
    this.defaultMiniTickerMessageDecoder = defaultMiniTickerMessageDecoder;
    this.defaultDepthMessageDecoder = defaultDepthMessageDecoder;
    this.defaultKlineMessageDecoder = defaultKlineMessageDecoder;
    this.defaultTradeMessageDecoder = defaultTradeMessageDecoder;
    this.defaultSubscribeSymbols = [{ symbol: 'ETHUSDT' }];
  }

  async createConnection(
    userDataCallbacks = {},
    miniTickerCallbacks = {},
    depthCallbacks,
    klineCallbacks,
    tradeCallbacks,
  ) {
    this.client = new Spot(this.apiKey, this.secret, {
      baseURL: this.testnet ? '' : 'https://api.binance.com',
      wsURL: this.testnet ? 'wss://testnet.binance.vision' : 'wss://stream.binance.com:9443',
    });
    this.defaultSubscribeSymbols = (await marketService.getAllMarketsWithSeperator(''))
      .map((dd) => ({ symbol: dd }));
    if (!depthCallbacks) {
      depthCallbacks = this.defaultSubscribeSymbols;
      klineCallbacks = this.defaultSubscribeSymbols;
      tradeCallbacks = this.defaultSubscribeSymbols;
    }
    await this.createListenKey();
    await this.addUserDataListener(
      userDataCallbacks.onOpen,
      userDataCallbacks.onClose,
      userDataCallbacks.onMessage,
    );
    await this.addMiniTickerListener(
      miniTickerCallbacks.onOpen,
      miniTickerCallbacks.onClose,
      miniTickerCallbacks.onMessage,
    );
    depthCallbacks.forEach(async (data) => {
      await this.addDepthListener(
        data.symbol,
        data.speed,
        data.onOpen,
        data.onClose,
        data.onMessage,
      );
    });
    klineCallbacks.forEach(async (data) => {
      await this.addKlineListener(
        data.symbol,
        data.speed,
        data.onOpen,
        data.onClose,
        data.onMessage,
      );
    });
    tradeCallbacks.forEach(async (data) => {
      await this.addTradeListener(
        data.symbol,
        data.onOpen,
        data.onClose,
        data.onMessage,
      );
    });
  }

  async changeOptions(options = {}) {
    const tempCallbacks = this.userDataWS.callbacks;
    this.disconnectAllClientConnections();
    this.apiKey = options.apiKey;
    this.secret = options.secret;
    this.testnet = options.testnet;
    this.createConnection(tempCallbacks);
  }

  async disconnectListenKey() {
    if (this.listenKey) {
      this.client.closeListenKey(this.listenKey);
      this.listenKey = null;
      clearInterval(this.keepListenKeyAliveId);
    } else throw new Error('No listen key');
  }

  async createListenKey() {
    if (this.apiKey && this.secret) {
      const initialResponse = await this.client.createListenKey();
      this.listenKey = initialResponse.data.listenKey;
      // Keep alive a user data stream
      this.keepListenKeyAliveId = setInterval(() => {
        this.client.renewListenKey(this.listenKey);
      }, 1800000);
    } else {
      logger.info('Could not create listen key, since api key and secret not set');
    }
  }

  async addUserDataListener(
    onOpen = () => {
      logger.info('User Data connected');
    },
    onClose = () => {
      logger.info('User Data Disconnected');
    },
    onMessage = (message) => this.defaultUserDataMessageDecoder(JSON.parse(message)),
    // Message updates examples
    // onMessage = (message) => {
    //   console.log(message);
    //   const tradeRes = {
    //     e: 'executionReport',
    //     E: 1652278019942,
    //     s: 'BANDUSDT',
    //     c: '627bd53f3a74a664dc707043',
    //     S: 'SELL',
    //     o: 'MARKET',
    //     f: 'GTC',
    //     q: '63.30000000',
    //     p: '0.00000000',
    //     P: '0.00000000',
    //     F: '0.00000000',
    //     g: -1,
    //     C: '',
    //     x: 'NEW', // Current execution type
    //     X: 'NEW', // Current order status
    //     r: 'NONE',
    //     i: 942497422,
    //     l: '0.00000000', // Last executed quantity
    //     z: '0.00000000', // Cumulative filled quantity
    //     L: '0.00000000', // Last executed price
    //     n: '0',
    //     N: null,
    //     T: 1652278019941,
    //     t: -1,
    //     I: 1920134457,
    //     w: true,
    //     m: false,
    //     M: false,
    //     O: 1652278019941,
    //     Z: '0.00000000',
    //     Y: '0.00000000',
    //     Q: '0.00000000',
    //   };

    //   const tradeRes2 = {
    //     e: 'executionReport',
    //     E: 1652278019942,
    //     s: 'BANDUSDT',
    //     c: '627bd53f3a74a664dc707043',
    //     S: 'SELL',
    //     o: 'MARKET',
    //     f: 'GTC',
    //     q: '63.30000000', // Order quantity
    //     p: '0.00000000', // Order price
    //     P: '0.00000000',
    //     F: '0.00000000',
    //     g: -1,
    //     C: '',
    //     x: 'TRADE', // Current execution type
    //     X: 'FILLED', // Current order status
    //     r: 'NONE',
    //     i: 942497422,
    //     l: '63.30000000', // Last executed quantity
    //     z: '63.30000000', // Cumulative filled quantity
    //     L: '2.06600000', // Last executed price
    //     n: '0.13077780', // Commission amount
    //     N: 'USDT', // Commission asset
    //     T: 1652278019941, // Transaction time
    //     t: 37524854,
    //     I: 1920134458,
    //     w: false,
    //     m: false,
    //     M: true,
    //     O: 1652278019941,
    //     Z: '130.77780000',
    //     Y: '130.77780000',
    //     Q: '0.00000000',
    //   };
    // logger.info(`ticker for ${st.s}, ${st.o}, ${st.h}, ${st.l}, ${st.c}, ${st.v}`));
    //   const balanceChange = {
    //     e: 'outboundAccountPosition',
    //     E: 1652278019942,
    //     u: 1652278019941,
    //     B: [
    //       { a: 'BNB', f: '0.00001430', l: '0.00000000' },
    //       { a: 'USDT', f: '207.05967720', l: '0.00000000' },
    //       { a: 'BAND', f: '0.00894851', l: '0.00000000' },
    //     ],
    //   };
    //   logger.info(`On userData Message ${JSON.stringify(message)}`);
    // },
  ) {
    if (this.apiKey && this.secret) {
      this.userDataWS = {
        callbacks: {
          open: onOpen,
          close: onClose,
          message: onMessage,
        },
        wsRef: null,
      };
      this.userDataWS.wsRef = this.client.userData(this.listenKey, this.userDataWS.callbacks);
    } else {
      logger.info('User data listeners not added since api key and secret is not set');
    }
  }

  async removeUserDataListener() {
    if (this.userDataWS.wsRef) {
      this.client.unsubscribe(this.userDataWS.wsRef);
      this.userDataWS.wsRef = null;
    }
  }

  async addTicker(
    symbol,
    onOpen = () => {
      logger.info(`ticker for ${symbol} connected`);
    },
    onClose = () => {
      logger.info(`ticker for ${symbol} disconnected`);
    },
    onMessage = (message) => {
      logger.info(`ticker ${symbol} message ${JSON.stringify(message)}`);
    },
  ) {
    this.userDataWS = {
      callbacks: {
        open: onOpen,
        close: onClose,
        message: onMessage,
      },
      wsRef: null,
    };
  }

  async addMiniTickerListener(
    onOpen = () => {
      logger.info('ticker for all symbols connected');
    },
    onClose = () => {
      logger.info('ticker for symbols disconnected');
    },
    onMessage =
    (message) => this.defaultMiniTickerMessageDecoder(JSON.parse(message), this.exchangeName),
  ) {
    this.miniTickerWS = {
      callbacks: {
        open: onOpen,
        close: onClose,
        message: onMessage,
      },
      wsRef: null,
    };
    this.miniTickerWS.wsRef = this.client.miniTickerWS(null, this.miniTickerWS.callbacks);
  }

  async removeMiniTickerListener() {
    if (this.miniTickerWS.wsRef) {
      this.client.unsubscribe(this.miniTickerWS.wsRef);
      this.miniTickerWS.wsRef = null;
    }
  }

  async addDepthListener(
    symbol,
    speed = '1000ms',
    onOpen = () => {
      logger.info(`depth listener added for ${symbol}`);
    },
    onClose = () => {
      logger.info(`depth listener removed for ${symbol}`);
    },
    onMessage =
    (message) => this.defaultDepthMessageDecoder(JSON.parse(message), this.exchangeName, symbol),
  ) {
    this.depthWS[symbol] = {
      callbacks: {
        open: onOpen,
        close: onClose,
        message: onMessage,
      },
      wsRef: null,
    };
    this.depthWS[symbol].wsRef = this.client.diffBookDepth(
      symbol,
      speed,
      this.depthWS[symbol].callbacks,
    );
  }

  async addKlineListener(
    symbol,
    interval = '1m',
    onOpen = () => {
      logger.info(`kline listener added for ${symbol}`);
    },
    onClose = () => {
      logger.info(`kline listener removed for ${symbol}`);
    },
    onMessage =
    (message) => this.defaultKlineMessageDecoder(JSON.parse(message), this.exchangeName, symbol),
  ) {
    this.depthWS[symbol] = {
      callbacks: {
        open: onOpen,
        close: onClose,
        message: onMessage,
      },
      wsRef: null,
    };
    this.depthWS[symbol].wsRef = this.client.klineWS(
      symbol,
      interval,
      this.depthWS[symbol].callbacks,
    );
  }

  async addTradeListener(
    symbol,
    onOpen = () => {
      logger.info(`trade listener added for ${symbol}`);
    },
    onClose = () => {
      logger.info(`trade listener removed for ${symbol}`);
    },
    onMessage =
    (message) => this.defaultTradeMessageDecoder(JSON.parse(message), this.exchangeName, symbol),
  ) {
    this.depthWS[symbol] = {
      callbacks: {
        open: onOpen,
        close: onClose,
        message: onMessage,
      },
      wsRef: null,
    };
    this.depthWS[symbol].wsRef = this.client.tradeWS(
      symbol,
      this.depthWS[symbol].callbacks,
    );
  }

  async removeDepthListener(symbol) {
    if (this.depthWS[symbol].wsRef) {
      this.client.unsubscribe(this.depthWS[symbol].wsRef);
      this.depthWS[symbol].wsRef = null;
    }
  }

  addInstrumentPriceTicker() {
    this.ws.onTicker(this.pair, (data) => {
      if (this.onEmitPriceChangeListener) {
        this.onEmitPriceChangeListener(
          this.id,
          this.pair,
          data.currentClose,
          moment(data.eventTime).toISOString(),
          this.options.testnet,
        );
      }
    });
  }

  addOrderBook10Ticker() {
    this.ws.onDepthLevelUpdate(this.pair, 10, (data) => {
      if (this.onEmitOrderBookChangeListener) {
        this.onEmitOrderBookChangeListener(
          this.id,
          this.pair,
          data.bids,
          data.asks,
          data.eventTime,
        );
      }
    });
  }

  async disconnectAllClientConnections() {
    this.disconnectListenKey();
    this.removeUserDataListener();
  }
}

module.exports = BinanceWS;
