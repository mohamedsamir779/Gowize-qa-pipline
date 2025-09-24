import { 
  POST_ORDER_FAIL,  
  POST_ORDER_START, 
  POST_ORDER_SUCCESS,
  GET_ORDERS_SUCCESS,
  GET_ORDERS_START
} 
  from "./actionTypes";

const initialState = {
  loading: false,
  error: "",
  orders: []
};

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_ORDER_START:
      return {
        ...state,
        error:"",
        loading: true
      };
    case GET_ORDERS_START:
      return {
        ...state,
        error:"",
        loading: true
      };
    case POST_ORDER_SUCCESS:
      return {
        ...state,
        orders: state.orders,
        error: "",
        loading: false
      };
    case POST_ORDER_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case GET_ORDERS_SUCCESS:
      return {
        ...state,
        loading:false,
        orders: [...action.payload.docs],
        ordersTotalDocs : action.payload.totalDocs
      };
    default:
      return state;
  }
};
export default orderReducer;