import { combineReducers } from "redux";

import list from "./list/reducer";
import transfers from "./transfer/reducer";

const rootReducer = combineReducers({
  wallet: list,
  transfers
});

export default rootReducer;