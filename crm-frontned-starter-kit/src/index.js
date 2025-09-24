import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { Provider } from "react-redux";
import Notifications from "./components/Common/NotificationPopup";
import store from "./store";
import * as serviceWorker from "serviceWorkerRegistration";

const app = (
  <Provider store={store}>
    <Notifications store={store} />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

ReactDOM.render(app, document.getElementById("root"));
serviceWorker.register();