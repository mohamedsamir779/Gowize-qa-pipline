import {
  FETCH_MARKUPS_START,
  FETCH_MARKUPS_SUCCESS,
  MARKUP_EDIT_START,
  MARKUP_EDIT_SUCCESS,
  EDIT_MARKUP_CLEAR,
  DELETE_MARKUP_START,
  DELETE_MARKUP_SUCCESS,
  ADD_MARKUP_START,
  ADD_MARKUP_SUCCESS,
  MARKUP_API_ERROR,
  ADD_MARKUP_CLEAR,
  DELETE_MARKUP_CLEAR,
  FETCH_MARKUP_DETAILS_START
} from "./actionTypes";

const initialState = {
  loading: false,
  markups: [],
  error: "",
  addMarkupSuccess: false,
  addMarkupSuccessMessage: "",
  editR: 0
};

const markupsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MARKUPS_START:
      return {
        ...state,
        loading: true
      };
    case FETCH_MARKUPS_SUCCESS:
      return {
        ...state,
        markups: [...action.payload.result.docs],
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
    case MARKUP_EDIT_START:
      return {
        ...state,
        editLoading: true,
        editClear: false,
      };
    case MARKUP_EDIT_SUCCESS:
      return {
        ...state,
        markups: state.markups.map(markup => {
          if (markup._id === action.payload.id) {
            const { isPercentage, title, value } = action.payload.values;
            return {
              ...markup,
              isPercentage,
              title,
              value,
            };
          }
          else {
            return markup;
          }
        }),
        editLoading: false,
        editDone: true 
      };
    case EDIT_MARKUP_CLEAR:
      return {
        ...state,
        editDone: false,
        editClear: true,
        editR: state.editR + 1
      };
    case DELETE_MARKUP_START:
      return {
        ...state,
        deleteLoading: true,
        deleteModalClear: false
      };
    case DELETE_MARKUP_SUCCESS:
      return {
        ...state,
        markups: state.markups.filter(markup => markup._id != action.payload.id),
        deleteLoading: false,
        deleteModalClear: true,
        deleteResult: action.payload.result,
        deleteError: action.payload.error,
        totalDocs: state.totalDocs - 1
      };
    case DELETE_MARKUP_CLEAR:
      return {
        ...state,
        deleteModalClear: true,
        deleteLoading: false
      };
    case ADD_MARKUP_START:
      return {
        ...state,
        error: "",
        successMessage: ""
      };
    case ADD_MARKUP_SUCCESS:
      return {
        ...state,
        addMarkupSuccess: true,
        addMarkupSuccessMessage: "New markup is added successfully",
      };
    case MARKUP_API_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case ADD_MARKUP_CLEAR:
      return {
        ...state,
        addMarkupSuccessMessage: ""
      };
    case FETCH_MARKUP_DETAILS_START:
      return {
        ...state,
        fetchSingleMarkupLoading: true
      };
    default:
      return state;
  }
};
export default markupsReducer;