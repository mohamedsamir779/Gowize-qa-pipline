import {
  FETCH_TEAMS_START,
  FETCH_TEAMS_SUCCESS,
  FETCH_TEAMS_ERROR,
  ADD_TEAMS_START,
  ADD_TEAMS_SUCCESS,
  ADD_TEAMS_ERROR,
  ADD_TEAMS_CLEAR,

  FETCH_MANAGERS_TEAMS_START,
  FETCH_MANAGERS_TEAMS_SUCCESS,
  FETCH_MANAGERS_TEAMS_ERROR,

  FETCH_MEMBERS_TEAMS_START,
  FETCH_MEMBERS_TEAMS_SUCCESS,
  FETCH_MEMBERS_TEAMS_ERROR,

  EDIT_TEAMS_MEMBERS_START,
  EDIT_TEAMS_MEMBERS_DONE,
  EDIT_TEAMS_MEMBERS_ERROR,
  EDIT_TEAMS_MEMBERS_CLEAR,

  EDIT_TEAMS_START,
  EDIT_TEAMS_DONE,
  EDIT_TEAMS_ERROR,
  EDIT_TEAMS_CLEAR,

  DELETE_TEAMS_START,
  DELETE_TEAMS_DONE,
} from "./actionTypes";

const initialState = {
  loading: false,
  error: "",
  roles: [],
  clearingCounter: 0,
  editClearingCounter: 0,
  deleteClearingCounter: 0,
  // hiteamsreducer: "hiiiiiiiiiiiiiiiiiiiiiii",
  addSuccess: false,
  // totalDocs: 0,

  // docs: [],
  // page: 1
};
const teamsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TEAMS_START:
      state = {
        ...state,
        loading: true,
      };
      break;
    case FETCH_TEAMS_SUCCESS:
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
    case FETCH_TEAMS_ERROR:
      state = {
        ...state,
        loading: false,
        error: action.payload.error
      };
      break;
    // *************************
    case FETCH_MANAGERS_TEAMS_START:
      state = {
        ...state,
        managersloading: true,
      };
      break;
    case FETCH_MANAGERS_TEAMS_SUCCESS:
      state = {
        ...state,
        managersloading: false,
        managersData: [...action.payload.docs],
      };
      break;
    case FETCH_MANAGERS_TEAMS_ERROR:
      state = {
        ...state,
        managersloading: false,
        managersError: action.payload.error
      };
      break;
    // *************************
    case FETCH_MEMBERS_TEAMS_START:
      state = {
        ...state,
        membersloading: true,
      };
      break;
    case FETCH_MEMBERS_TEAMS_SUCCESS:
      state = {
        ...state,
        membersloading: false,
        membersData: [...action.payload.docs],
      };
      break;
    case FETCH_MEMBERS_TEAMS_ERROR:
      state = {
        ...state,
        membersloading: false,
        membersError: action.payload.error
      };
      break;

    // *************************
    case ADD_TEAMS_START:
      state = {
        ...state,
        addLoading: true,
      };
      break;
    case ADD_TEAMS_SUCCESS:
      state = {
        ...state,
        addResult: action.payload,
        docs: [...state.docs, action.payload],
        addSuccess: true,
        addError: false,
        addLoading: false,
      };
      break;
    case ADD_TEAMS_ERROR:
      state = {
        ...state,
        addLoading: false,
        addErrorDetails: action.payload,
        addSuccess: false,
        addError: true,
      };
      break;
    case ADD_TEAMS_CLEAR:
      state = {
        ...state,
        addErrorDetails: "",
        addSuccess: false,
        addError: false,
        addResult: null,
        clearingCounter: state.clearingCounter + 1
      };
      break;

    case EDIT_TEAMS_START:
      state = {
        ...state,
        editLoading: true,
      };
      break;
    case EDIT_TEAMS_DONE:
      // eslint-disable-next-line no-case-declarations
      const { id, ...payload } = action.payload;
      state = {
        ...state,
        docs: state.docs.map(obj => {
          if (obj._id === id) {
            return {
              ...obj,
              ...action.payload.result
            };
          } else {
            return obj;
          }
        }),
        editLoading: false,
        editResult: action.payload.result,
        editSuccess: true,
        editError: action.payload.error,
        clearingCounter: state.clearingCounter + 1,
      };
      break;
    case EDIT_TEAMS_ERROR:
      state = {
        ...state,
        editLoading: false,
        editError: action.payload.error,
        editSuccess: false,
      };
      break;
    case EDIT_TEAMS_CLEAR:
      state = {
        ...state,
        editResult: null,
        editError: null,
        editClearingCounter: state.editClearingCounter + 1,
        editSuccess: false,
      };
      break;

    // ###############################
    case EDIT_TEAMS_MEMBERS_START:
      state = {
        ...state,
        editLoading: true,
      };
      break;
    case EDIT_TEAMS_MEMBERS_DONE:
      state = {
        ...state,
        docs: state.docs.map(obj => {
          if (obj._id === action.payload.id) {
            return {
              ...obj,
              members:[...obj.members, { id:action.payload.id } ]
            };
          } else {
            return obj;
          }
        }),
        editLoading: false,
        editResult: action.payload.result,
        editSuccess: true,
        editError: action.payload.error,
        clearingCounter: state.clearingCounter + 1,
      };
      break;
    case EDIT_TEAMS_MEMBERS_ERROR:
      state = {
        ...state,
        editLoading: false,
        editError: action.payload.error,
        editSuccess: false,
      };
      break;
    case EDIT_TEAMS_MEMBERS_CLEAR:
      state = {
        ...state,
        editResult: null,
        editError: null,
        editClearingCounter: state.editClearingCounter + 1,
        editSuccess: false,
      };
      break;
    // ###########################
    case DELETE_TEAMS_START:
      state = {
        ...state,
        deleteLoading: true,
      };
      break;
    case DELETE_TEAMS_DONE:
      state = {
        ...state,
        docs: state.docs.filter(obj => obj._id !== action.payload.id),
        deleteLoading: false,
        deleteResult: action.payload.result,
        deleteError: action.payload.error,
        deleteClearingCounter: state.deleteClearingCounter + 1,
      };
      break;
    default:
      state = { ...state };

  }
  return state;
};
export default teamsReducer;