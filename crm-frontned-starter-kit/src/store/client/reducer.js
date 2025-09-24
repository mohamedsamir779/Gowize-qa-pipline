import {
  FETCH_CLIENT_DETAILS_REQUESTED,
  FETCH_CLIENT_DETAILS_SUCCESS,
  FETCH_CLIENT_DETAILS_FAIL,
  FETCH_CLIENT_DETAILS_CLEAR,

  FETCH_REFERRALS_START,
  FETCH_REFERRALS_SUCCESS,

  FETCH_IB_PARENTS_START,
  FETCH_IB_PARENTS_SUCCESS,

  FETCH_STATEMENT_START,
  FETCH_STATEMENT_SUCCESS,
  FETCH_STATEMENT_DEALS_START,
  FETCH_STATEMENT_DEALS_SUCCESS,

  EDIT_CLIENT_DETAILS_REQUESTED,
  EDIT_CLIENT_DETAILS_SUCCESS,
  EDIT_CLIENT_DETAILS_FAIL,
  EDIT_CLIENT_DETAILS_CLEAR,
  FETCH_CLIENT_STAGES_END,
  UPDATE_FINANCIAL_INFO_START,
  UPDATE_EMPLOYMENT_INFO_START,
  UPDATE_EMPLOYMENT_INFO_SUCCESS,
  UPDATE_FINANCIAL_INFO_SUCCESS,
  UPDATE_FINANCIAL_INFO_FAIL,
  UPDATE_EMPLOYMENT_INFO_FAIL,
  RESET_PASSWORD_CLEAR,
  CHANGE_PASSWORD_START,
  CLIENT_FORGOT_PASSWORD_START,
  CLIENT_FORGOT_PASSWORD_CLEAR,
  CLIENT_DISABLE_2FA_START,
  CLIENT_DISABLE_2FA_SUCCESS,
  CLIENT_DISABLE_2FA_FAIL,
  LINK_CLIENT_START,
  LINK_CLIENT_SUCCESS,
  UNLINK_IB_START,
  UNLINK_IB_SUCCESS,
  CONVERT_TO_IB_START,
  CONVERT_TO_IB_SUCCESS,
  CONVERT_TO_IB_FAIL,
  CONVERT_TO_IB_CLEAR,
  UNLINK_CLIENTS_START,
  UNLINK_CLIENTS_SUCCESS,
  CONVERT_TO_CLIENT_START,
  CONVERT_TO_CLIENT_SUCCESS,
  CONVERT_TO_CLIENT_FAIL,
  CONVERT_TO_CLIENT_CLEAR,
  GET_MT5_MARKUP_START,
  GET_MT5_MARKUP_SUCCESS,
  GET_MT5_MARKUP_FAIL,
  FETCH_CLIENTS_FAILED,
  FETCH_CLIENTS_START,
  FETCH_CLIENTS_SUCCESS,
  UPDATE_CLIENT_CALL_STATUS,
  UPDATE_CLIENT_CALL_STATUS_FAILED,
  UPDATE_CLIENT_CALL_STATUS_SUCCESS,
  ADD_NEW_CLIENT,
  ADD_NEW_IB,
  ADD_NEW_CLIENT_SUCCESS,
  ADD_NEW_IB_SUCCESS,
} from "./actionsType";

const initalState = {
  error: "",
  loading: false,
  linking: false,
  clearingCounter: 0,
  clients:[],
  successMessage: "",
  clientDetails: {
    fx: {},
    corporateInfo: {
      hqAddress: {},
      authorizedPerson: {},
    },
  },
  editSuccess: false,
  updatedClientDetails: "",
  statementLoading: false,
  statementDealsLoading: false,
  updateCallStatusLoading: false,
  clientProfileError: false,
  disable2FA: {
    loading: false
  },
  convertToIb: {
    loading: false,
    clear: false,
    success: false,
  },
  convertToLive: {
    loading: false,
    clear: false,
    success: false,
  },
  markups: {
    mt5: [],
  }
};

