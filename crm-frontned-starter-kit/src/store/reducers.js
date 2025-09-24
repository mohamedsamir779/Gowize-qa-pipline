import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

// Authentication
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import ResetPasswordReducer from "./auth/resetpwd/reducer";
import Profile from "./auth/profile/reducer";

import clientReducer from "./client/reducer";
import leadReducer from "./leads/reducer";

// system emails 
import systemEmailsReducer from "./systemEmail/reducer";
import rolesReducer from "./roles/reducer";
import usersReducer from "./users/reducer";
import teamsReducer from "./teams/reducer";
import assetReducer from "./assests/reducer";
import walletReducer from "./wallet/reducer";
import gatewayReducer from "./gateway/reducer";
import depositReducer from "./transactions/deposit/reducer";
import withdrawalReducer from "./transactions/withdrawal/reducer";
import ordersReducer from "./orders/reducer";
import bankAccountReducer from "./bankAccount/reducer";
import dictionaryReducer from "./dictionary/reducer";
import marketsReducer from "./markets/reducer";
import feeGroupReducer from "./feeGroups/reducer";
import markupsReducer from "./markups/reducer";
import MarketPricing from "./marketPricing/reducer";
import { reducer as notifications } from "react-notification-system-redux";
import transactionFeeGroupReducer from "./transactionFeeGroups/reducer";
import documentsReducer from "./documents/reducer";
import ordersProfitsReducer from "./ordersProfit/reducer";
import transactionsProfitsReducer from "./transactionsProfit/reducer";
import todosReducer from "./todos/reducer";
import logsReducer from "./logs/reducer";
import dashboardReducer from "./dashboard/reducer";
import forexDepositReducer from "./forexTransactions/deposits/reducer";
import forexGatewayReducer from "./forexGateway/reducer";
import forexWithdrawalReducer from "./forexTransactions/withdrawals/reducer";
import internalTransferReducer from "./forexTransactions/internalTransfers/reducer";
import creditReducer from "./forexTransactions/credit/reducer";
import convertReducer from "./converts/reducer";
import tradingAccountReducer from "./tradingAccounts/reducer";
import clientTransactionsReducer from "./transactions/reducer";
import requestReducer from "./requests/reducer";
import ibAgreementReducer from "./ibAgreements/reducer";
import companyBankAccountReducer from "./companyBankAccount/reducer";
import reportsReducer from "./reports/reducer";
import twoFactorAuthReducer from "./auth/twoFactorAuth/reducer";
import systemEmailConfigReducer from "./systemEmailConfig/reducer";
import subscriptionsReducer from "./subscriptions/reducer";
import notificationsReducer from "./notifications/reducer";
import conversionRatesReducer from "./conversionRates/reducer";
import campaignTemplates from "./CampaignTemplates/reducer";
import emailCampaigns from "./EmailCampaigns/reducer";
import campaignUnsubscribers from "./CampaignUnsubscribers/reducer";


const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  ForgetPassword,
  ResetPasswordReducer,
  twoFactorAuthReducer,
  Profile,
  clientReducer,
  leadReducer,
  systemEmailsReducer,
  rolesReducer,
  usersReducer,
  teamsReducer,
  assetReducer,
  walletReducer,
  gatewayReducer,
  depositReducer,
  withdrawalReducer,
  ordersReducer,
  bankAccountReducer,
  dictionaryReducer,
  marketsReducer,
  feeGroupReducer,
  markupsReducer,
  notifications,
  MarketPricing,
  transactionFeeGroupReducer,
  documentsReducer,
  ordersProfitsReducer,
  transactionsProfitsReducer,
  todosReducer,
  logsReducer,
  dashboardReducer,
  forexDepositReducer,
  forexGatewayReducer,
  forexWithdrawalReducer,
  internalTransferReducer,
  creditReducer,
  convertReducer,
  tradingAccountReducer,
  clientTransactionsReducer,
  requestReducer,
  ibAgreements: ibAgreementReducer,
  banks: companyBankAccountReducer,
  reportsReducer,
  systemEmailConfigReducer,
  subscriptionsReducer,
  notificationsReducer,
  conversionRatesReducer,
  campaignTemplates,
  emailCampaigns,
  campaignUnsubscribers,
});

export default rootReducer;
