import { combineReducers } from "redux";

import calendar from "./calendar/reducer";
import chat from "./chat/reducer";
import invoices from "./invoices/reducer";
import contacts from "./contacts/reducer";
import markets from "./markets/reducer";
import historyReducer from "./history/reducer";
import wallets from "../wallets/reducer";
import orderBooks from "./orderBooks/reducer";
import orders from "./orders/reducer";
import depositReducer from "./deposit/reducer";
import klines from "./kline/reducer";
import withdrawReducer from "./withdraw/reducer";
import bankAccounts from "./bankAccount/reducer";
import depositsReducer from "./transactions/deposit/reducer";
import withdrawalsReducer from "./transactions/withdrawal/reducer";
import convert from "./convert/reducer";

const cryptoReducer = combineReducers({
  calendar,
  chat,
  invoices,
  contacts,
  markets,
  historyReducer,
  orderBooks,
  wallets,
  orders,
  klines,
  depositReducer,
  withdrawReducer,
  bankAccounts, 
  depositsReducer,
  withdrawalsReducer,
  convert,
});

export default cryptoReducer;