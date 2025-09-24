//
const { default: axios } = require('axios');

const {
  Cruds,
  SendEvent,
  sleep,
} = require('src/common/handlers');
const { logger, sockets: SocketIO } = require('src/common/lib');
const OrderBookModel = require('./orderbook.model');

let marketService;
let markupService;
let pricingService;

const pairs = [];
class OrderBookService extends Cruds {
  async updateLocalOrderBookFromExchange(data, symbol, exchange) {
    try {
      const {
        pairName,
        _id: marketId,
      } = await marketService.findMarketWithoutSeparator(symbol, true);
      if (!pairName) {
        logger.info(`Local Market not Available for symbol: ${symbol}`);
        return;
      }
      // const localOrderBook = await this.findOne({
      //   pairName,
      //   exchange,
      // });
      const localOrderBook = pairs.find((x) => (x.pairName === pairName && x.exchange === exchange));
      const localOrderBookIndex = pairs.findIndex((x) => (x.pairName === pairName && x.exchange === exchange));
      const socketData = {
        bids: [],
        asks: [],
        pairName,
        exchange,
      };
      if (!localOrderBook || (localOrderBook && !localOrderBook.lastUpdateId)) {
        const fetchRes = await this.fetchDepthFromBinance(symbol);
        if (!fetchRes.data) {
          logger.info(`Error Fetching OrderBook Details of symbol: ${symbol}, from exchange: ${exchange}`);
        }
        let {
          asks,
          bids,
          lastUpdateId,
        } = fetchRes.data;
        // await this.update({
        //   pairName,
        //   exchange,
        // }, {
        //   pairName,
        //   marketId,
        //   asks: asks.map((d) => d.map(Number)),
        //   bids: bids.map((d) => d.map(Number)),
        //   lastUpdateId,
        //   buffer: [data],
        //   exchange,
        // }, {
        //   upsert: true,
        // });
        let mA = asks.map((d) => d.map(Number));
        let mB = bids.map((d) => d.map(Number));
        if (localOrderBookIndex >= 0) {
          pairs[localOrderBookIndex] = {
            ...localOrderBook,
            pairName,
            marketId,
            asks: mA,
            bids: mB,
            lastUpdateId,
            buffer: [data],
            exchange,
          };
        } else {
          pairs.push({
            pairName,
            marketId,
            asks: mA,
            bids: mB,
            lastUpdateId,
            buffer: [data],
            exchange,
          });
        }
        socketData.asks = mA;
        socketData.bids = mB;
        asks = null;
        bids = null;
        lastUpdateId = null;
        mA = null;
        mB = null;
      } else if (localOrderBook.lastUpdateId && localOrderBook.buffer.length) {
        let updatedBuffer = [...localOrderBook.buffer, data];
        let updatedBids = localOrderBook.bids;
        let updatedAsks = localOrderBook.asks;
        let updatedUpdateId = localOrderBook.lastUpdateId;
        const nextUpdateId = localOrderBook.lastUpdateId + 1;
        const fpidx = updatedBuffer.findIndex(
          (d) => d.firstUpdate <= nextUpdateId && d.lastUpdate >= nextUpdateId,
        );
        updatedBuffer = updatedBuffer.slice(fpidx);
        updatedBuffer.forEach((d) => {
          const newBids = d.bids.map((dd) => dd.map(Number));
          const newAsks = d.asks.map((dd) => dd.map(Number));
          newBids.forEach((dd) => {
            const idx = updatedBids.findIndex((v) => v[0] === dd[0]);
            if (idx > -1) {
              updatedBids[idx] = dd;
            } else {
              updatedBids = [...updatedBids, dd];
            }
          });
          newAsks.forEach((dd) => {
            const idx = updatedAsks.findIndex((v) => v[0] === dd[0]);
            if (idx > -1) {
              updatedAsks[idx] = dd;
            } else {
              updatedAsks = [...updatedAsks, dd];
            }
          });
          updatedBids = updatedBids.filter((v) => v[1]).sort((a, b) => b[0] - a[0]);
          updatedAsks = updatedAsks.filter((v) => v[1]).sort((a, b) => a[0] - b[0]);
          updatedUpdateId = data.lastUpdate;
        });
        updatedBuffer = [];
        // await this.update({
        //   pairName,
        //   exchange,
        // }, {
        //   asks: updatedAsks,
        //   bids: updatedBids,
        //   lastUpdateId: updatedUpdateId,
        //   buffer: updatedBuffer,
        // }, {});
        pairs[localOrderBookIndex] = {
          ...localOrderBook,
          asks: updatedAsks,
          bids: updatedBids,
          lastUpdateId: updatedUpdateId,
          buffer: updatedBuffer,
        };
        socketData.asks = updatedAsks;
        socketData.bids = updatedBids;
        updatedBuffer = null;
        updatedBids = null;
        updatedAsks = null;
        updatedUpdateId = null;
      } else {
        let updatedUpdateId = localOrderBook.lastUpdateId;
        if (data.firstUpdate !== updatedUpdateId + 1) {
          logger.info(`Order book out of sync for symbol: ${pairName}`);
          logger.info(`resetting order book for symbol: ${pairName}`);
          // await this.update({
          //   pairName,
          // }, {
          //   asks: [],
          //   bids: [],
          //   lastUpdateId: 0,
          //   buffer: [],
          // }, {});
          pairs[localOrderBookIndex] = {
            ...localOrderBook,
            asks: [],
            bids: [],
            lastUpdateId: 0,
            buffer: [],
          };
          return;
        }
        let updatedBids = localOrderBook.bids;
        let updatedAsks = localOrderBook.asks;
        const newBids = data.bids.map((dd) => dd.map(Number));
        const newAsks = data.asks.map((dd) => dd.map(Number));
        newBids.forEach((dd) => {
          const idx = updatedBids.findIndex((v) => v[0] === dd[0]);
          if (idx > -1) {
            updatedBids[idx] = dd;
          } else {
            updatedBids = [...updatedBids, dd];
          }
        });
        newAsks.forEach((dd) => {
          const idx = updatedAsks.findIndex((v) => v[0] === dd[0]);
          if (idx > -1) {
            updatedAsks[idx] = dd;
          } else {
            updatedAsks = [...updatedAsks, dd];
          }
        });
        updatedBids = updatedBids
          .filter((v) => v[1])
          .sort((a, b) => b[0] - a[0])
          .slice(0, 1000);
        updatedAsks = updatedAsks
          .filter((v) => v[1])
          .sort((a, b) => a[0] - b[0])
          .slice(0, 1000);
        updatedUpdateId = data.lastUpdate;
        // await this.update({
        //   pairName,
        //   exchange,
        // }, {
        //   asks: updatedAsks,
        //   bids: updatedBids,
        //   lastUpdateId: updatedUpdateId,
        // }, {});
        pairs[localOrderBookIndex] = {
          ...localOrderBook,
          asks: updatedAsks,
          bids: updatedBids,
          lastUpdateId: updatedUpdateId,
        };
        socketData.asks = updatedAsks;
        socketData.bids = updatedBids;
        updatedBids = null;
        updatedAsks = null;
      }
      // const used = process.memoryUsage();
      // for (let key in used) {
      //   console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
      // }
      pricingService.update({
        pairName: socketData.pairName,
        exchange: socketData.exchange,
      }, {
        buyPrice: socketData.asks[0][0] || 1,
        sellPrice: socketData.bids[0][0] || 1,
      });
      this.publishDataToSockets(socketData);
    } catch (error) {
      logger.info(`Error updating order book for ${symbol}, ${error.message}`);
    }
  }

