import {
  FETCH_SYSTEM_EMAILS_REQUESTED,
  FETCH_SYSTEM_EMAILS_SUCCESS,
  FETCH_SYSTEM_EMAILS_FAIL,

  FETCH_SYSTEM_EMAIL_BY_ID_REQUESTED,
  FETCH_SYSTEM_EMAIL_BY_ID_SUCCESS,
  FETCH_SYSTEM_EMAIL_BY_ID_FAIL,
  FETCH_SYSTEM_EMAIL_BY_ID_CLEAR,

  ADD_SYSTEM_EMAIL_REQUESTED,
  ADD_SYSTEM_EMAIL_SUCCESS,
  ADD_SYSTEM_EMAIL_FAIL,
  ADD_SYSTEM_EMAIL_CLEAR,

  DELETE_SYSTEM_EMAIL_REQUESTED,
  DELETE_SYSTEM_EMAIL_SUCCESS,
  DELETE_SYSTEM_EMAIL_FAIL,

  EDIT_SYSTEM_EMAIL_REQUESTED,
  EDIT_SYSTEM_EMAIL_SUCCESS,
  EDIT_SYSTEM_EMAIL_FAIL,
  EDIT_SYSTEM_EMAIL_CLEAR,

  EDIT_SYSTEM_EMAIL_CONTENT_REQUESTED,
  EDIT_SYSTEM_EMAIL_CONTENT_SUCCESS,
  EDIT_SYSTEM_EMAIL_CONTENT_FAIL,
  EDIT_SYSTEM_EMAIL_CONTENT_CLEAR,

  FETCH_SYSTEM_EMAIL_HTML_REQUESTED,
  FETCH_SYSTEM_EMAIL_HTML_SUCCESS,
  FETCH_SYSTEM_EMAIL_HTML_FAIL,

  CHANGE_SYSTEM_EMAIL_STATUS_REQUESTED,
  CHANGE_SYSTEM_EMAIL_STATUS_DONE
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
  systemEmails: [],
  clearingCounter: 0,
  deleteClearingCounter: 0,
  editClearingCounter: 0,
  editContentClearingCounter: 0,
  activeComponentProp: "list component",
  isBackButtonActive: true,
  docs: [],
  systemEmailContentUpdatedSuccess: false
};

