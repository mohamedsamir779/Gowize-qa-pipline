import React from "react";
import { Redirect } from "react-router-dom";

//Dashboard
import Dashboard from "../pages/Dashboard/index";

// Authentication related pages
import UserProfile from "../pages/Authentication/Profile/UserProfile";
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import ResetPassword from "pages/Authentication/ResetPassword";
import ClientList from "../pages/Clients/ClientList";
import UsersList from "../pages/Users/UsersList";
import LeadsList from "../pages/Leads/LeadList";
import Teams from "../pages/Teams/Teams";
import RolesList from "../pages/Roles/RolesList";
import SystemEmailsList from "../pages/SystemEmail/SystemEmailList";
// import LeadsList from "../components/Leads/lead.record.list.component";
import Page404 from "../pages/Authentication/Page404";
import AssetsList from "../pages/Assests/AssetsList";
import CurrencyPairsList from "../pages/CurrencyPairs/CurrencyPairsList";
import MarkUpsList from "../pages/Markups/MarkUpsList";
import Calendar from "../pages/Calendar";
import DictionaryList from "pages/Dictionary.js/DictionaryList";
import MarketPrice from "pages/MarketPrice/MarketPrice";
import feeGroupList from "pages/feeGroups/feeGroupList";
import ClientMainPage from "pages/ClientDetail/ClientMainPage";
import SystemEmailMainPage from "pages/SystemEmail/SystemEmailMainPage";
import usePermissions from "./permissions";
import TransactionFeeGroupList from "pages/transactionFeeGroups/TransactionFeeGroupList";
import OrderProfitList from "pages/OrderProfit/orderProfitList";
import TransactionProfitList from "pages/TransactionProfit.js/TransactionProfitList";
import DepositsIndex from "pages/Transactions/DepositsIndex";
import WithdrawalsIndex from "pages/Transactions/WithdrawalsIndex";
import InternalTransferIndex from "pages/Transactions/Forex/internalTransfer/InternalTransferIndex";
import CreditIndex from "pages/Transactions/Forex/credit/CreditIndex";
import ConvertIndex from "pages/Transactions/Forex/convert/ConvertIndex";
import IbRequest from "pages/Requests/IbRequest";
import Leverage from "pages/Requests/Leverage";
import AccountRequest from "pages/Requests/Accounts/AccountRequest";
import CompanyBanks from "pages/CompanyBanks";
import UserLogs from "pages/UserLogs";
import Reports from "../pages/Reports/Reports";
import AccountTypes from "pages/AccountTypes";
import Targets from "../pages/Targets/";
import EmailConfig from "pages/EmailConfig/EmailConfig";
import Notifications from "pages/Authentication/Notifications";
import CurrencyRates from "pages/CurrencyRates";
import CampaignTemplates from "pages/Campaigns/Templates";
import Campaigns from "pages/Campaigns";
import Unsubscribers from "pages/Campaigns/Unsubscribers";
import MarketingLinks from "pages/Campaigns/UtmCampaigns/MarketingLinks";
import SyncDeals from "pages/SyncDeals";

