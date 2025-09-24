import { all, fork } from "redux-saga/effects";

import list from "./list/saga";
import transfers from "./transfer/saga";

export default function* goldSaga() {
  yield all([
    fork(transfers),
    fork(list),
  ]);
}