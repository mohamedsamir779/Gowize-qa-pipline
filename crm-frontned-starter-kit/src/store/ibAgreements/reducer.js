import {
  FETCH_IB_AGREEMENTS_START, FETCH_IB_AGREEMENTS_SUCCESS,
  FETCH_IB_PRODUCTS_START, FETCH_IB_PRODUCTS_SUCCESS,
  ADD_MASTER_IB_AGREEMENT_START, ADD_MASTER_IB_AGREEMENT_SUCCESS,
  ADD_SHARED_IB_AGREEMENT_START, ADD_SHARED_IB_AGREEMENT_SUCCESS,
  DELETE_IB_AGREEMENT_START, DELETE_IB_AGREEMENT_SUCCESS,
  UPDATE_MASTER_IB_AGREEMENT_START, UPDATE_MASTER_IB_AGREEMENT_SUCCESS,
  UPDATE_SHARED_IB_AGREEMENT_START, UPDATE_SHARED_IB_AGREEMENT_SUCCESS,
  API_ERROR,
} from "./actionTypes";

const initalState = {
  loading: false,
  submitting: false,
  deleting: false,
  error: "",
  products: [],
  agreements: [],
  successMessage: ""
};
const ibAgreementReducer = (state = initalState, action) => {
  switch (action.type) {
    case FETCH_IB_AGREEMENTS_START:
    case FETCH_IB_PRODUCTS_START:
      state = {
        ...state,
        loading: true,
        error: ""
      };
      break;
    case ADD_MASTER_IB_AGREEMENT_START:
    case ADD_SHARED_IB_AGREEMENT_START:
    case UPDATE_MASTER_IB_AGREEMENT_START:
    case UPDATE_SHARED_IB_AGREEMENT_START:
      state = {
        ...state,
        submitting: true,
        error: ""
      };
      break;
    case FETCH_IB_PRODUCTS_SUCCESS:
      state = {
        ...state,
        products: action.payload,
        loading: false
      };
      break;
    case FETCH_IB_AGREEMENTS_SUCCESS:
      state = {
        ...state,
        agreements: action.payload,
        loading: false
      };
      break;
    case ADD_MASTER_IB_AGREEMENT_SUCCESS:
    case ADD_SHARED_IB_AGREEMENT_SUCCESS:
    case UPDATE_MASTER_IB_AGREEMENT_SUCCESS:
    case UPDATE_SHARED_IB_AGREEMENT_SUCCESS:
      state = {
        ...state,
        submitting: false
      };
      break;
    case DELETE_IB_AGREEMENT_START:
      state = {
        ...state,
        deleting: true,
      };
      break;
    case DELETE_IB_AGREEMENT_SUCCESS:
      state = {
        ...state,
        agreements: state.agreements.filter(agreement => agreement._id != action.payload.id),
        deleting: false,
      };
      break;
    case API_ERROR:
      state = {
        ...state,
        error: action.payload.error,
        submitting: false,
      };
      break;
    default:
      state = { ...state };
  }
  return state;
};
export default ibAgreementReducer;