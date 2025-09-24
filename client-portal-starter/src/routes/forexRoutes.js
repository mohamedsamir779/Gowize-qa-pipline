import { Redirect } from "react-router-dom";
import Dashboard from "pages/Forex/Dashboard/index";
import Accounts from "pages/Forex/Accounts";
import Login from "pages/Authentication/Login";
import ChangePassword from "pages/Forex/ChangePassword";
import InternalTransfer from "pages/Forex/InternalTransfer";
import ibInternalTransfer from "pages/Forex/Partnership/InternalTransfer";
import Withdraw from "pages/Forex/Withdraw";
import Reports from "pages/Forex/Reports";
import Platforms from "pages/Forex/Platforms";
import Deposit from "pages/Forex/Deposit";

// my profile menu
import Profile from "pages/Authentication/Profile";
import Activites from "pages/Forex/Activites";
import Documents from "pages/Documents";
import Applications from "pages/Forex/Applications/";
import WebTrader from "pages/Forex/WebTrader";
import nonAuthRoutes from "./nonAuthRoutes";
import BankAccounts from "pages/Forex/BankAccounts/BankAccounts";
import TwoFA from "../pages/Authentication/2FA";
import TradingAccount from "pages/Forex/TradingAccount/index";
import Statment from "pages/Forex/Statement";
import Partnership from "pages/Forex/Partnership/Partnership";
import Referrals from "pages/Forex/Partnership/Referrals";
import RequestPartnership from "pages/Forex/Partnership/RequestPartnership";
import IbClients from "pages/Forex/Partnership/Clients";
import Wallet from "pages/Wallet";
import Notifications from "pages/Authentication/Notifications";
import TVTrader from "pages/Forex/Tradingview";
import { WebTradingOpportunities } from "pages/Forex/TradingOppurtunities";
import WebCalendar from "pages/Forex/WebCalender";
import WebFeed from "pages/Forex/WebFeed";

export default [
  {
    path: "/dashboard",
    component: Dashboard,
    isAuth: true,
  },
  {
    path: "/wallet",
    component: Wallet,
    isAuth: true
  },
  {
    path: "/accounts/password",
    component: ChangePassword,
    isAuth: true,
  },
  {
    path: "/accounts/:type",
    component: Accounts,
    isAuth: true,
  },
  {
    path: "/deposit",
    component: Deposit,
    isAuth: true,
  },
  {
    path: "/profile",
    component: Profile,
    isAuth: true,
  },
  {
    path: "/activites",
    component: Activites,
    isAuth: true,
  },
  {
    path: "/documents",
    component: Documents,
    isAuth: true,
  },
  {
    path: "/application",
    component: Applications,
    exact: true,
    isAuth: true,
  },
  {
    path: "/withdraw",
    component: Withdraw,
    isAuth: true,
  },
  {
    path: "/transfer",
    component: InternalTransfer,
    isAuth: true,
  },
  {
    path: "/reports",
    component: Reports,
    isAuth: true,
  },
  {
    path: "/platforms",
    component: Platforms,
    isAuth: true,
  },
  {
    path: "/trading-opportunities",
    component: WebTradingOpportunities,
    isAuth: true,
  },
 
  {
    path: "/web-calender",
    component: WebCalendar,
    isAuth: true,
  },
  {
    path: "/web-feed",
    component: WebFeed,
    isAuth: true,
  },
  // Web Feed
  {
    path: "/ib/clients/:type",
    component: IbClients,
    isAuth: true
  },
  {
    path: "/ib/transfer",
    component: ibInternalTransfer,
    exact: true,
    isAuth: true
  },
  {
    path: "/web-trader",
    component: WebTrader,
    isAuth: true,
  },
  {
    path: "/tvtrader",
    component: TVTrader,
    isAuth: true,
  },
  {
    path: "/trading-account",
    component: TradingAccount,
    isAuth: true,
  },
  {
    path: "/login",
    component: Login,
    exact: true,
    isAuth: false,
  },
  {
    path: "/bank-accounts",
    component: BankAccounts,
    exact: true,
    isAuth: true
  },
  {
    path: "/two-fa",
    component: TwoFA,
    isAuth: true
  },
  {
    path: "/partnership",
    component: Partnership,
    exact: true,
    isAuth: true
  },
  {
    path: "/referrals",
    component: Referrals,
    exact: true,
    isAuth: true
  },
  {
    path: "/statement",
    component: Statment,
    exact: true,
    isAuth: true
  },
  {
    path: "/request-partnership",
    component: RequestPartnership,
    exact: true,
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
