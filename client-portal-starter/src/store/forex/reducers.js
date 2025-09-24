import { combineReducers } from "redux";

import accounts from "./accounts/reducer";
import ForexLayout from  "./ForexLayout/reducer";
import requests from "./requests/reducer";
import ibReducer from "./ib/reducers";

const forexReducer = combineReducers({
  accounts,
  ForexLayout,
  requests,
  ib: ibReducer
});

export default forexReducer;