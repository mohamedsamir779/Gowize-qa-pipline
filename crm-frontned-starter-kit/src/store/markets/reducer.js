import {
  FETCH_MARKETS_START, 
  FETCH_MARKETS_SUCCESS, 
  EDIT_MARKET_START, 
  EDIT_MARKET_SUCCESS, 
  EDIT_MARKET_CLEAR, 
  ADD_NEW_MARKET, 
  ADD_NEW_MARKET_SUCCESS, 
  ADD_MARKET_CLEAR, 
  ADD_MARKET_ERROR,

  CHANGE_MARKET_STATUS_REQUESTED,
  CHANGE_MARKET_STATUS_DONE
} from "./actionTypes";

const initialState = {
  loading:false,
  markets:[],
  error:""
};
const marketsReducer = (state = initialState, action)=>{
  switch (action.type) {
    case FETCH_MARKETS_START:
      return {
        ...state,
        loading:true 
      };    
    case FETCH_MARKETS_SUCCESS:
      return {
        markets: [...action.payload.result.docs],
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
    case EDIT_MARKET_START:
      return  {
        ...state,
        editLoading:true,
        editClear:false,
      };
    case EDIT_MARKET_SUCCESS:
      return {
        ...state,
        editLoading:false,
        editClear:true,
      };
    case EDIT_MARKET_CLEAR:
      return {
        ...state,
        editDone:false,
        editClear:true,
      };
    case ADD_NEW_MARKET:
      return {
        ...state,
        error:"",
        successMessage:""
      };
    case ADD_NEW_MARKET_SUCCESS:
      return  {
        ...state,
        totalDocs:state.totalDocs + 1,
        markets:[{
          ...action.payload.newMarket,
          _id:action.payload.newMarket.id,
          createdAt:new Date().toLocaleDateString(), 
          pairName:`${action.payload.newMarket.baseAsset}/${action.payload.newMarket.quoteAsset}`,
          minAmount:{
            "$numberDecimal":action.payload.newMarket.minAmount,
          },
          fee:{
            "$numberDecimal":action.payload.newMarket.fee,
          }
        }, ...state.markets],
        addMarketSuccessMessage:"New market is added successfully",
      };
    case ADD_MARKET_CLEAR:
      return {
        ...state,
        addMarketSuccessMessage:"",
        error:""
      };
    case ADD_MARKET_ERROR:
      return {
        ...state,
        error:action.payload
      };
    
    // change market status
    case CHANGE_MARKET_STATUS_REQUESTED:
      return {
        ...state,
        changeStatusLoading:true,
        changeStatusIndex: action.payload.index,
      };
    case CHANGE_MARKET_STATUS_DONE:
      return {
        ...state,
        markets: state.markets.map((market, index) => {
          if (index === action.payload.index && !action.payload.error) {
            market.active = !market.active;
          }
          return market;
        }),
        changeStatusLoading: false
      };
      
    default:
      return state;
  }
};
export default marketsReducer;