export const clientReducer = (state = initalState, action) => {
  switch (action.type) {
    case FETCH_CLIENTS_START:
      state = {
        ...state,
        loading: true,
      };
      break;
    case FETCH_CLIENTS_SUCCESS:
      state = {
        ...state,
        clients: [...action.payload.result.docs],
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
    case FETCH_CLIENTS_FAILED:
      state = {
        ...state,
        loading: false,
      };
      break;
    case ADD_NEW_CLIENT:
    case ADD_NEW_IB:
      state = {
        ...state,
        error: "",
        successMessage: "",
        addClientLoading: true,
        disableAddButton: true
      };

      break;
    case ADD_NEW_CLIENT_SUCCESS:
    case ADD_NEW_IB_SUCCESS:
      state = {
        ...state,
        loading: false,
        totalDocs: state.totalDocs + 1,
        clients: action.payload ? [{
          ...action.payload
        },
        ...state.clients] : [...state.clients],
        addClientLoading: false
      };
      break;
    case "ADD_MODAL_CLEAR":
      state = {
        ...state,
        showAddSuccessMessage: false,
        addClientLoading: false,
        disableAddButton: false
      };
      break;
    case "API_ERROR":
      state = {
        ...state,
        loading: false,
        error: action.payload.error,
        disableAddButton: false,
        addClientLoading: false
      };
      break;
    case UPDATE_FINANCIAL_INFO_SUCCESS:
      state = {
        ...state,
        clients: state.clients.map((client) => {
          if (client._id === action.payload.id) {
            return {
              ...client,
              financialInfo: { ...action.payload.financialInfo }
            };
          }
          else {
            return client;
          }

        }),
        financialInfoUpdating: false
      };
      break;
    case UPDATE_EMPLOYMENT_INFO_SUCCESS:
      state = {
        ...state,
        clients: state.clients.map((client) => {
          if (client._id === action.payload.id) {
            return {
              ...client,
              experience: { ...action.payload.values }
            };
          }
          else {
            return client;
          }
        }),
        employmentInfoUpdating: false

      };
      break;
    // fetch client details
    case FETCH_CLIENT_DETAILS_REQUESTED:
      state = {
        ...state,
        clientProfileloading: true
      };
      break;
    case FETCH_CLIENT_DETAILS_SUCCESS:
      state = {
        ...state,
        error: false,
        success: true,
        clientDetails: {
          ...action.payload.result
        },
        clientProfileloading: false,
        addError: false
      };
      break;
    case FETCH_REFERRALS_START:
      state = {
        ...state,
        clientDetails: {
          ...state.clientDetails,
          getReferralsLoading: true,
        }
      };
      break;
    case FETCH_REFERRALS_SUCCESS:
      state = {
        ...state,
        clientDetails: {
          ...state.clientDetails,
          referrals: action.payload
        },
        loading: false,
      };
      break;
    case FETCH_IB_PARENTS_START:
      state = {
        ...state,
        loading: true,

      };
      break;
    case FETCH_IB_PARENTS_SUCCESS:
      state = {
        ...state,
        clientDetails: {
          ...state.clientDetails,
          parents: action.payload
        },
        loading: false,
      };
      break;
    case FETCH_STATEMENT_START:
      state = {
        ...state,
        statementLoading: true,
      };
      break;
    case FETCH_STATEMENT_SUCCESS:
      state = {
        ...state,
        clientDetails: {
          ...state.clientDetails,
          statement: action.payload
        },
        statementLoading: false,
      };
      break;
    case FETCH_STATEMENT_DEALS_START:
      state = {
        ...state,
        statementDealsLoading: true,

      };
      break;
    case FETCH_STATEMENT_DEALS_SUCCESS:
      state = {
        ...state,
        clientDetails: {
          ...state.clientDetails,
          statementDeals: action.payload
        },
        statementDealsLoading: false,
      };
      break;
    case FETCH_CLIENT_DETAILS_FAIL:
      state = {
        ...state,
        clientProfileError: true,
        editSuccess: false,
        clientProfileloading: false
      };
      break;
    case FETCH_CLIENT_DETAILS_CLEAR:
      state = {
        ...state
      };
      break;

    // update client details
    case EDIT_CLIENT_DETAILS_REQUESTED:
      state = {
        ...state,
        updating: true,
        editSuccess: false,
        showPortalAccessModal: true
      };

      break;
    case UPDATE_EMPLOYMENT_INFO_START:
      state = {
        ...state,
        employmentInfoUpdating: true
      };
      break;
    case UPDATE_EMPLOYMENT_INFO_FAIL:
      state = {
        ...state,
        employmentInfoUpdating: false
      };
      break;
    case UPDATE_FINANCIAL_INFO_START:
      state = {
        ...state,
        financialInfoUpdating: true
      };
      break;
    case UPDATE_FINANCIAL_INFO_FAIL:
      state = {
        ...state,
        financialInfoUpdating: false
      };
      break;
    case EDIT_CLIENT_DETAILS_SUCCESS:
      state = {
        ...state,
        clientDetails: {
          ...state.clientDetails,
          ...action.payload
        },
        editSuccess: true,
        error: false,
        updating: false,
        showPortalAccessModal: false
      };
      break;
    case CHANGE_PASSWORD_START:
      state = {
        ...state,
        clearResetPasswordModal: false,
        disableResetPasswordButton: true
      };
      break;
    case RESET_PASSWORD_CLEAR:
      state = {
        ...state,
        clearResetPasswordModal: true,
        disableResetPasButton: false
      };
      break;
    case CLIENT_FORGOT_PASSWORD_START:
      state = {
        ...state,
        disableSendEmailButton: true,
        clearResetPasswordModal: false,
      };

      break;
    case CLIENT_FORGOT_PASSWORD_CLEAR:
      state = {
        ...state,
        disableSendEmailButton: false,
        clearResetPasswordModal: true
      };
      break;
    // TODO check the error message with the backend
    case EDIT_CLIENT_DETAILS_FAIL:
      state = {
        ...state,
        success: false,
        editError: true,
        EditErrorDetails: action.payload.error,
        updating: false
      };
      break;
    case EDIT_CLIENT_DETAILS_CLEAR:
      state = {
        ...state,
        editSuccess: false,
        editError: false
      };
      break;
    case FETCH_CLIENT_STAGES_END:
      state = {
        ...state,
        clientDetails: {
          ...state.clientDetails,
          stages: action.payload
        }
      };
      break;
    case "ASSIGN_AGENT_SUCCESS":
      state = {
        ...state,
        clients: state.clients.map(client => {
          for (let i = 0; i < action.payload.clientIds.length; i++) {
            if (client._id === action.payload.clientIds[i]) {
              return {
                ...client,
                agent: {
                  ...action.payload.agent
                }
              };
            }
          }
          return client;
        })
      };
      break;
    case CLIENT_DISABLE_2FA_START:
      return {
        ...state,
        disable2FA: {
          loading: true,
          success: false,
        }
      };
    case CLIENT_DISABLE_2FA_SUCCESS:
      return {
        ...state,
        disable2FA: {
          loading: false,
          success: true,
        }
      };
    case CLIENT_DISABLE_2FA_FAIL:
      return {
        ...state,
        disable2FA: {
          loading: false,
          success: false
        }
      };
    //convert reducers
    case CONVERT_TO_IB_START:
      return {
        ...state,
        convertToIb: {
          loading: true,
          success: false,
        }
      };
    case CONVERT_TO_IB_SUCCESS:
      return {
        ...state,
        convertToIb: {
          loading: false,
          success: true,
        }
      };
    case LINK_CLIENT_START:
    case UNLINK_IB_START:
    case UNLINK_CLIENTS_START:
      return {
        ...state,
        linking: true,
      };
    case LINK_CLIENT_SUCCESS:
    case UNLINK_IB_SUCCESS:
    case UNLINK_CLIENTS_SUCCESS:
      return {
        ...state,
        linking: false,
        clearingCounter: state.clearingCounter + 1,
      };
    case CONVERT_TO_IB_FAIL:
      return {
        ...state,
        convertToIb: {
          loading: false,
          success: false
        }
      };
    case CONVERT_TO_IB_CLEAR:
      state = {
        ...state,
        convertToIb: {
          loading: false,
          clear: true
        }
      };
      break;
    // Convert the client to Live
    case CONVERT_TO_CLIENT_START:
      state = {
        ...state,
        convertToLive: {
          loading: true,
          success: false,
        }
      };
      break;
    case CONVERT_TO_CLIENT_SUCCESS:
      state = {
        ...state,
        convertToLive: {
          loading: false,
          success: true,
        }
      };
      break;
    case CONVERT_TO_CLIENT_FAIL:
      state = {
        ...state,
        convertToLive: {
          loading: false,
          success: false
        }
      };
      break;
    case CONVERT_TO_CLIENT_CLEAR:
      state = {
        ...state,
        convertToLive: {
          loading: false,
          clear: true
        }
      };
      break;
    case GET_MT5_MARKUP_START:
      state = {
        ...state,
        markups: {
          ...state.markups,
          mt5: [],
        },
      };
      break;
    case GET_MT5_MARKUP_SUCCESS:
      state = {
        ...state,
        markups: {
          ...state.markups,
          mt5: action.payload?.result || [],
        },
      };
      break;
    case GET_MT5_MARKUP_FAIL:
      state = {
        ...state,
        markups: {
          ...state.markups,
          mt5: [],
        },
      };
      break;
    case UPDATE_CLIENT_CALL_STATUS:
      state = {
        ...state,
        updateCallStatusLoading: true,
      };
      break;
    case UPDATE_CLIENT_CALL_STATUS_SUCCESS:
      state = {
        ...state,
        clients: state.clients ? state.clients.map((client) => {
          if (client._id === action.payload?.clientId) {
            return {
              ...client,
              callStatus: action.payload?.callStatus,
            };
          }
          return client;
        }) : state.clients,
        updateCallStatusLoading: false,
      };
      break;
    case UPDATE_CLIENT_CALL_STATUS_FAILED:
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
export default clientReducer;
