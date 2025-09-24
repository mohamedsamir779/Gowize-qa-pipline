import { socket } from "./index";

const updateMarkets = (currentMarkets, newData) => {
  newData.forEach(market => {
    const exists = currentMarkets.find((x) => x.pairName === market.pairName);
    if (!exists) currentMarkets.push(market);
  });
  let updatedData = currentMarkets;
  updatedData = updatedData.map((market) => {
    const found = newData.find((x) => x.pairName === market.pairName);
    return {
      ...market,
      ...found
    };
  });
  return updatedData;
};
const updateKlines = (currentKlines, newKline) => {
  if (currentKlines.symbol !== newKline.symbol) return currentKlines;
  currentKlines.data.push(newKline);
  return currentKlines;
};

const updateOrderBooks = (currentOrderBooks, newData) => {
  const exists = currentOrderBooks.find((x) => x.pairName === newData.pairName);
  if (!exists) currentOrderBooks.push(newData);
  let updatedData = currentOrderBooks;
  updatedData = updatedData.map((ob) => {
    const found = newData.pairName === ob.pairName;
    if (found) {
      return {
        ...ob,
        ...newData,
      };
    } else {
      return ob;
    }
  });
  return updatedData;
};

export const socketEvents = ({ state, setState }) => {
  if (state.markupId) {
    socket.on("pricing_6297aced413064506c846939", () => {
    });
  }
  socket.on("pricing", (msg) => {
    setState(state => {
      const message = JSON.parse(msg);
      const markets = updateMarkets(state.markets, message);
      return {
        ...state,
        markets
      };
    });
  });
  const klineEvent = state.markupId ? `kline_${state.markupId}` : "kline";
  socket.on(klineEvent, (msg) => {
    setState(state => {
      const message = JSON.parse(msg);
      // chart accepts kline times in secs
      message.time /= 1000;
      const klines = updateKlines(state.klines, message);
      return {
        ...state,
        klines
      };
    });
  });

  socket.on("orderbook", (msg) => {
    setState(state => {
      const message = JSON.parse(msg);
      const orderBooks = updateOrderBooks(state.orderBooks, message);
      return {
        ...state,
        orderBooks
      };
    });
  });
};