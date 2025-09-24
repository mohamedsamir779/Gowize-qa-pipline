import { all, fork } from "redux-saga/effects";

import accountsSaga from "./accounts/saga";
import clientsSaga from "./ib/clients/saga";
import requests from "./requests/saga";
import ibSaga from "./ib/sagas";
import agreementSaga from "./ib/agreements/saga";
export default function* forexSaga() {
  yield all([
    fork(ibSaga),
    fork(accountsSaga),
    fork(clientsSaga),
    fork(requests),
    fork(agreementSaga),
  ]);
}
