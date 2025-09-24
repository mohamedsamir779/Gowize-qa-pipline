import { all, fork } from "redux-saga/effects";

import generalSaga from "./general/sagas";
import cryptoSaga from "./crypto/sagas";
import forexSaga from "./forex/sagas";
import walletSaga from "./wallets/saga";

export default function* rootSaga() {
  yield all([
    fork(generalSaga),
    fork(cryptoSaga),
    fork(forexSaga),
    fork(walletSaga),
  ]);
}
