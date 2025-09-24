import { createContext } from "react";

const SocketContext = createContext({
  markets: [],
  klines: {
    symbol: "",
    data: []
  },
  orderBooks: [],
  markupId: null,
});

export default SocketContext;