  async publishDataToSockets(data = {}) {
    // const markups = await markupService.find({});
    const conn = SocketIO.connection();
    // const markedUpOrderBooks = {};
    // markups.forEach((markupData) => {
    //   const value = {
    //     ...data,
    //     asks: data.asks.map(
    //       (dd) => dd.map(
    //         (ddd, index) => (
    //           index === 0 ? markupService.getMarkedUpAmount(markupData, ddd, data.pairName) : ddd
    //         ),
    //       ),
    //     ),
    //     bids: data.bids.map(
    //       (dd) => dd.map(
    //         (ddd, index) => (
    //           index === 0 ? markupService.getMarkedDownAmount(markupData, ddd, data.pairName) : ddd
    //         ),
    //       ),
    //     ),
    //   };
    //   const key = markupData.isDefault ? `orderbook` : `orderbook_${markupData._id}`;
    //   markedUpOrderBooks[key] = value;
    // });
    // Object.keys(markedUpOrderBooks).forEach((key) => {
    conn.broadcastEvent('orderbook', data);
    // });
  }

  async fetchDepthFromBinance(symbol = 'ETH/USDT', limit = '1000') {
    await sleep(500);
    return axios.get(
      `https://api.binance.com/api/v3/depth?symbol=${symbol}&limit=${limit}`,
    );
  }

  async getMultipleMarkupPricing(data = [], markupId) {
    const markupData = await markupService.getMarkupData(markupId);
    data = data.map((d) => ({
      ...d,
      asks: d.asks.map(
        (dd) => dd.map(
          (ddd, index) => (
            index === 0 ? markupService.getMarkedUpAmount(markupData, ddd, d.pairName) : ddd
          ),
        ),
      ),
      bids: d.bids.map(
        (dd) => dd.map(
          (ddd, index) => (
            index === 0 ? markupService.getMarkedDownAmount(markupData, ddd, d.pairName) : ddd
          ),
        ),
      ),
    }));
    return data;
  }
}

module.exports = new OrderBookService(OrderBookModel.Model, OrderBookModel.Schema);

setTimeout(() => {
  const services = require('src/modules/services');
  marketService = services.marketService;
  markupService = services.markupService;
  pricingService = services.pricingService;
}, 0);
