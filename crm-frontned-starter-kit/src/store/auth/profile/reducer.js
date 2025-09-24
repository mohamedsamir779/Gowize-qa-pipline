import {
  PROFILE_ERROR,
  PROFILE_SUCCESS,
  EDIT_PROFILE,
  RESET_PROFILE_FLAG,
  GET_PROFILE,
  GET_PROFILE_SUCCESS,
  EDIT_PROFILE_SETTINGS_START,
  EDIT_PROFILE_SETTINGS_SUCCESS,
  EDIT_PROFILE_SETTINGS_FAIL,
  UPDATE_PUSH_NOTIFICATION_OPTION,
  SAVE_USER_EMAIL_CONFIGURATION,
  SAVE_USER_EMAIL_CONFIGURATION_SUCCESS,
  SAVE_USER_EMAIL_CONFIGURATION_FAIL,
  CHANGE_ACTIVE_USER_EMAIL_CONFIGURATION,
  CHANGE_ACTIVE_USER_EMAIL_CONFIGURATION_SUCCESS,
  CHANGE_ACTIVE_USER_EMAIL_CONFIGURATION_FAIL,
  TEST_USER_EMAIL_CONFIGURATION,
  TEST_USER_EMAIL_CONFIGURATION_SUCCESS,
  TEST_USER_EMAIL_CONFIGURATION_FAIL
} from "./actionTypes";
import { IS_IOS } from "../../../../src/constants";

const initialState = {
  rolesPermissions: {},
  userPermissions: {},
  clientPermissions: {},
  leadsPermissions: {},
  teamsPermissions: {},
  depositsPermissions: {},
  withdrawalsPermissions: {},
  feeGroupsPermissions: {},
  dictionariesPermissions: {},
  systemEmailsPermissions: {},
  emailConfigPermissions: {},
  symbolsPermissions: {},
  currencyPairsPermissions: {},
  markupsPermissions: {},
  orderProfitPermissions: {},
  transactionProfitPermissions: {},
  exchangeBalancePermissions: {},
  requestsPermissions: {},
  todosPermissions: {},
  companyBanksPermissions: {},
  userLogsPermissions: {},
  targetsPermissions: {},
  profileMetaInfo: {},
  ibAgrementPermissions: {},
  conversionRatePermissions: {},
  newDays: 7,
  error: "",
  success: "",
  settings: {
    salesDashboard: ["NEW"],
    salesDashboardLimit: 5,
    enableCallStatusColors: false,
    callStatusColors: {},
    timezone: null,
    localAndClientPushNotifications: (!IS_IOS && Notification?.permission === "granted") || false,
  },
  emails: {
    currentProvider: "",
    sendGrid: {},
    smtp: {},
    loading: false,
  },
  userData: {},
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  mobile: "",
  settingsClearingCounter: 0,
  loading: false,
  settingsLoading: false,
};

