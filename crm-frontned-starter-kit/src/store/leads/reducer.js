import {
  UPDATE_CALL_STATUS,
  UPDATE_CALL_STATUS_FAILED,
  UPDATE_CALL_STATUS_SUCCESS,
} from "./actionsType";

const initialState = {
  loading: false,
  excelLoading: false,
  updateCallStatusLoading: false,
  error: "",
  successMessage: "",
  leads: [],
  totalDocs: 0,
  addClearingCounter: 0,
};
const leadReducer = (state = initialState, action) => {
  switch (action.type) {
    case "FETCH_LEADS_START":
      state = {
        ...state,
        loading: true,
      };
      break;
    case "FETCH_LEADS_SUCCESS":
      state = {
        ...state,
        leads: [...action.payload.result.docs],
        totalDocs: action.payload.result.totalDocs,
        hasNextPage: action.payload.result.hasNextPage,
        hasPrevPage: action.payload.result.hasPrevPage,
        limit: action.payload.result.limit,
        nextPage: action.payload.result.nextPage,
        page: action.payload.result.page,
        prevPage: action.payload.result.prevPage,
        totalPages: action.payload.result.totalPages,
        loading: false
      };
      break;
    case "FETCH_LEADS_FAILED":
      state = {
        ...state,
        loading: false,
      };
      break;
    case "API_ERROR":
      state = {
        ...state,
        error: action.payload.error,
        successMessage: ""
      };
      break;
    case "ADD_NEW_LEAD":
      state = {
        ...state,
        error: "",
        successMessage: "",
        disableAddButton: true,
        addLeadLoader: true,
      };
      break;
    case "ADD_NEW_LEAD_SUCCESS":
      state = {
        ...state,
        error: "",
        loading: false,
        totalDocs: action.payload.newLead ? state.totalDocs + 1 : state.totalDocs,
        disableAddButton: false,
        addClearingCounter: state.addClearingCounter + 1,
        addLeadLoader: false
      };
      break;
    case "ADD_NEW_LEAD_EXCEL":
      state = {
        ...state,
        error: "",
        successMessage: "",
        excelLoading: true,
      };
      break;
    case "ADD_NEW_LEAD_EXCEL_SUCCESS":
      if (action.payload.leads && action.payload.leads.length > 0) {
        const dataMap = action.payload.leads.map((lead) => {
          return {
            createdAt: new Date().toLocaleDateString(),
            language: "en",
            source: "REGISTER_DEMO",
            ...lead
          };
        });
        const newLength = action.payload.leads ? state.totalDocs + action?.payload?.leads.length || 0 : state.totalDocs;
        state = {
          ...state,
          error: "",
          excelLoading: false,
          totalDocs: newLength,
          leads: action.payload.leads ? [...dataMap, ...state.leads] : [...state.leads],
        };
      } else {
        state = {
          ...state,
          error: "",
          excelLoading: false,
        };
      }
      break;
    case "ADD_NEW_LEAD_EXCEL_FAILED":
      state = {
        ...state,
        error: action.payload.error,
        excelLoading: false,
        successMessage: ""
      };
      break;
    case "ADD_MODAL_CLEAR":
      state = {
        ...state,
        showAddSuccessMessage: false,
        addClearingCounter: state.addClearingCounter + 1,
        disableAddButton: false,
        addLeadLoader: false
      };
      break;
    case UPDATE_CALL_STATUS:
      state = {
        ...state,
        updateCallStatusLoading: true,
      };
      break;
    case UPDATE_CALL_STATUS_SUCCESS:
      state = {
        ...state,
        leads: state.leads ? state.leads.map((lead) => {
          if (lead._id === action.payload?.leadId) {
            return {
              ...lead,
              callStatus: action.payload?.callStatus,
            };
          }
          return lead;
        }) : state.leads,
        updateCallStatusLoading: false,
      };
      break;
    case UPDATE_CALL_STATUS_FAILED:
      state = {
        ...state,
        updateCallStatusLoading: false,
      };
      break;
    default:
      state = { ...state };
  }
  return state;
};
export default leadReducer;