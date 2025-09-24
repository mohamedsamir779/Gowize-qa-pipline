//
const moment = require('moment');
const {
  batchCandleJSON,
} = require('candlestick-convert');
const {
  Cruds,
  SendEvent,
  RoundDate,
  sleep,
  getFromToMSFromSince,
  formatKline,
  getDataFromTimespan,
  getHighChartsKey,
} = require('src/common/handlers');
const { CONSTANTS, keys } = require('src/common/data');
const { logger, redis, sockets: SocketIO } = require('src/common/lib');
const { getExchange } = require('src/modules/crypto/exchange/api');
const KlineModel = require('./kline.model');

let markupService;
let marketService;
let settingsService;
class KlineService extends Cruds {
  async fetchOHLCVFromExchange(exchange, symbol, since, limit, timeframe = '1m') {
    if (!exchange.name) {
      const allExchanges = await settingsService.getSettings('exchanges');
      exchange = allExchanges.find((ex) => ex.name === exchange);
    }
    const apiExchange = getExchange(
      exchange.name, {
        apiKey: exchange.apiKey,
        secret: exchange.secret,
        ...exchange.extraParams,
      },
    );
    return apiExchange.getOhlc(symbol, timeframe, since, limit);
  }

  async fetchChartDataForAllMarkets(params) {
    const {
      timespan,
      markupId,
    } = params;
    const allMarkets = await marketService.getAllMarkets();
    const {
      since,
      timeframe,
      limit,
    } = getDataFromTimespan(timespan);
    const {
      fromMS,
      toMS,
      time,
      unit,
    } = getFromToMSFromSince(since, timeframe, limit);
    const baseFrame = 60;
    const newFrame = moment.duration(time, unit).valueOf() / 1000;
    const dataToReturn = [];
    for (let i = 0; i < allMarkets.length; i++) {
      const currentMarket = allMarkets[i];
      const key = getHighChartsKey(timespan, currentMarket);
      let dataForSymbol = [];
      const highData = await redis.getKey(key);
      if (highData && highData.length > 0) {
        dataForSymbol = await this.getMultipleMarkupHighArray(highData, markupId, currentMarket);
      } else {
        let allData = await this.find({
          e: 'binance',
          s: currentMarket,
          t: {
            $gte: fromMS,
            $lt: toMS,
          },
        }, { h: 1, t: 1 });
        allData = allData.map((d) => formatKline(d, true));
        const correctData = batchCandleJSON(allData, baseFrame, newFrame);
        const d = correctData.map((x) => x.high);
        dataForSymbol = await this.getMultipleMarkupHighArray(d, markupId, currentMarket);
      }
      dataToReturn.push({
        name: currentMarket,
        data: dataForSymbol,
      });
    }
    return dataToReturn;
  }

  async fetchOHLCVFromDB(params) {
    let {
      e = 'binance',
    } = params;
    const {
      symbol: s,
      since = new Date(Date.now() - 500 * 60000),
      limit = 500,
      timeframe = '1m',
      markupId = null,
    } = params;
    if (!e.name) {
      const allExchanges = await settingsService.getSettings('exchanges');
      e = allExchanges.find((ex) => ex.name === e);
    }
    if (limit > 1000) {
      throw new Error('Maximum limit is 1000');
    }
    const {
      fromMS,
      toMS,
      time,
      unit,
    } = getFromToMSFromSince(since, timeframe, limit);
    let allData;
    if (timeframe === '1m') {
      allData = await this.find({
        e: e.name,
        s,
        t: {
          $gte: fromMS,
          $lt: toMS,
        },
      });
    }
    allData = await this.find({
      e: e.name,
      s,
      t: {
        $gte: fromMS,
        $lt: toMS,
      },
    });
    allData = allData.map((d) => formatKline(d, true));
    const baseFrame = 60;
    const newFrame = moment.duration(time, unit).valueOf() / 1000;
    return batchCandleJSON(allData, baseFrame, newFrame);
  }

  _setRequiredTimestamps(timeFrame, fromMS, toMS, currentTimeFrames) {
    const requiredTimeStamps = [];
    const unit = timeFrame[timeFrame.length - 1];
    const time = parseInt(timeFrame.slice(0, timeFrame.indexOf(unit)), 10);
    requiredTimeStamps.push(fromMS);
    while (fromMS !== toMS) {
      fromMS += moment.duration(time, unit).asMilliseconds();
      if (currentTimeFrames) {
        if (!currentTimeFrames.find(fromMS)) requiredTimeStamps.push(fromMS);
      } else {
        requiredTimeStamps.push(fromMS);
      }
    }
    return requiredTimeStamps;
  }

  _newCheckCandleExistsAndAdd(currentKlines, e, s, candleToAdd) {
    if (currentKlines.findIndex((x) => x.t === candleToAdd[0]) === -1) {
      currentKlines.push({
        e: e.name || e,
        s,
        t: candleToAdd[0],
        o: candleToAdd[1],
        h: candleToAdd[2],
        l: candleToAdd[3],
        c: candleToAdd[4],
        v: candleToAdd[5],
      });
    }
  }

