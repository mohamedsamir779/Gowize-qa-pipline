import {
  UPLOAD_DOC_START,
  UPLOAD_DOC_END,
  UPLOADED_DOCS_CLEAR,
  GET_DOC_START,
  GET_DOC_END
} from "./actionTypes";
  
const initialState = {
  uploading:false,
  loading:false,
  documents: [],
  uploadClear: 0,
  clearChangeStatus: 0,
  clearDelete: 0
};
const DocumentsReducer = (state = initialState, action)=>{
  switch (action.type){
    case GET_DOC_START:
      state = {
        ...state,
        loading:true
      };
      break;
    case GET_DOC_END:
      state = {
        ...state,
        error: action.payload.error,
        documents: action.payload.result,
        loading: false
      };
      break;

    case UPLOAD_DOC_START:
      state = {
        ...state,
        uploading:true,
      };
      break;
    case UPLOAD_DOC_END:
      state = {
        ...state,
        uploadError: action.payload.error,
        uploadSuccessMessage: action.payload.message,
        uploading: false
      };
      break;
    case UPLOADED_DOCS_CLEAR:
      state = {
        ...state,
        uploadClear: state.uploadClear + 1,
        uploadError: false,
        uploadSuccessMessage: false
      };
      break;
      
    default:
      state = { ...state };
  
  }
  return state;
};
export default DocumentsReducer;