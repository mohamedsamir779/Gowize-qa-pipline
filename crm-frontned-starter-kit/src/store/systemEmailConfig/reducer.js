const { SAVE_EMAIL_CONFIGURATION, SAVE_EMAIL_CONFIGURATION_SUCCESS, SAVE_EMAIL_CONFIGURATION_FAIL, CHANGE_ACTIVE_EMAIL_CONFIGURATION, CHANGE_ACTIVE_EMAIL_CONFIGURATION_SUCCESS, CHANGE_ACTIVE_EMAIL_CONFIGURATION_FAIL, TEST_EMAIL_CONFIGURATION, TEST_EMAIL_CONFIGURATION_SUCCESS, TEST_EMAIL_CONFIGURATION_FAIL, FETCH_EMAIL_CONFIGURATION, FETCH_EMAIL_CONFIGURATION_SUCCESS, FETCH_EMAIL_CONFIGURATION_FAIL, FETCH_NOTIFICATION_GROUPS, FETCH_NOTIFICATION_GROUPS_SUCCESS, FETCH_NOTIFICATION_GROUPS_FAIL, UPDATE_NOTIFICATION_GROUPS, UPDATE_NOTIFICATION_GROUPS_SUCCESS, UPDATE_NOTIFICATION_GROUPS_FAIL } = require("./actionTypes");

const initialState = {
  loading: false,
  error: null,
  response: "",
  configs: {
    currentProvider: "",
    sendGrid: {},
    smtp: {},
    loading: false,
  },
  notificationGroups: {
    loading: false,
    error: null,
    response: "",
    groups: {},
  },
};

const systemEmailConfigReducer = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_EMAIL_CONFIGURATION:
      state = {
        ...state,
        loading: true,
      };
      break;
    case SAVE_EMAIL_CONFIGURATION_SUCCESS:
      state = {
        ...state,
        loading: false,
        response: action.payload?.message,
        configs: {
          ...state.configs,
          ...action.payload?.email
        }
      };
      break;
    case SAVE_EMAIL_CONFIGURATION_FAIL:
      state = {
        ...state,
        loading: false,
        error: action.payload,
      };
      break;
    case CHANGE_ACTIVE_EMAIL_CONFIGURATION:
      state = {
        ...state,
        loading: true,
      };
      break;
    case CHANGE_ACTIVE_EMAIL_CONFIGURATION_SUCCESS:
      state = {
        ...state,
        loading: false,
        currentProvider: action.payload?.email?.currentProvider,
        response: action.payload?.message,
        configs: {
          ...state.configs,
          ...action.payload?.email
        }
      };
      break;
    case CHANGE_ACTIVE_EMAIL_CONFIGURATION_FAIL:
      state = {
        ...state,
        loading: false,
        error: action.payload,
      };
      break;
    case TEST_EMAIL_CONFIGURATION:
      state = {
        ...state,
        loading: true,
      };
      break;
    case TEST_EMAIL_CONFIGURATION_SUCCESS:
      state = {
        ...state,
        loading: false,
        response: action.payload?.message,
        configs: {
          ...state.configs,
          ...action.payload?.email
        }
      };
      break;
    case TEST_EMAIL_CONFIGURATION_FAIL:
      state = {
        ...state,
        loading: false,
        error: action.payload,
      };
      break;
    case FETCH_EMAIL_CONFIGURATION:
      state = {
        ...state,
        configs: {
          ...state.configs,
          loading: true,
        }
      };
      break;
    case FETCH_EMAIL_CONFIGURATION_SUCCESS:
      state = {
        ...state,
        currentProvider: action.payload.currentProvider,
        configs: {
          ...state.configs,
          loading: false,
          sendGrid: {
            ...state.configs.sendGrid,
            ...action.payload.sendGrid,
          },
          smtp: {
            ...state.configs.smtp,
            ...action.payload.smtp,
          },
        }
      };
      break;
    case FETCH_EMAIL_CONFIGURATION_FAIL:
      state = {
        ...state,
        configs: {
          ...state.configs,
          loading: false,
        }
      };
      break;
    case FETCH_NOTIFICATION_GROUPS:
      state = {
        ...state,
        notificationGroups: {
          ...state.notificationGroups,
          loading: true,
        }
      };
      break;
    case FETCH_NOTIFICATION_GROUPS_SUCCESS:
      state = {
        ...state,
        notificationGroups: {
          ...state.notificationGroups,
          loading: false,
          groups: action.payload,
        }
      };
      break;
    case FETCH_NOTIFICATION_GROUPS_FAIL:
      state = {
        ...state,
        notificationGroups: {
          ...state.notificationGroups,
          loading: false,
          error: action.payload,
        }
      };
      break;
    case UPDATE_NOTIFICATION_GROUPS:
      state = {
        ...state,
        notificationGroups: {
          ...state.notificationGroups,
          loading: true,
        }
      };
      break;
    case UPDATE_NOTIFICATION_GROUPS_SUCCESS:
      state = {
        ...state,
        notificationGroups: {
          ...state.notificationGroups,
          loading: false,
          response: action.payload,
        }
      };
      break;
    case UPDATE_NOTIFICATION_GROUPS_FAIL:
      state = {
        ...state,
        notificationGroups: {
          ...state.notificationGroups,
          loading: false,
          error: action.payload,
        }
      };
      break;
    default:
      break;
  }
  return state;
};

export default systemEmailConfigReducer;