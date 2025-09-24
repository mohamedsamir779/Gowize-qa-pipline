import { combineReducers } from "redux";
import ibClients from "./clients/reducer";
import transactions from "./transactions/reducer";
import agreementReducer from "./agreements/reducer";
const ibReducer = combineReducers({
  clients:ibClients,
  transactions,
  agreements: agreementReducer
});

export default ibReducer;