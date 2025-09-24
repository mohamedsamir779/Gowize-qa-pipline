import { persistReducer } from "redux-persist";

import Layout from "./layout/reducer";
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";
import assets from "./assets/reducer";
import documents from "./documents/reducer";
import logs from "./logs/reducer";
import resetPasswordReducer from "./auth/resetPassword/reducer";
import twoFactorAuthReducer from "./auth/twoFactorAuth/reducer";
import checkUser from "./auth/checkEmail/reducer";
import dictionary from "./dictionary/reducer";
import conversionReducer from "./conversionRates/reducer";
import subscriptions from "./subscriptions/reducer";

import { reducer as notifications } from "react-notification-system-redux";
import notificationsReducer from "./notifications/reducer";
import storage from "redux-persist/lib/storage";

const layoutConfig = {
  key: "Layout",
  storage,
  whitelist: ["subPortal"],
};

const generalReducers = {
  Layout: persistReducer(layoutConfig, Layout),
  Login,
  Account,
  ForgetPassword,
  Profile,
  documents,
  assets,
  resetPasswordReducer,
  twoFactorAuthReducer,
  logs,
  checkUser,
  dictionary,
  notifications,
  conversionReducer,
  subscriptionsReducer: subscriptions,
  notificationsReducer,
};

export default generalReducers;
