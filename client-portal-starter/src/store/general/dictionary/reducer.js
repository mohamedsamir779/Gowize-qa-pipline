import {
  FETCH_DICTIONARY_START,
  FETCH_DICTIONARY_END,
} from "./actionTypes";
  
const initialState = {
  loading:false
};
const DocumentsReducer = (state = initialState, action)=>{
  switch (action.type){
    case FETCH_DICTIONARY_START:
      state = {
        ...state,
        loading:true,
      };
      break;
    case FETCH_DICTIONARY_END:
      state = {
        ...state,
        loading: false,
        ...action.payload,
      };
      break;
      
    default:
      state = { ...state };
  
  }
  return state;
};
export default DocumentsReducer;