
import {
  FETCH_ROLES_START,
  FETCH_ROLES_SUCCESS,
  FETCH_ROLES_ERROR,
  ADD_ROLES_START,
  ADD_ROLES_SUCCESS,
  ADD_ROLES_ERROR,
  ADD_ROLE_CLEAR,
  EDIT_ROLES_START,
  EDIT_ROLES_DONE,
  EDIT_ROLE_CLEAR,
  DELETE_ROLES_START,
  DELETE_ROLES_DONE,
  CHANGE_STATUS_ROLES_START,
  CHANGE_STATUS_ROLES_END
} from "./actionTypes";

const initialState = {
  loading: false,
  error: "",
  roles: [],
  clearingCounter: 0,
  editClearingCounter: 0,
  deleteClearingCounter: 0,
  // totalDocs: 0,
  // docs: [],
  // page: 1
};
const leadReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_ROLES_START:
      state = {
        ...state,
        loading: true,
      };
      break;
    case FETCH_ROLES_SUCCESS:
      state = {
        ...state,
        docs: [...action.payload.docs],
        totalDocs: action.payload.totalDocs,
        hasNextPage: action.payload.hasNextPage,
        hasPrevPage: action.payload.hasPrevPage,
        limit: action.payload.limit,
        nextPage: action.payload.nextPage,
        page: action.payload.page,
        pagingCounter: action.payload.pagingCounter,
        prevPage: action.payload.prevPage,
        totalPages: action.payload.totalPages,
        loading: false,
      };
      break;
    case FETCH_ROLES_ERROR:
      state = {
        ...state,
        loading: false,
        error: action.payload.error
      };
      break;

    case ADD_ROLES_START:
      state = {
        ...state,
        addLoading: true,
      };
      break;
    case ADD_ROLES_SUCCESS:
      state = {
        ...state,
        addResult: action.payload,
        docs: [action.payload, ...state.docs],
        addSuccess: true,
        addError: false,
        addLoading: false,
      };
      break;
    case ADD_ROLES_ERROR:
      state = {
        ...state,
        addLoading: false,
        addErrorDetails: action.payload,
        addSuccess: false,
        addError: true,
      };
      break;
    case ADD_ROLE_CLEAR:
      state = {
        ...state,
        addErrorDetails: "",
        addSuccess: false,
        addError: false,
        addResult: null,
        clearingCounter: state.clearingCounter + 1
      };
      break;

    case EDIT_ROLES_START:
      state = {
        ...state,
        editLoading: true,
      };
      break;
    case EDIT_ROLES_DONE:
      // eslint-disable-next-line no-case-declarations
      const { id, ...payload } = action.payload;
      state = {
        ...state,
        docs: state.docs.map(obj => {
          if (obj._id === id) {
            return {
              ...obj,
              title: payload.result.title,
              permissions: payload.result.permissions,
            };
          } else {
            return obj;
          }
        }),
        editLoading: false,
        editResult: action.payload.result,
        editError: action.payload.error,
      };
      break;
    case EDIT_ROLE_CLEAR:
      state = {
        ...state,
        editResult: null,
        editError: null,
        editClearingCounter: state.editClearingCounter + 1
      };
      break;
    case DELETE_ROLES_START:
      state = {
        ...state,
        deleteLoading: true,
      };
      break;
    case DELETE_ROLES_DONE:
      state = {
        ...state,
        docs: state.docs.filter(obj => obj._id !== action.payload.id),
        deleteLoading: false,
        deleteResult: action.payload.result,
        deleteError: action.payload.error,
        deleteClearingCounter: state.deleteClearingCounter + 1,
      };
      break;
    case CHANGE_STATUS_ROLES_START:
      state = {
        ...state,
        changeStatusLoading: true,
        changeStatusLoadingIndex: action.payload.index,
      };
      break;
    case CHANGE_STATUS_ROLES_END:
      state = {
        ...state,
        docs: state.docs.map((obj, index) => {
          if (index === action.payload.index && !action.payload.error) {
            obj.isActive = !obj.isActive;
          }
          return obj;
        }),
        changeStatusLoading: false,
      };
      break;
    default:
      state = { ...state };

  }
  return state;
};
export default leadReducer;