const systemEmailsReducer = (state = initialState, action) => {
  switch (action.type){
    // FETCH
    case FETCH_SYSTEM_EMAILS_REQUESTED:
      state = {
        ...state,
        loading: true
      };
      break;
    case FETCH_SYSTEM_EMAILS_SUCCESS:
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
        systemEmail: null,
        addError: false
      };
      break;
    case FETCH_SYSTEM_EMAILS_FAIL:
      state = {
        ...state,
        loading: false,
        error: action.payload.error.message
      };
      break;

    // FETCH BY ID
    case FETCH_SYSTEM_EMAIL_BY_ID_REQUESTED:
      state = {
        ...state,
        loading: true
      };
      break;
    case FETCH_SYSTEM_EMAIL_BY_ID_SUCCESS:
      state = {
        ...state,
        loading: false,
        systemEmail: action.payload.result
      };
      break;
    case FETCH_SYSTEM_EMAIL_BY_ID_FAIL:
      state = {
        ...state,
        loading: false,
        fetchByIdError: action.payload.error
      };
      break;
    case FETCH_SYSTEM_EMAIL_BY_ID_CLEAR:
      state = {
        ...state
      };
      break;

    // ADD
    case ADD_SYSTEM_EMAIL_REQUESTED:
      state = {
        ...state,
        addLoading: true,
        systemEmail: null
      };
      break;
    case ADD_SYSTEM_EMAIL_SUCCESS:
      state = {
        ...state,
        addResult: action.payload,
        docs: [ action.payload, ...state.docs ],
        addSuccess: true,
        addError: false,
        addLoading: false,
        systemEmail: action.payload
      };
      break;
    case ADD_SYSTEM_EMAIL_FAIL:
      state = {
        ...state,
        addErrorDetails: action.payload.error.message,
        addLoading: false,
        addSuccess: false,
        addError: true
      };
      break;
    case ADD_SYSTEM_EMAIL_CLEAR:
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

    // DELETE
    case DELETE_SYSTEM_EMAIL_REQUESTED:
      state = {
        ...state,
        deleteLoading: true
      };
      break;
    case DELETE_SYSTEM_EMAIL_SUCCESS:
      state = {
        ...state,
        docs: state.docs.filter(obj => obj._id !== action.payload.id),
        deleteLoading: false,
        deleteResult: action.payload.result,
        deleteError: action.payload.error,
        deleteClearingCounter: state.deleteClearingCounter + 1
      };
      break;
    case DELETE_SYSTEM_EMAIL_FAIL:
      state = {
        ...state,
        deleteError: action.payload.error.message
      };
      break;

    // EDIT
    case EDIT_SYSTEM_EMAIL_REQUESTED:
      state = {
        ...state,
        editLoading: true
      };
      break;
    case EDIT_SYSTEM_EMAIL_SUCCESS:
      // eslint-disable-next-line
      const { id, ...payload } = action.payload; 
      state = {
        ...state,
        docs: state.docs.map(obj => {
          if (obj.id === id){
            return {
              ...obj,
              title: payload.result.title,
              action: payload.result.action
            }; 
          } else {
            return obj;
          }
        }),
        editLoading: false,
        editResult: action.payload.data.message,
        editSuccess: true
      };
      break;
    case EDIT_SYSTEM_EMAIL_FAIL:
      state = {
        ...state,
        editLoading: false,
        editError: action.payload.error.message,
        editSuccess: false
      };
      break;
    case EDIT_SYSTEM_EMAIL_CLEAR:
      state = {
        ...state,
        editResult: null,
        editError: null,
        editClearingCounter: state.editClearingCounter + 1
      };
      break;

    // edit content
    case EDIT_SYSTEM_EMAIL_CONTENT_REQUESTED:
      state = {
        ...state,
        editLoading: true
      };
      break;
    case EDIT_SYSTEM_EMAIL_CONTENT_SUCCESS:
      {
        // eslint-disable-next-line
        const { id, ...payload } = action.payload;
        state = {
          ...state,
          docs: state.docs.map(obj => {
            if (obj.id === id){
              return {
                ...obj,
                language: action.payload.language,
                subject: action.payload.subject,
                body: action.payload.body
              };
            } else {
              return obj;
            }
          }),
          editLoading: false,
          editContentResult: action.payload.data.message,
          systemEmailContentUpdatedSuccess: true
        };
      }
      break;
    case EDIT_SYSTEM_EMAIL_CONTENT_FAIL:
      state = {
        ...state,
        editLoading: false,
        editContentError: action.payload.error.error
      };
      break;
    case EDIT_SYSTEM_EMAIL_CONTENT_CLEAR:
      state = {
        ...state,
        editContentResult: null,
        editContentError: null,
        editContentClearingCounter: state.editContentClearingCounter + 1,
        isBackButtonActive: true,
        systemEmailContentUpdatedSuccess: false
      };
      break;
    
    // fetch system email html
    case FETCH_SYSTEM_EMAIL_HTML_REQUESTED:
      state = {
        ...state,
        htmlLoading: true
      };
      break;
    case FETCH_SYSTEM_EMAIL_HTML_SUCCESS:
      state = {
        ...state,
        htmlLoading: false,
        htmlSuccess: true,
        htmlFail: false,
        systemEmailHtml: action.payload
      };
      break;
    case FETCH_SYSTEM_EMAIL_HTML_FAIL:
      state = {
        ...state,
        htmlLoading: false,
        htmlSuccess: false,
        htmlFail: true,
        htmlFailDetails: action.payload
      };
      break;

    // change system email status
    case CHANGE_SYSTEM_EMAIL_STATUS_REQUESTED:
      state = {
        ...state,
        changeStatusLoading:true,
        changeStatusIndex: action.payload.index,
      };
      break;
    case CHANGE_SYSTEM_EMAIL_STATUS_DONE:
      state = {
        ...state,
        docs: state.docs.map((systemEmail, index) => {
          if (index === action.payload.index && !action.payload.error) {
            systemEmail.isActive = !systemEmail.isActive;
          }
          return systemEmail;
        }),
        changeStatusLoading: false
      };
      break;
    
    default: 
      state = { ...state };
  }

  return state;
};

export default systemEmailsReducer;