const profile = (state = initialState, action) => {
  switch (action.type) {
    case EDIT_PROFILE:
      state = { ...state };
      break;
    case GET_PROFILE:
      state = {
        ...state,
        loading: true,
      };
      break;
    case PROFILE_SUCCESS:
      state = {
        ...state,
        success: action.payload
      };
      break;
    case PROFILE_ERROR:
      state = {
        ...state,
        error: action.payload,
        loading: false,
      };
      break;
    case RESET_PROFILE_FLAG:
      state = {
        ...state,
        success: null
      };
      break;
    case GET_PROFILE_SUCCESS:
      state = {
        ...state,
        ...action.payload,
        loading: false,
        profileMetaInfo: action.payload.metaInfo,
        settings: {
          ...state.settings,
          ...action.payload.settings
        },
        userData: action.payload.userData,
        emails: action.payload.emails,
        newDays: parseInt(action?.payload?.newDays || 7, 10),
        rolesPermissions: { ...action.payload.permissions.roles },
        userPermissions: { ...action.payload.permissions.users },
        clientPermissions: { ...action.payload.permissions.clients },
        leadsPermissions: { ...action.payload.permissions.leads },
        teamsPermissions: { ...action.payload.permissions.teams },
        depositsPermissions: { ...action.payload.permissions.deposits },
        withdrawalsPermissions: { ...action.payload.permissions.withdrawals },
        feeGroupsPermissions: { ...action.payload.permissions.feeGroups },
        dictionariesPermissions: { ...action.payload.permissions.dictionaries },
        systemEmailsPermissions: { ...action.payload.permissions.systemEmails },
        emailConfigPermissions: { ...action.payload.permissions.emailConfig },
        symbolsPermissions: { ...action.payload.permissions.symbols },
        currencyPairsPermissions: { ...action.payload.permissions.currencyPairs },
        markupsPermissions: { ...action.payload.permissions.markups },
        transactionFeeGroupsPermissions: { ...action.payload.permissions.transactionFeeGroups },
        exchangeBalancePermissions: { ...action.payload.permissions.exchangeBalance },
        orderProfitPermissions: { ...action.payload.permissions.orderProfit },
        transactionProfitPermissions: { ...action.payload.permissions.transactionProfit },
        requestsPermissions: { ...action.payload.permissions.requests },
        internalTransfersPermissions: { ...action.payload.permissions.internalTransfers },
        creditPermissions: { ...action.payload.permissions.credits },
        todosPermissions: { ...action.payload.permissions.remindersTodos },
        companyBanksPermissions: { ...action.payload.permissions.companyBanks },
        userLogsPermissions: { ...action.payload.permissions.userLogs },
        AccTypesPermissions: { ...action.payload.permissions.accountTypes },
        targetsPermissions: { ...action.payload.permissions.targets },
        ibAgrementPermissions: { ...action.payload.permissions.ibAgrement },
        conversionRatePermissions: { ...action.payload.permissions.conversionRate },
        emailCampaignPermissions: { ...action.payload.permissions.emailCampaign },
        dealSyncPermissions: { ...action.payload.permissions.dealSync },
      };
      break;
    case UPDATE_PUSH_NOTIFICATION_OPTION:
      state = {
        ...state,
        settings: {
          ...state.settings,
          localAndClientPushNotifications: action.payload.enabled && (!IS_IOS && Notification?.permission === "granted") || false
        }
      };
      break;
    case "CLEAR_PROFILE":
      state = {
        ...state,
        rolesPermissions: {},
        userPermissions: {},
        clientPermissions: {},
        leadsPermissions: {},
        teamsPermissions: {},
        depositsPermissions: {},
        withdrawalsPermissions: {},
        feeGroupsPermissions: {},
        dictionariesPermissions: {},
        systemEmailsPermissions: {},
        symbolsPermissions: {},
        currencyPairsPermissions: {},
        markupsPermissions: {},
        orderProfitPermissions: {},
        transactionProfitPermissions: {},
        companyBanksPermissions: {},
        userLogsPermissions: {},
        AccTypesPermissions: {},
        targetsPermissions: {},
      };
      break;
    case EDIT_PROFILE_SETTINGS_START:
      state = {
        ...state,
        settingsLoading: true,
      };
      break;
    case EDIT_PROFILE_SETTINGS_SUCCESS:
      state = {
        ...state,
        settingsLoading: false,
        settings: action.payload,
        settingsClearingCounter: state.settingsClearingCounter + 1,
      };
      break;
    case EDIT_PROFILE_SETTINGS_FAIL:
      state = {
        ...state,
        settingsLoading: false,
      };
      break;
    case SAVE_USER_EMAIL_CONFIGURATION:
      state = {
        ...state,
        emails: {
          ...state.emails,
          loading: true,
        }
      };
      break;
    case SAVE_USER_EMAIL_CONFIGURATION_SUCCESS:
      state = {
        ...state,
        emails: {
          ...state.emails,
          loading: false,
        }
      };
      break;
    case SAVE_USER_EMAIL_CONFIGURATION_FAIL:
      state = {
        ...state,
        emails: {
          loading: false,
        }
      };
      break;
    case CHANGE_ACTIVE_USER_EMAIL_CONFIGURATION:
      state = {
        ...state,
        emails: {
          ...state.emails,
          loading: true,
        }
      };
      break;
    case CHANGE_ACTIVE_USER_EMAIL_CONFIGURATION_SUCCESS:
      state = {
        ...state,
        emails: {
          ...state.emails,
          loading: false,
          currentProvider: action.payload?.type,
        }
      };
      break;
    case CHANGE_ACTIVE_USER_EMAIL_CONFIGURATION_FAIL:
      state = {
        ...state,
        emails: {
          ...state.emails,
          loading: false,
        }
      };
      break;
    case TEST_USER_EMAIL_CONFIGURATION:
      state = {
        ...state,
        emails: {
          ...state.emails,
          loading: true,
        }
      };
      break;
    case TEST_USER_EMAIL_CONFIGURATION_SUCCESS:
      state = {
        ...state,
        emails: {
          ...state.emails,
          loading: false,
        }
      };
      break;
    case TEST_USER_EMAIL_CONFIGURATION_FAIL:
      state = {
        ...state,
        emails: {
          ...state.emails,
          loading: false,
        }
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default profile;
