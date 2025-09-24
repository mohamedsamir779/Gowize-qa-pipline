import React from "react";
import { Redirect } from "react-router-dom";
//Dashboard
import Dashboard from "../pages/Crypto/Dashboard/index";
import Wallet from "../pages/Crypto/Wallet";
import QuickBuy from "../pages/Crypto/QuickBuy";
import Documents from "../pages/Documents";
import Referral from "../pages/Crypto/Referral";
import History from "../pages/Crypto/History";
import TwoFA from "../pages/Authentication/2FA";
import Test from "../pages/Crypto/test";
import BankAccounts from "pages/Crypto/BankAccounts/BankAccounts";
import Activities from "pages/Crypto/Activities";
import Exchange from "../pages/Crypto/Exchange";
import nonAuthRoutes from "./nonAuthRoutes";
import Profile from "pages/Authentication/Profile";
import Notifications from "pages/Authentication/Notifications";

export default [
  {
    path: "/dashboard",
    component: Dashboard,
    isAuth: true
  },
  //profile
  {
    path: "/documents",
    component: Documents,
    isAuth: true
  },
  {
    path: "/wallet",
    component: Wallet,
    isAuth: true
  },
  {
    path: "/quick-buy",
    component: QuickBuy,
    isAuth: true
  },
  {
    path: "/exchange",
    component: Exchange,
    isAuth: true
  },
  {
    path: "/referral",
    component: Referral,
    isAuth: true
  },
  {
    path: "/history",
    component: History,
    isAuth: true
  },
  {
    path: "/profile",
    component: Profile,
    isAuth: true
  },
  {
    path: "/two-fa",
    component: TwoFA,
    isAuth: true
  },
  {
    path: "/bank-account",
    component: BankAccounts,
    isAuth: true
  },
  {
    path: "/test",
    component: Test,
    isAuth: true
  },
  {
    path: "/activities",
    component: Activities,
    isAuth: true
  },
  {
    path: "/notifications",
    component: Notifications,
    isAuth: true
  },
  // this route should be at the end of all other routes
  {
    path: "/",
    exact: true,
    isAuth: true,
    component: () => <Redirect to="/dashboard" />
  },
  ...nonAuthRoutes
];