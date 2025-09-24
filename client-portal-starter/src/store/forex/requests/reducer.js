import {
  REQ_IB_START, REQ_IB_SUCCESS, 
  REQ_IB_FAIL, 
  GET_IB_REQUEST_STATUS_SUCCESS, 
  GET_IB_REQUEST_STATUS, 
  GET_IB_REQUEST_STATUS_FAIL, 
  CREATE_CHANGE_LEVERAGE_REQ_REQUESTED,
  CREATE_CHANGE_LEVERAGE_REQ_SUCCESS,
  CREATE_CHANGE_LEVERAGE_REQ_FAIL 
} from "./actionTypes";

const initialState = {
  partnership:{
    loading: false,
    getStatusLoader:false,
  }
};

function requests(state = initialState, action) {
  switch (action.type) {
    case REQ_IB_START:
      return {
        ...state,
        partnership: { loading: true }
      };  
    case REQ_IB_SUCCESS:
      return {
        ...state,
        partnership: {
          loading: false,
          result:action.payload
        }
      };
    case REQ_IB_FAIL:
      return {
        ...state,
        partnership: {
          loading: false,
        }
      }; 
    case GET_IB_REQUEST_STATUS:
      return {
        ...state,
        partnership:{
          ...state.partnership,
          getStatusLoader:true
        }
      };
    case GET_IB_REQUEST_STATUS_SUCCESS:
      return {
        ...state,
        partnership:{
          ...state.partnership,
          getStatusLoader:false,
          status:action.payload.status
        }
      };
    case GET_IB_REQUEST_STATUS_FAIL:
      return {
        ...state,
        partnership:{
          ...state.partnership,
          getStatusLoader:false,
        }
      };

    // change leverage request
    case CREATE_CHANGE_LEVERAGE_REQ_REQUESTED:
      return {
        ...state,
        createChangeLeverageRequestLoading: true
      };
    case CREATE_CHANGE_LEVERAGE_REQ_SUCCESS:
      return {
        ...state,
        createChangeLeverageRequestLoading: false,
        createChangeLeverageRequestFail: false
      };
    case CREATE_CHANGE_LEVERAGE_REQ_FAIL:
      return {
        ...state,
        createChangeLeverageRequestLoading: false,
        createChangeLeverageRequestFail: true
      };

    default:
      return state;
  }
}
export default requests;