  makeBroadcaseSocketData(markups, klineData) {
    const d = {};
    markups.forEach((markupData) => {
      const mKlineForSymbol = markupService.getMarkupForMarketFromData(markupData, klineData.s);
      // const key = markupData.isDefault ? 'kline' : `kline_${markupData._id}`;
      const key = 'kline';
      const markedUpKline = {
        ...klineData,
        open: markupService.getMarkedUpAmount(mKlineForSymbol, klineData.open, klineData.symbol),
        high: markupService.getMarkedUpAmount(mKlineForSymbol, klineData.high, klineData.symbol),
        low: markupService.getMarkedUpAmount(mKlineForSymbol, klineData.low, klineData.symbol),
        close: markupService.getMarkedUpAmount(mKlineForSymbol, klineData.close, klineData.symbol),
      };
      d[key] = markedUpKline;
    });
    return d;
  }

  async getMultipleMarkupKline(data = [], markupId) {
    const markupData = await markupService.getMarkupData(markupId);
    data = data.map((d) => ({
      ...d,
      low: markupService.getMarkedUpAmount(markupData, d.low, d.symbol),
      open: markupService.getMarkedUpAmount(markupData, d.open, d.symbol),
      close: markupService.getMarkedUpAmount(markupData, d.close, d.symbol),
      high: markupService.getMarkedUpAmount(markupData, d.high, d.symbol),
      volume: d.volume || '0',
    }));
    return data;
  }

  async getMultipleMarkupHighArray(data = [], markupId, symbol) {
    const markupData = await markupService.getMarkupData(markupId);
    data = data.map((d) => (markupService.getMarkedUpAmount(markupData, d, symbol)));
    return data;
  }

  async updateKlineData(e, klineData = {}) {
    const {
      kline,
      symbol: s,
    } = klineData;
    const {
      pairName: symbol,
    } = await marketService.findMarketWithoutSeparator(s, true);
    if (kline) {
      const {
        startTime: time,
        open,
        high,
        low,
        close,
        volume,
        closed,
      } = kline;
      const data = {
        e,
        symbol,
        time,
        open,
        high,
        low,
        close,
        volume,
        closed,
      };
      // sockets update
      const conn = SocketIO.connection();
      const markups = await markupService.find({});
      const events = this.makeBroadcaseSocketData(markups, data);
      Object.keys(events).forEach((key) => {
        conn.broadcastEvent(key, events[key]);
      });
      await this.update({
        s: symbol,
        e,
        t: time,
      }, {
        e,
        s: symbol,
        t: time,
        o: open,
        h: high,
        l: low,
        c: close,
        v: volume,
        x: closed,
      }, { upsert: true });
      // if candle closed, then push updates to the redis cache
      this.checkAndUpdateCache({ ...kline, symbol: s });
    }
  }

  async checkAndUpdateCache(kline) {
    const {
      startTime: t,
      closed: x,
      symbol,
    } = kline;
    if (x) {
      let timespan;
      // push data to the 24h cache
      if (t % 1800000 === 0) {
        timespan = '24h';
      } else if (t % 14400000 === 0) {
        timespan = '7d';
      } else if (t % 86400000 === 0) {
        timespan = '30d';
      }
      if (timespan) {
        this.updateInitialCacheData(timespan, symbol);
      }
    }
  }

