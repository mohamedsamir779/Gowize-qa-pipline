import { IS_IOS } from "common/constants";
import {
  PROFILE_ERROR,
  PROFILE_SUCCESS,
  EDIT_PROFILE,
  EDIT_PROFILE_SUCCESS,
  RESET_PROFILE_FLAG,
  FETCH_PROFILE_START,
  SUBMIT_IND_PROFILE_START,
  SUBMIT_IND_PROFILE_END,

  CONVERT_PROFILE_REQUESTED,
  CONVERT_PROFILE_SUCCESS,
  CONVERT_PROFILE_FAIL,
  UPLOAD_PROFILE_AVATAR_START,
  UPLOAD_PROFILE_AVATAR_END,
  DELETE_PROFILE_AVATAR_START,
  DELETE_PROFILE_AVATAR_END,
  UPDATE_PROFILE_JOURNEY,
  UPDATE_PUSH_NOTIFICATION_OPTION,
  UPDATE_PROFILE_SETTINGS,
  UPDATE_PROFILE_SETTINGS_SUCCESS,
  UPDATE_PROFILE_SETTINGS_FAIL
} from "./actionTypes";

const initialState = {
  error: "",
  success: "",
  clientData: {
    isCorporate: false,
    stages: {
      loaded: false,
    },
    settings: {
      localAndClientPushNotifications: (!IS_IOS && Notification?.permission === "granted") || false,
    },
    fx: {},
    corporateInfo: {
      hqAddress: {},
      authorizedPerson: {},
    },
  },
  loading: false,
  editLoading: false,
  settingsLoading: false,
  editSuccess: "",
  uploading: false,
  uploadSuccessMessage: "",
  uploadError: null,
  submittingProfile: false,
};

const profile = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_PROFILE_START:
      state = {
        ...state,
        loading: true
      };
      break;
    case EDIT_PROFILE:
      state = {
        ...state,
        editLoading: true
      };
      break;
    case EDIT_PROFILE_SUCCESS:
      state = {
        ...state,
        editLoading: false,
        editSuccess: action.payload
      };
      break;
    case PROFILE_SUCCESS:
      state = {
        ...state,
        loading: false,
        clientData: {
          ...state.clientData,
          ...action.payload,
          stages: {
            ...state.clientData.stages,
            ...action.payload.stages,
            loaded: true
          },
          settings: {
            ...state.clientData.settings,
            ...action.payload.settings
          }
        }
      };
      break;
    case PROFILE_ERROR:
      state = {
        ...state,
        loading: false,
        editLoading: false,
        error: action.payload
      };
      break;
    case RESET_PROFILE_FLAG:
      state = {
        ...state,
        success: null
      };
      break;
    case SUBMIT_IND_PROFILE_START:
      state = {
        ...state,
        submittingProfile: true,
      };
      break;
    case SUBMIT_IND_PROFILE_END:
      state = {
        ...state,
        submittingProfile: false,
        submitProfileError: action.payload.error,
        clientData: {
          ...state.clientData,
          stages: {
            ...state.clientData.stages,
            ...action.payload.stages
          }
        }
      };
      break;

    // convert profile
    case CONVERT_PROFILE_REQUESTED:
      state = {
        ...state,
        profileConvertLoading: true
      };
      break;
    case CONVERT_PROFILE_SUCCESS:
      state = {
        ...state,
        profileConvertSuccess: true,
        profileConvertFail: false,
        profileConvertLoading: false,
        profileConvertResult: action.payload
      };
      break;
    case CONVERT_PROFILE_FAIL:
      state = {
        ...state,
        profileConvertFail: true,
        profileConvertSuccess: false,
        profileConvertLoading: false,
        profileConvertFailMessage: action.payload.error
      };
      break;

    // PROFILE AVATAR UPLOAD
    case UPLOAD_PROFILE_AVATAR_START:
      state = {
        ...state,
        uploading: true,
        uploadError: null,
        uploadSuccessMessage: ""
      };
      break;
    case UPLOAD_PROFILE_AVATAR_END:
      state = {
        ...state,
        uploadError: action.payload.success ? null : action.payload.error,
        uploadSuccessMessage: action.payload.success.message,
        uploading: false
      };
      break;

    case DELETE_PROFILE_AVATAR_START:
      state = {
        ...state,
        loading: true
      };
      break;
    case DELETE_PROFILE_AVATAR_END:
      state = {
        ...state,
        loading: false
      };
      break;
    case UPDATE_PROFILE_JOURNEY:
      state = {
        ...state,
        clientData: {
          ...state.clientData,
          stages: {
            ...state.clientData.stages,
            openAccount: action.payload.stages.openAccount ? action.payload.stages.openAccount : state.clientData.stages.openAccount,
          }
        }
      };
      break;
    case UPDATE_PROFILE_SETTINGS:
      state = {
        ...state,
        settingsLoading: true
      };
      break;
    case UPDATE_PROFILE_SETTINGS_SUCCESS:
      state = {
        ...state,
        settingsLoading: false,
        clientData: {
          ...state.clientData,
          settings: {
            ...state.clientData.settings,
            ...action.payload.settings,
          }
        }
      };
      break;
    case UPDATE_PROFILE_SETTINGS_FAIL:
      state = {
        ...state,
        settingsLoading: false
      };
      break;
    case UPDATE_PUSH_NOTIFICATION_OPTION:
      state = {
        ...state,
        clientData: {
          ...state.clientData,
          settings: {
            ...state.clientData.settings,
            localAndClientPushNotifications: action.payload.enabled && (!IS_IOS && Notification?.permission === "granted") || false
          },
        },
      };
      break;
    default:
      state = { ...state };
      break;
  }
  return state;
};

export default profile;
