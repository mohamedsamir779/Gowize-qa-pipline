import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import Notifications from "./components/Common/NotificationPopup";
import * as serviceWorker from "serviceWorkerRegistration";

import AppStore from "./store";

const app = (
  <Provider store={AppStore.store}>
    <PersistGate loading={null} persistor={AppStore.persistor}>
      <Notifications store={AppStore.store} />
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
serviceWorker.register();
