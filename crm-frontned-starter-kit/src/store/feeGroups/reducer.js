const initalState = {
  loading:false,
  error:"",
  feeGroups :[],
  successMessage:""
};
const feeGroupReducer = (state = initalState, action)=>{
  switch (action.type){
    case "FETCH_FEE_GROUPS_START":
      state = {
        ...state,
        loading:true,
        error:""
      };
      break;
    case "FETCH_FEE_GROUPS_SUCCESS":
      state = {
        ...state,
        feeGroups: [...action.payload.result.docs],
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
    case "ADD_FEES_GROUP_SUCCESS":
      state = {
        ...state,
        feeGroups:[{ ...action.payload }, ...state.feeGroups],
        totalDocs: state.totalDocs + 1,
        showAddSuccessMessage:true,
        addButtonDisabled:true
      };
      break;
    case "ADD_MODAL_CLEAR":
      state = {
        ...state,
        showAddSuccessMessage:false,
        addButtonDisabled: false
      };
      break;
    case "EDIT_FEE_GROUP_SUCCESS":
      state = {
        ...state,
        feeGroups :state.feeGroups.map(feeGroup=>{
          
          if (feeGroup._id === action.payload._id){
            return {
              ...feeGroup,
              ...action.payload,
              value:{ $numberDecimal : action.payload.value },
              minValue:{ $numberDecimal : action.payload.minValue },
              maxValue:{ $numberDecimal : action.payload.maxValue }
            };
          }
          else {
            return feeGroup;
          }
        }),
        showEditSuccessMessage :true,
        editButtonDisabled :true
      };
      break;
    case "EDIT_MODAL_CLEAR":
      state = {
        ...state,
        showEditSuccessMessage:false,
        editButtonDisabled :false
      };

      break;
    case "DELETE_FEE_GROUP_SUCCESS":
      
      state = {
        ...state,
        feeGroups :state.feeGroups.filter(feeGroup=> feeGroup._id !== action.payload.id),
        totalDocs : state.totalDocs - 1,
        showDeleteModal:true,
        deleteLoading:true
      };
    
      break;
    case "DELETE_MODAL_CLEAR":
      state = {
        ...state,
        showDeleteModal:false,
        deleteLoading:false
      };
      break;
    case "API_ERROR":
      state = {
        ...state,
        error:action.payload.error
      };
      break;
    default :
      state = { ...state };
  }
  return state;
};
export default feeGroupReducer;