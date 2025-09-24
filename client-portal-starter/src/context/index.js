import React, { useState, useEffect } from "react";
import SocketContext from "./context";
import { initSockets } from "../socket";

const SocketProvider = (props) => {
  const [state, setState] = useState({
    markets: [],
    klines: {
      symbol: "",
      data: []
    },
    orderBooks: [],
    markupId: null
  });
  useEffect(() => initSockets({
    state,
    setState
  }), [initSockets, state.markupId]);
  const value = {
    state,
    setState,
  };
  return (
    <SocketContext.Provider value={value}>
      {props.children}
    </SocketContext.Provider>
  );
};
export default SocketProvider;