
import { ORDER_BOOK_UPDATE } from "../../general/sockets/actionTypes";
import {
  ORDER_BOOKS_FETCH,
  ORDER_BOOKS_FETCH_SUCCESSFUL,
  ORDER_BOOKS_FETCH_FAILED,
} from "./actionTypes";

const initialState = {
  loading: false,
  error: "",
  orderBooks: [],
  clearingCounter: 0,
  editClearingCounter: 0,
  deleteClearingCounter: 0,
};

const updateOrderBooks = (currentOrderBooks, newData) => {
  let updatedData = currentOrderBooks;
  updatedData = updatedData.map((market) => {
    if (market.pairName === newData.pairName) {
      return {
        ...market,
        ...newData
      };
    }
    return market;
  });
  return updatedData;
};

const orderBooksReducer = (state = initialState, action) => {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case ORDER_BOOKS_FETCH:
      state = {
        ...state,
        loading: true,
      };
      break;
    case ORDER_BOOK_UPDATE:
      const orderBooks = updateOrderBooks(state.orderBooks, action.payload);
      state = {
        ...state,
        orderBooks,
      };
      break;
    case ORDER_BOOKS_FETCH_SUCCESSFUL: 
      state = {
        ...state,
        loading: false,
        orderBooks: action.payload,
      };
      break;
    case ORDER_BOOKS_FETCH_FAILED: 
      state = {
        ...state,
        loading: false,
        error: action.payload.error
      };
      break;
    default:
      state = { ...state };
  }
  return state;
};

export default orderBooksReducer;
