// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import ResetPassword from "pages/Authentication/ResetPassword";
import CryptoDemoRegister from "../pages/Authentication/Register/Crypto/CryptoDemoRegister";
import CryptoLiveRegister from "pages/Authentication/Register/Crypto/CryptoLiveRegister";
import ForexDemoRegister from "pages/Authentication/Register/Forex/ForexDemoRegister";
import ForexLiveRegister from "pages/Authentication/Register/Forex/ForexLiveRegister";
import ForexIbRegister from "pages/Authentication/Register/Forex/ForexIbRegister";
import CorpRegister from "pages/Authentication/Register/Forex/CorpRegister";
import CorpRegisterIB from "pages/Authentication/Register/Forex/CorpRegisterIB";
import Page404 from "../pages/Authentication/Page404";
import CampaignUnsubscribe from "pages/campaignUnsubscribe";

export default [
  //non Auth routes
  {
    path: "/logout",
    component: Logout,
    isAuth: false
  },
  {
    path: "/login",
    component: Login,
    isAuth: false
  },
  {
    path: "/forgot-password",
    component: ForgetPwd,
    isAuth: false
  },
  // {
  //   path: "/register/crypto/live",
  //   component: CryptoLiveRegister,
  //   isAuth: false
  // },
  // {
  //   path: "/register/crypto/demo",
  //   component: CryptoDemoRegister,
  //   isAuth: false
  // },
  {
    path: "/register/forex/live",
    component: ForexLiveRegister,
    isAuth: false
  },
  {
    path: "/register/forex/demo",
    component: ForexDemoRegister,
    isAuth: false
  },
  {
    path: "/register/forex/ib",
    component: ForexIbRegister,
    isAuth: false
  },
  {
    path: "/register/forex/corporate",
    component: CorpRegister,
    isAuth: false
  },
  {
    path: "/register/forex/corporate/ib",
    component: CorpRegisterIB,
    isAuth: false
  },
  {
    path: "/reset-password",
    component: ResetPassword,
    isAuth: false
  },
  {
    path: "/unsubscribe",
    component: CampaignUnsubscribe,
    isAuth: false
  },
  {
    path: "*",
    exact: true,
    component: Page404,
    isAuth: false
  },
];