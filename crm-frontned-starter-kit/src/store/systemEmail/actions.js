import {
  FETCH_SYSTEM_EMAILS_REQUESTED,
  FETCH_SYSTEM_EMAILS_SUCCESS,
  FETCH_SYSTEM_EMAILS_FAIL,

  FETCH_SYSTEM_EMAIL_BY_ID_REQUESTED,
  FETCH_SYSTEM_EMAIL_BY_ID_SUCCESS,
  FETCH_SYSTEM_EMAIL_BY_ID_FAIL,
  FETCH_SYSTEM_EMAIL_BY_ID_CLEAR,

  ADD_SYSTEM_EMAIL_REQUESTED,
  ADD_SYSTEM_EMAIL_SUCCESS,
  ADD_SYSTEM_EMAIL_FAIL,
  ADD_SYSTEM_EMAIL_CLEAR,

  DELETE_SYSTEM_EMAIL_REQUESTED,
  DELETE_SYSTEM_EMAIL_SUCCESS,
  DELETE_SYSTEM_EMAIL_FAIL,

  EDIT_SYSTEM_EMAIL_REQUESTED,
  EDIT_SYSTEM_EMAIL_SUCCESS,
  EDIT_SYSTEM_EMAIL_FAIL,
  EDIT_SYSTEM_EMAIL_CLEAR,

  EDIT_SYSTEM_EMAIL_CONTENT_REQUESTED,
  EDIT_SYSTEM_EMAIL_CONTENT_SUCCESS,
  EDIT_SYSTEM_EMAIL_CONTENT_FAIL,
  EDIT_SYSTEM_EMAIL_CONTENT_CLEAR,

  FETCH_SYSTEM_EMAIL_HTML_REQUESTED,
  FETCH_SYSTEM_EMAIL_HTML_SUCCESS,
  FETCH_SYSTEM_EMAIL_HTML_FAIL,

  CHANGE_SYSTEM_EMAIL_STATUS_REQUESTED,
  CHANGE_SYSTEM_EMAIL_STATUS_DONE
} from "./actionTypes";

// fetch
export const fetchSystemEmails = (params = {}) => {
  return {
    type: FETCH_SYSTEM_EMAILS_REQUESTED,
    payload: params 
  };
};
export const fetchSystemEmailsSuccess = (data) => {
  return {
    type: FETCH_SYSTEM_EMAILS_SUCCESS,
    payload: data
  };
};
export const fetchSystemEmailsFail = (error) => {
  return {
    type: FETCH_SYSTEM_EMAILS_FAIL,
    payload: { error }
  };
};

// fetch by id
export const fetchSystemEmailById = (params = {}) => {
  return {
    type: FETCH_SYSTEM_EMAIL_BY_ID_REQUESTED,
    payload: params
  };
};
export const fetchSystemEmailByIdSuccess = (data) => {
  return {
    type: FETCH_SYSTEM_EMAIL_BY_ID_SUCCESS,
    payload: data
  };
};
export const fetchSystemEmailByIdFail = (error) => {
  return {
    type: FETCH_SYSTEM_EMAIL_BY_ID_FAIL,
    payload: { error }
  };
};
export const fetchSystemEmailByIdClear = (data) => {
  return {
    type: FETCH_SYSTEM_EMAIL_BY_ID_CLEAR,
    payload: data
  };
};

// add
export const addSystemEmail = (params = {}) => {
  return {
    type: ADD_SYSTEM_EMAIL_REQUESTED,
    payload: params
  };
};
export const addSystemEmailSuccess = (data) => {
  return {
    type: ADD_SYSTEM_EMAIL_SUCCESS,
    payload: data
  };
};
export const addSystemEmailFail = (error) => {
  return {
    type: ADD_SYSTEM_EMAIL_FAIL,
    payload: { error }
  };
};
export const addSystemEmailClear = (data) => {
  return {
    type:ADD_SYSTEM_EMAIL_CLEAR,
    payload: data
  };
};

// delete
export const deleteSystemEmail = (params = {}) => {
  return {
    type: DELETE_SYSTEM_EMAIL_REQUESTED,
    payload: params
  };
};
export const deleteSystemEmailSuccess = (data) => {
  return {
    type: DELETE_SYSTEM_EMAIL_SUCCESS,
    payload: data
  };
};
export const deleteSystemEmailFail = (error) => {
  return {
    type: DELETE_SYSTEM_EMAIL_FAIL,
    payload: { error }
  };
};

// edit
export const editSystemEmail = (params = {}) => {
  return {
    type: EDIT_SYSTEM_EMAIL_REQUESTED,
    payload: params
  };
};
export const editSystemEmailSuccess = (data) => {
  return {
    type: EDIT_SYSTEM_EMAIL_SUCCESS,
    payload: data
  };
};
export const editSystemEmailFail = (error) => {
  return {
    type: EDIT_SYSTEM_EMAIL_FAIL,
    payload: { error }
  };
};
export const editSystemEmailClear = (data) => {
  return {
    type: EDIT_SYSTEM_EMAIL_CLEAR,
    payload: data
  };
};

// edit content
export const editSystemEmailContent = (params = {}) => {
  return {
    type: EDIT_SYSTEM_EMAIL_CONTENT_REQUESTED,
    payload: params
  };
};
export const editSystemEmailContentSuccess = (data) => {
  return {
    type: EDIT_SYSTEM_EMAIL_CONTENT_SUCCESS,
    payload: data
  };
};
export const editSystemEmailContentFail = (error) => {
  return {
    type: EDIT_SYSTEM_EMAIL_CONTENT_FAIL,
    payload: { error }
  };
};
export const editSystemEmailContentClear = (data) => {
  return {
    type: EDIT_SYSTEM_EMAIL_CONTENT_CLEAR,
    payload: data
  };
};

// fetch system email HTML
export const fetchSystemEmailHTML = (params = {}) => {
  return {
    type: FETCH_SYSTEM_EMAIL_HTML_REQUESTED,
    payload: params
  };
};
export const fetchSystemEmailHTMLSuccess = (data) => {
  return {
    type: FETCH_SYSTEM_EMAIL_HTML_SUCCESS,
    payload: data
  };
};
export const fetchSystemEmailHTMLFail = (error) => {
  return {
    type: FETCH_SYSTEM_EMAIL_HTML_FAIL,
    payload: { error }
  };
};

// change system email status
export const changeSystemEmailStatus = (id, index, status) => {
  return {
    type: CHANGE_SYSTEM_EMAIL_STATUS_REQUESTED,
    payload: {
      id,
      status,
      index
    }
  };
};
export const changeSystemEmailStatusDone = (params = {}) => {
  return {
    type: CHANGE_SYSTEM_EMAIL_STATUS_DONE,
    payload: params
  };
};