  async fetchAndSaveOHLCVForAllExchangesAndSymbols() {
    const allExchanges = await settingsService.getSettings('exchanges');
    const allMarkets = ['DOGE/USDT'];
    const fromDateTime = new Date(1657696140000);
    const toDateTime = new Date(1657788300000);
    const timeFrame = '1m';
    const unit = timeFrame[timeFrame.length - 1];
    const time = parseInt(timeFrame.slice(0, timeFrame.indexOf(unit)), 10);
    const fromMS = RoundDate(
      fromDateTime,
      moment.duration(time, unit),
      'floor',
    ).valueOf();
    let toMS = RoundDate(
      toDateTime,
      moment.duration(time, unit),
      'floor',
    ).valueOf();
    if (fromMS >= toMS) {
      throw new Error('Last candle cannot be before the 1st candle');
    }
    const requiredFromMS = fromMS;
    const requiredToMS = toMS;
    for (let i = 0; i < allExchanges.length; i++) {
      const currentExcahnge = allExchanges[i];
      for (let j = 0; j < allMarkets.length; j++) {
        const currentSymbol = allMarkets[j];
        // const currentMarket = await marketService.findOne({pairName: currentSymbol});
        const currentKlines = [];
        const currentTimeFrames = [];
        let dataToPush = [];
        // const currentlySavedCandles = await this.find({
        //   exchange: currentExcahnge,
        //   pairName: currentSymbol,
        // });
        // if (currentlySavedCandles && currentlySavedCandles.klines) {
        //   currentKlines = currentlySavedCandles.klines;
        //   currentTimeFrames = currentlySavedCandles.timeFrames;
        // }
        const requiredTimeFrames = this._setRequiredTimestamps(
          timeFrame,
          requiredFromMS,
          requiredToMS,
        );
        const toFetchCandleTimestamps = requiredTimeFrames;
        let fetchedTimeStamps = [];
        const unit = timeFrame[timeFrame.length - 1];
        const time = parseInt(timeFrame.slice(0, timeFrame.indexOf(unit)), 10);
        toMS += moment.duration(time, unit).asMilliseconds();
        // toMS = toMS >= 1657788300000 ? 1657788300000 : toMS;
        let firstCandleTime = fromMS;
        const totalNumberOfCandles = (toMS - fromMS) / moment.duration(time, unit).asMilliseconds();
        let maxCandles = totalNumberOfCandles >= 1000 ? 1000 : totalNumberOfCandles;
        let candlesLeftToFetch = totalNumberOfCandles;
        while (candlesLeftToFetch > 0) {
          const fetchedCandles = await this.fetchOHLCVFromExchange(
            currentExcahnge,
            currentSymbol,
            firstCandleTime,
            maxCandles,
            timeFrame,
            {},
          );
          // eslint-disable-next-line no-loop-func
          fetchedCandles.map((currentCandle) => {
            fetchedTimeStamps = [...fetchedTimeStamps, currentCandle[0]];
            // let data = {
            //   exchange: currentExcahnge,
            //   pairName: currentSymbol,
            //   t: currentCandle[0],
            //   o: currentCandle[1],
            //   h: currentCandle[2],
            //   l: currentCandle[3],
            //   c: currentCandle[4],
            //   v: currentCandle[5],
            // };
            // dataToPush.push(data);
            this._newCheckCandleExistsAndAdd(
              dataToPush,
              currentExcahnge,
              currentSymbol,
              currentCandle,
            );
            // this._checkCandleExistsAndAdd(
            //   currentKlines,
            //   currentTimeFrames,
            //   currentCandle,
            // );
          });
          firstCandleTime = fetchedCandles[maxCandles - 1][0]
            + moment.duration(time, unit).asMilliseconds();
          candlesLeftToFetch -= maxCandles;
          maxCandles = candlesLeftToFetch <= 1000 ? candlesLeftToFetch : maxCandles;
          await sleep(300);
        }
        dataToPush = dataToPush.sort((a, b) => a.t - b.t);
        // currentKlines = currentKlines.sort(
        //   (a, b) => a - b,
        // );
        await this.createBulk(dataToPush);
        // let currentSince = moment().startOf('minute').subtract(limit, 'minutes').valueOf();
        // let data = await this.fetchOHLCVFromExchange(
        //   currentExcahnge,
        //   currentSymbol,
        //   currentSince,
        //   limit,
        // );
        // const a = await this.update({
        //   exchange: currentExcahnge.name,
        //   symbol: currentSymbol,
        // }, {

        // })
        // while (data && data.length > 0) {
        //   currentSince = moment(currentSince).subtract(limit, 'minutes').valueOf();
        //   data = await this.fetchOHLCVFromExchange(
        //     currentExcahnge,
        //     currentSymbol,
        //     currentSince,
        //     limit,
        //   );
        // }
      }
    }
  }

  async updateInitialCacheData(ts = null, market = null) {
    const allMarkets = market ? [market] : await marketService.getAllMarkets();
    const allTimespans = ts ? [ts] : CONSTANTS.TIMESPANS;
    for (let i = 0; i < allTimespans.length; i++) {
      const timespan = allTimespans[i];
      const {
        since,
        timeframe,
        limit,
      } = getDataFromTimespan(timespan);
      const {
        fromMS,
        toMS,
        time,
        unit,
      } = getFromToMSFromSince(since, timeframe, limit);
      const baseFrame = 60;
      const newFrame = moment.duration(time, unit).valueOf() / 1000;
      for (let j = 0; j < allMarkets.length; j++) {
        const currentMarket = allMarkets[j];
        let allData = await this.find({
          e: 'binance',
          s: currentMarket,
          t: {
            $gte: fromMS,
            $lt: toMS,
          },
        }, { h: 1, t: 1 });
        allData = allData.map((d) => formatKline(d, true));
        const correctData = batchCandleJSON(allData, baseFrame, newFrame);
        const value = correctData.map((x) => x.high);
        const key = getHighChartsKey(timespan, currentMarket);
        logger.info(`setting redis cache ${key}`);
        redis.setKey(key, value, keys.chartDataTime[timespan]);
      }
    }
  }
}

module.exports = new KlineService(KlineModel.Model, KlineModel.Schema);

setTimeout(() => {
  const services = require('src/modules/services');
  markupService = services.markupService;
  marketService = services.marketService;
  settingsService = services.settingService;
}, 0);
