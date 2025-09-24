
import {
  UPLOAD_DOC_START,
  UPLOAD_DOC_END,
  GET_DOC_START,
  GET_DOC_END,
  UPLOADED_DOCS_CLEAR,
  CHANGESTATUS_DOC_START,
  CHANGESTATUS_DOC_END,
  CHANGE_DOCS_CLEAR,
  DELETE_DOC_START,
  DELETE_DOC_END,
  DELETE_CLEAR,
} from "./actionTypes";

const initialState = {
  uploading:false,
  loading:false,
  documents: [],
  clear: 0,
  clearChangeStatus: 0,
  clearDelete: 0
};
const DocumentsReducer = (state = initialState, action)=>{
  switch (action.type){
    case UPLOADED_DOCS_CLEAR:
      state = {
        ...state,
        clear: state.clear + 1,
      };
      break;
    case GET_DOC_START:
      state = {
        ...state,
        loading:true,
        documents: [],
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
        uploading: false
      };
      break;
    case CHANGE_DOCS_CLEAR:
      state = {
        ...state,
        clearChangeStatus: state.clearChangeStatus + 1,
      };
      break;
    case CHANGESTATUS_DOC_START:
      state = {
        ...state,
        changeStatusLoading: true,
      };
      break;
    case CHANGESTATUS_DOC_END:
      var documents = state.documents;      
      if (!action.error ) {
        documents = documents.map((obj, num) => {
          if (!action.error && num === action.payload.index) {
            obj.status = action.payload.status;
            if (action.payload.rejectionReason) {
              obj.rejectionReason = action.payload.rejectionReason;
            }
          }
          return obj;
        });
      }
      state = {
        ...state,
        changeStatusLoading: false,
        uploadError: action.error,
        documents,
      };
      break;
    
    case DELETE_CLEAR:
      state = {
        ...state,
        clearDelete: state.clearDelete + 1,
      };
      break;
    case DELETE_DOC_START:
      state = {
        ...state,
        docDeleting: true,
      };
      break;
    case DELETE_DOC_END:
      var docs = state.documents;      
      if (!action.error ) {
        docs = docs.filter((obj, index) => index !== action.payload.index);
      }
      state = {
        ...state,
        docDeleting: false,
        deleteError: action.error,
        documents: docs,
      };
      break;
    
    
    default:
      state = { ...state };

  }
  return state;
};
export default DocumentsReducer;