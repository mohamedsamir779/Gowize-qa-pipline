import {
  FETCH_CAMPAIGN_TEMPLATES_REQUESTED,
  FETCH_CAMPAIGN_TEMPLATES_SUCCESS,
  FETCH_CAMPAIGN_TEMPLATES_FAIL,

  ADD_CAMPAIGN_TEMPLATE_REQUESTED,
  ADD_CAMPAIGN_TEMPLATE_SUCCESS,
  ADD_CAMPAIGN_TEMPLATE_FAIL,
  ADD_CAMPAIGN_TEMPLATE_CLEAR,

  DELETE_CAMPAIGN_TEMPLATE_REQUESTED,
  DELETE_CAMPAIGN_TEMPLATE_SUCCESS,
  DELETE_CAMPAIGN_TEMPLATE_FAIL,

  EDIT_CAMPAIGN_TEMPLATE_REQUESTED,
  EDIT_CAMPAIGN_TEMPLATE_SUCCESS,
  EDIT_CAMPAIGN_TEMPLATE_FAIL,
  EDIT_CAMPAIGN_TEMPLATE_CLEAR,

  FETCH_CAMPAIGN_TEMPLATE_HTML_REQUESTED,
  FETCH_CAMPAIGN_TEMPLATE_HTML_SUCCESS,
  FETCH_CAMPAIGN_TEMPLATE_HTML_FAIL,
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
  campaignTemplates: [],
  clearingCounter: 0,
  deleteClearingCounter: 0,
  editClearingCounter: 0,
  editContentClearingCounter: 0,
  activeComponentProp: "list component",
  isBackButtonActive: true,
  docs: [],
  campaignTemplateContentUpdatedSuccess: false
};

const campaignTemplates = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CAMPAIGN_TEMPLATES_REQUESTED:
      state = {
        ...state,
        loading: true
      };
      break;
    case FETCH_CAMPAIGN_TEMPLATES_SUCCESS:
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
        campaignTemplate: null,
        addError: false
      };
      break;
    case FETCH_CAMPAIGN_TEMPLATES_FAIL:
      state = {
        ...state,
        loading: false,
        error: action.payload.error.message
      };
      break;
    case ADD_CAMPAIGN_TEMPLATE_REQUESTED:
      state = {
        ...state,
        addLoading: true,
        campaignTemplate: null
      };
      break;
    case ADD_CAMPAIGN_TEMPLATE_SUCCESS:
      state = {
        ...state,
        addResult: action.payload,
        docs: [action.payload, ...state.docs],
        addSuccess: true,
        addError: false,
        addLoading: false,
        campaignTemplate: action.payload
      };
      break;
    case ADD_CAMPAIGN_TEMPLATE_FAIL:
      state = {
        ...state,
        addErrorDetails: action.payload.error.message,
        addLoading: false,
        addSuccess: false,
        addError: true
      };
      break;
    case ADD_CAMPAIGN_TEMPLATE_CLEAR:
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

    case DELETE_CAMPAIGN_TEMPLATE_REQUESTED:
      state = {
        ...state,
        deleteLoading: true
      };
      break;
    case DELETE_CAMPAIGN_TEMPLATE_SUCCESS:
      state = {
        ...state,
        docs: state.docs.filter(obj => obj._id !== action.payload.id),
        deleteLoading: false,
        deleteResult: action.payload.result,
        deleteError: action.payload.error,
        deleteClearingCounter: state.deleteClearingCounter + 1
      };
      break;
    case DELETE_CAMPAIGN_TEMPLATE_FAIL:
      state = {
        ...state,
        deleteError: action.payload.error.message
      };
      break;

    case EDIT_CAMPAIGN_TEMPLATE_REQUESTED:
      state = {
        ...state,
        editLoading: true
      };
      break;
    case EDIT_CAMPAIGN_TEMPLATE_SUCCESS:
      state = {
        ...state,
        editLoading: false,
        editResult: action.payload.data.message,
        editSuccess: true
      };
      break;
    case EDIT_CAMPAIGN_TEMPLATE_FAIL:
      state = {
        ...state,
        editLoading: false,
        editError: action.payload.error.message,
        editSuccess: false
      };
      break;
    case EDIT_CAMPAIGN_TEMPLATE_CLEAR:
      state = {
        ...state,
        editResult: null,
        editError: null,
        editClearingCounter: state.editClearingCounter + 1
      };
      break;
    case FETCH_CAMPAIGN_TEMPLATE_HTML_REQUESTED:
      state = {
        ...state,
        htmlLoading: true
      };
      break;
    case FETCH_CAMPAIGN_TEMPLATE_HTML_SUCCESS:
      state = {
        ...state,
        htmlLoading: false,
        htmlSuccess: true,
        htmlFail: false,
        campaignTemplateHtml: action.payload
      };
      break;
    case FETCH_CAMPAIGN_TEMPLATE_HTML_FAIL:
      state = {
        ...state,
        htmlLoading: false,
        htmlSuccess: false,
        htmlFail: true,
        htmlFailDetails: action.payload
      };
      break;
    default:
      state = { ...state };
  }

  return state;
};

export default campaignTemplates;