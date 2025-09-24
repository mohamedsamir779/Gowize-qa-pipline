import { combineReducers } from "redux";

import generalReducers from "./general/reducers";
import cryptoReducer from "./crypto/reducers";
import forexReducer from "./forex/reducers";
import walletReducer from "./wallets/reducer";
import { LOGOUT_USER } from "./general/auth/login/actionTypes";


const appReducers = combineReducers({
  ...generalReducers,
  shared: {}, // shared business logic between crypto and forex
  crypto: cryptoReducer,
  forex: forexReducer,
  walletReducer,
});

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_USER) {
    localStorage.removeItem("persist:Layout");
    return appReducers({}, action);
  }
  return appReducers(state, action);
};


export default rootReducer;