function userRoutes() {
  const object = usePermissions();
  const {
    userPermissions,
    clientPermissions,
    rolesPermissions,
    AccTypesPermissions,
    teamsPermissions,
    withdrawalsPermissions,
    depositsPermissions,
    leadsPermissions,
    symbolsPermissions,
    systemEmailsPermissions,
    emailConfigPermissions,
    dictionariesPermissions,
    feeGroupsPermissions,
    currencyPairsPermissions,
    conversionRatePermissions,
    markupsPermissions,
    transactionFeeGroupsPermissions,
    orderProfitPermissions,
    transactionProfitPermissions,
    companyBanksPermissions,
    userLogsPermissions,
    targetsPermissions,
    emailCampaignPermissions,
  } = object;

  return [
    {
      path: "/dashboard",
      component: Dashboard,

    },
    {
      path: "/profile",
      component: UserProfile,
    },
    {
      path: "/notifications",
      component: Notifications,
    },
    {
      path: "/clients",
      component: ClientList,
      get: clientPermissions.get || clientPermissions.getAssigned
    },
    {
      path: "/clients/:id",
      component: ClientMainPage,
      notExact: true,
    },
    {
      path: "/system-emails/:id",
      component: SystemEmailMainPage,
      notExact: true,
    },
    {
      path: "/leads",
      component: LeadsList,
      get: leadsPermissions.get || leadsPermissions.getAssigned
    },
    {
      path: "/users",
      component: UsersList,
      get: userPermissions.get
    },
    {
      path: "/account-types",
      component: AccountTypes,
      get: AccTypesPermissions.get
    },
    {
      path: "/teams",
      component: Teams,
      get: teamsPermissions.get
    },
    {
      path: "/targets",
      component: Targets,
      get: targetsPermissions.get
    },
    {
      path: "/calendar",
      component: Calendar,
    },
    {
      path: "/roles",
      component: RolesList,
      get: rolesPermissions.get
    },
    {
      path: "/email-campaigns/",
      component: Campaigns,
      get: emailCampaignPermissions.get
    },
    {
      path: "/email-campaigns/templates",
      component: CampaignTemplates,
      get: emailCampaignPermissions.get
    },
    {
      path: "/email-campaigns/unsubscribers",
      component: Unsubscribers,
      get: emailCampaignPermissions.get
    },
    {
      path: "/email-campaigns/unsubscribers",
      component: Unsubscribers,
      get: emailCampaignPermissions.get
    },
    {
      path: "/email-campaigns/links",
      component: MarketingLinks,
      // get: emailCampaignPermissions.get
    },
    {
      path: "/system-emails",
      component: SystemEmailsList,
      get: systemEmailsPermissions.get
    },
    {
      path: "/email-config",
      component: EmailConfig,
      get: emailConfigPermissions.get
    },
    {
      path: "/banks",
      component: CompanyBanks,
      get: companyBanksPermissions.get
    },
    {
      path: "/user-logs",
      component: UserLogs,
      get: userLogsPermissions.get
    },
    {
      path: "/assets",
      component: AssetsList,
      get: symbolsPermissions.get
    },
    {
      path: "/currency-pairs",
      component: CurrencyPairsList,
      get: currencyPairsPermissions.get
    },
    {
      path: "/conversion-rates",
      component: CurrencyRates,
      get: conversionRatePermissions.get
    },
    {
      path: "/price/:pairName",
      component: MarketPrice,
    },
    {
      path: "/markups",
      component: MarkUpsList,
      get: markupsPermissions.get
    },
    {
      path: "/transactions/deposit",
      component: DepositsIndex,
    },
    {
      path: "/transactions/withdrawals",
      component: WithdrawalsIndex,
    },
    {
      path: "/transactions/internal-transfer",
      component: InternalTransferIndex,
    },
    {
      path: "/transactions/credit",
      component: CreditIndex,
    },
    {
      path: "/transactions/convert",
      component: ConvertIndex,
      get: withdrawalsPermissions.get
    },
    {
      path: "/dictionaries",
      component: DictionaryList,
      get: dictionariesPermissions.get
    },
    {
      path: "/fee-groups",
      component: feeGroupList,
      get: feeGroupsPermissions.get
    },
    {
      path: "/transaction-fee-groups",
      component: TransactionFeeGroupList,
      get: transactionFeeGroupsPermissions.get
    },
    {
      path: "/orders-profit",
      component: OrderProfitList,
      get: orderProfitPermissions.get
    },
    {
      path: "/transactions-profit",
      component: TransactionProfitList,
      get: transactionProfitPermissions.get
    },
    {
      path: "/requests/accounts",
      component: AccountRequest,
    },
    {
      path: "/requests/ib",
      component: IbRequest,
    },
    {
      path: "/requests/leverage",
      component: Leverage,
    },
    {
      path: "/reports",
      component: Reports,
    },
    {
      path: "/deal-sync",
      component: SyncDeals,
    },
    // this route should be at the end of all other routes
    {
      path: "/",
      exact: true,
      component: () => <Redirect to="/dashboard" />,
    },
  ];
}


const authRoutes = [
  {
    path: "/logout",
    component: Logout,
  },
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/forgot-password",
    component: ForgetPwd,
  },
  {
    path: "/reset-password",
    component: ResetPassword,
  },
  {
    path: "/register",
    component: Register,
  },
  {
    path: "*",
    exact: true,
    component: Page404,
  },
];

export { userRoutes, authRoutes };
