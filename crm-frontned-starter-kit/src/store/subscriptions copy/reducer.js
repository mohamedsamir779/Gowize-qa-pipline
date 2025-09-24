const {
  SUBSCRIBE_PUSH_NOTIFICATION,
  SUBSCRIBE_PUSH_NOTIFICATION_SUCCESS,
  SUBSCRIBE_PUSH_NOTIFICATION_ERROR,
  UNSUBSCRIBE_PUSH_NOTIFICATION,
  UNSUBSCRIBE_PUSH_NOTIFICATION_SUCCESS,
  UNSUBSCRIBE_PUSH_NOTIFICATION_ERROR,
} = require("./actionTypes");

const initialState = {
  loading: false,
  unSubscribeLoading: false,
  error: "",
  success: "",
};

const subscriptionReducer = (state = initialState, action) => {
  switch (action.type) {
    case SUBSCRIBE_PUSH_NOTIFICATION:
      state = {
        ...state,
        loading: true,
      };
      break;
    case SUBSCRIBE_PUSH_NOTIFICATION_SUCCESS:
      state = {
        ...state,
        loading: false,
        success: action.payload,
      };
      break;
    case SUBSCRIBE_PUSH_NOTIFICATION_ERROR:
      state = {
        ...state,
        loading: false,
        error: action.payload,
      };
      break;
    case UNSUBSCRIBE_PUSH_NOTIFICATION:
      state = {
        ...state,
        loading: true,
      };
      break;
    case UNSUBSCRIBE_PUSH_NOTIFICATION_SUCCESS:
      state = {
        ...state,
        loading: false,
        success: action.payload,
      };
      break;
    case UNSUBSCRIBE_PUSH_NOTIFICATION_ERROR:
      state = {
        ...state,
        loading: false,
        error: action.payload,
      };
      break;
    default:
      break;
  }
  return state;
};

export default subscriptionReducer;