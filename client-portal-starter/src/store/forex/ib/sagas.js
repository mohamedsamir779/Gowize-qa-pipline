import { all, fork } from "redux-saga/effects";
import clientsSaga from "./clients/saga";
import transactionsSaga from "./transactions/saga";
import agreementSaga from "./agreements/saga";

export default function* forexSaga() {
  yield all([
    fork(clientsSaga),
    fork(transactionsSaga),
    fork(agreementSaga),
  ]);
}
