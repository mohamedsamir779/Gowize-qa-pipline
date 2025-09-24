import { all, fork } from "redux-saga/effects";

import calendarSaga from "./calendar/saga";
import chatSaga from "./chat/saga";
import invoiceSaga from "./invoices/saga";
import contactsSaga from "./contacts/saga";
import marketsSaga from "./markets/saga";
import historySaga from "./history/saga";
import orderBooksSaga from "./orderBooks/saga";
import ordersSaga from "./orders/saga";
import klineSaga from "./kline/saga";
import depositsSaga from "./deposit/saga";
import withdrawsSaga from "./withdraw/saga";
import bankAccountsSaga from "./bankAccount/saga";
import deposits from "./transactions/deposit/saga";
import withdrawals from "./transactions/withdrawal/saga";
import convertSaga from "./convert/saga";

export default function* cryptoSaga() {
  yield all([
    fork(calendarSaga),
    fork(chatSaga),
    fork(invoiceSaga),
    fork(contactsSaga),
    fork(marketsSaga),
    fork(historySaga),
    fork(orderBooksSaga),
    fork(ordersSaga),
    fork(klineSaga),
    fork(depositsSaga),
    fork(withdrawsSaga),
    fork(bankAccountsSaga),
    fork(deposits),
    fork(withdrawals),
    fork(convertSaga),
  ]);
}
