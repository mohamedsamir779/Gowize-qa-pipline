const initalState = {
  loading:false,
  error:"",
  assets:[],
  addSymbolsuccessMessage:""
};
export const assetReducer = (state = initalState, action)=>{
  switch (action.type){
    case "FETCH_ASSETS_START":
      state = {
        ...state,
        loading:true,
      };
  
      break;
    case "FETCH_ASSETS_SUCCESS":
      state = {
        assets: [...action.payload.result.docs],
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
      break;
    case "ADD_NEW_SYMBOL":
      state = {
        ...state,
        error:"",
        disableAddButton:true
      };
      break;
    case "ADD_NEW_SYMBOL_SUCCESS":
      
      state = {
        ...state,

        totalDocs:state.totalDocs + 1,
        assets:[{
          
          ...action.payload,
          createdAt:new Date().toLocaleDateString(),
        }, ...state.assets],
        clearModal:false,
      };
      break;
    case "ADD_SYMBOL_CLEAR":
      
      state = {
        ...state,
        clearModal:true,
        disableAddButton:false
      };
      break;
    case "EDIT_SYMBOL_START":
      state = {
        ...state,
        editClear:false,
        disableEditButton : true
      };
      break;
    case "EDIT_SYMBOL_DONE":
      
      state = {
        ...state,
        assets:state.assets.map(asset=>{
          // eslint-disable-next-line no-case-declarations
          const { name, description, markup, explorerLink } = action.payload.jsonData;

          if (asset._id === action.payload.id){
            
            return {

              ...asset,
              image: action.payload.image ? action.payload.image : asset.image,
              name,
              description,
              markup,
              explorerLink,
              fee: {
                deposit:action.payload.jsonData.depositFee,
                withdrawal:action.payload.jsonData.withdrawFee
              },
              minAmount: {
                deposit :action.payload.jsonData.minDepositAmount,
                withdrawal:action.payload.jsonData.minWithdrawAmount
              },
            };
           
          }
          else {
            return asset;
          }
        }),
      };
      break;
    case "EDIT_SYMBOL_CLEAR":
      state = {
        ...state,
        editClear:true,
        disableEditButton:false
      };
    
      break;
    case "DELETE_SYMBOL_START":
      state = {
        ...state,
        deleteLoading:true,
        deleteModalClear:false
      };
      break;
    case "DELETE_SYMBOL_DONE":
      state = {
        ...state,
        assets:state.assets.filter(asset=>asset._id != action.payload.id),
        deleteLoading:false,
        deleteModalClear: true,
        deleteResult:action.payload.result,
        deleteError:action.payload.error,
        totalDocs:state.totalDocs - 1
      };
      break;
    case "API_ERROR":
      state = {
        ...state,
        error:action.payload.error
      };
      break;
    default:
      state = { ...state };
  }
  return state;
};
export default assetReducer;