import {
  FETCH_CAMPAIGN_UNSUBSCRIBERS_REQUESTED,
  FETCH_CAMPAIGN_UNSUBSCRIBERS_SUCCESS,
  FETCH_CAMPAIGN_UNSUBSCRIBERS_FAIL,
} from "./actionTypes";

const initialState = {
  error: "",
  loading: false,
  docs: [],
};

const campaignUnsubscribers = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_CAMPAIGN_UNSUBSCRIBERS_REQUESTED:
      state = {
        ...state,
        loading: true
      };
      break;
    case FETCH_CAMPAIGN_UNSUBSCRIBERS_SUCCESS:
      state = {
        ...state,
        loading: false,
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
      };
      break;
    case FETCH_CAMPAIGN_UNSUBSCRIBERS_FAIL:
      state = {
        ...state,
        loading: false,
        error: action.payload.error.message
      };
      break;
    default:
      state = { ...state };
  }

  return state;
};

export default campaignUnsubscribers;