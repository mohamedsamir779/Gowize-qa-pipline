import {
  FETCH_EMAIL_CAMPAIGNS_REQUESTED,
  FETCH_EMAIL_CAMPAIGNS_SUCCESS,
  FETCH_EMAIL_CAMPAIGNS_FAIL,

  ADD_EMAIL_CAMPAIGN_REQUESTED,
  ADD_EMAIL_CAMPAIGN_SUCCESS,
  ADD_EMAIL_CAMPAIGN_FAIL,
  ADD_EMAIL_CAMPAIGN_CLEAR,

  DELETE_EMAIL_CAMPAIGN_REQUESTED,
  DELETE_EMAIL_CAMPAIGN_SUCCESS,
  DELETE_EMAIL_CAMPAIGN_FAIL,

  EDIT_EMAIL_CAMPAIGN_REQUESTED,
  EDIT_EMAIL_CAMPAIGN_SUCCESS,
  EDIT_EMAIL_CAMPAIGN_FAIL,
  EDIT_EMAIL_CAMPAIGN_CLEAR,

  GET_CLIENT_GROUPS_REQUESTED,
  GET_CLIENT_GROUPS_SUCCESS,
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
  emailCampaigns: [],
  clearingCounter: 0,
  deleteClearingCounter: 0,
  editClearingCounter: 0,
  editContentClearingCounter: 0,
  activeComponentProp: "list component",
  isBackButtonActive: true,
  docs: [],
  emailCampaignContentUpdatedSuccess: false
};

const emailCampaigns = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_EMAIL_CAMPAIGNS_REQUESTED:
      state = {
        ...state,
        loading: true
      };
      break;
    case FETCH_EMAIL_CAMPAIGNS_SUCCESS:
      state = {
        ...state,
        loading: false,
        docs: [...action.payload.docs],
        totalDocs: action.payload.totalDocs,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        limit: action.payload.limit,
        actionsUsed: action.payload.actionsUsed || state.actionsUsed,
        nextPage: action.payload.nextPage,
        page: action.payload.page,
        pagingCounter: action.payload.pagingCounter,
        prevPage: action.payload.prevPage,
        totalPages: action.payload.totalPages,
        emailCampaign: null,
        addError: false
      };
      break;
    case FETCH_EMAIL_CAMPAIGNS_FAIL:
      state = {
        ...state,
        loading: false,
        error: action.payload.error.message
      };
      break;

    case ADD_EMAIL_CAMPAIGN_REQUESTED:
      state = {
        ...state,
        addLoading: true,
        emailCampaign: null
      };
      break;
    case ADD_EMAIL_CAMPAIGN_SUCCESS:
      state = {
        ...state,
        addResult: action.payload,
        docs: [action.payload, ...state.docs],
        addSuccess: true,
        addError: false,
        addLoading: false,
        emailCampaign: action.payload
      };
      break;
    case ADD_EMAIL_CAMPAIGN_FAIL:
      state = {
        ...state,
        addErrorDetails: action.payload.error.message,
        addLoading: false,
        addSuccess: false,
        addError: true
      };
      break;
    case ADD_EMAIL_CAMPAIGN_CLEAR:
      state = {
        ...state,
        addErrorDetails: "",
        addSuccess: false,
        addError: false,
        addResult: null,
        clearingCounter: state.clearingCounter + 1,
        activeComponent: "edit component",
        isBackButtonActive: false
      };
      break;

    case DELETE_EMAIL_CAMPAIGN_REQUESTED:
      state = {
        ...state,
        deleteLoading: true
      };
      break;
    case DELETE_EMAIL_CAMPAIGN_SUCCESS:
      state = {
        ...state,
        docs: state.docs.filter(obj => obj._id !== action.payload.id),
        deleteLoading: false,
        deleteResult: action.payload.result,
        deleteError: action.payload.error,
        deleteClearingCounter: state.deleteClearingCounter + 1
      };
      break;
    case DELETE_EMAIL_CAMPAIGN_FAIL:
      state = {
        ...state,
        deleteError: action.payload.error.message
      };
      break;

    case EDIT_EMAIL_CAMPAIGN_REQUESTED:
      state = {
        ...state,
        editLoading: true
      };
      break;
    case EDIT_EMAIL_CAMPAIGN_SUCCESS:
      state = {
        ...state,
        editLoading: false,
        editResult: action.payload.data.message,
        editSuccess: true
      };
      break;
    case EDIT_EMAIL_CAMPAIGN_FAIL:
      state = {
        ...state,
        editLoading: false,
        editError: action.payload.error.message,
        editSuccess: false
      };
      break;
    case EDIT_EMAIL_CAMPAIGN_CLEAR:
      state = {
        ...state,
        editResult: null,
        editError: null,
        editClearingCounter: state.editClearingCounter + 1
      };
      break;

    case GET_CLIENT_GROUPS_REQUESTED:
      state = {
        ...state,
        groups: null
      };
      break;
    case GET_CLIENT_GROUPS_SUCCESS:
      state = {
        ...state,
        groups: action.payload,
      };
      break;
    default:
      state = { ...state };
  }

  return state;
};

export default emailCampaigns;