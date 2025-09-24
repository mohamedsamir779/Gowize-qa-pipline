import {
  UPLOAD_DOC_START,
  UPLOAD_DOC_END,
  GET_DOC_START,
  GET_DOC_END,
  UPLOADED_DOCS_CLEAR,
  CHANGE_DOCS_CLEAR,
  CHANGESTATUS_DOC_START,
  CHANGESTATUS_DOC_END,
  DELETE_DOC_START,
  DELETE_DOC_END,
  DELETE_CLEAR
} from "./actionTypes";

export const fetchDocsStart = (clientId)=>{
  return {
    type:GET_DOC_START,
    payload: clientId
  };
};
export const fetchDocsSuccess = (data)=>{
  return {
    type:GET_DOC_END,
    payload: data
  };
};
export const fetchDocsFail = (error)=>{
  return {
    type:GET_DOC_END,
    payload:{ error }
  };
};

export const uploadDocsStart = (clientId)=>{
  return {
    type:UPLOAD_DOC_START,
    payload: clientId
  };
};
export const uploadDocsSuccess = (data)=>{
  return {
    type:UPLOAD_DOC_END,
    payload: data
  };
};
export const uploadDocsFail = (error)=>{
  return {
    type:UPLOAD_DOC_END,
    payload:{ error }
  };
};

export const uploadDocsClear = ()=>{
  return {
    type: UPLOADED_DOCS_CLEAR,
    payload:{ }
  };
};
export const changeStatusClear = ()=>{
  return {
    type: CHANGE_DOCS_CLEAR,
    payload:{ }
  };
};

export const changeStatusDocStart = (params)=>{
  return {
    type:CHANGESTATUS_DOC_START,
    payload: params
  };
};
export const changeStatusDocSuccess = (params)=>{
  return {
    type:CHANGESTATUS_DOC_END,
    payload: params
  };
};
export const changeStatusDocFail = (params)=>{
  return {
    type:CHANGESTATUS_DOC_END,
    error: params.error
  };
};

export const deleteDocStart = (params)=>{
  return {
    type:DELETE_DOC_START,
    payload: params
  };
};
export const deleteDocSuccess = (params)=>{
  return {
    type:DELETE_DOC_END,
    payload: params
  };
};
export const deleteDocFail = (params)=>{
  return {
    type:DELETE_DOC_END,
    error: params.error
  };
};

export const deleteClear = ()=>{
  return {
    type: DELETE_CLEAR,
    payload:{ }
  };
};