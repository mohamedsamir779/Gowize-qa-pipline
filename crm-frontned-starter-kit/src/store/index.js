import {
  createStore, applyMiddleware, compose
} from "redux";
import createSagaMiddleware from "redux-saga";
import thunk from "redux-thunk";

import rootReducer from "./reducers";
import rootSaga from "./sagas";
import { devMode } from "../config";

const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = devMode ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
  trace: true,
  traceLimit: 25
}) || compose : compose;
const middlewares = [sagaMiddleware, thunk];
const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(...middlewares))
);
sagaMiddleware.run(rootSaga);

export default store;
