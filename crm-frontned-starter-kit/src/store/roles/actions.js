import {
  FETCH_ROLES_START,
  FETCH_ROLES_SUCCESS,
  FETCH_ROLES_ERROR,
  ADD_ROLES_START,
  ADD_ROLES_SUCCESS,
  ADD_ROLES_ERROR,
  ADD_ROLE_CLEAR,

  EDIT_ROLES_START,
  EDIT_ROLES_DONE,
  EDIT_ROLE_CLEAR,

  DELETE_ROLES_START,
  DELETE_ROLES_DONE,

  CHANGE_STATUS_ROLES_START,
  CHANGE_STATUS_ROLES_END
} from "./actionTypes";

export const fetchRoles = (params = {})=>{
  return {
    type:FETCH_ROLES_START,
    payload: params
  };
};
export const fetchRolesSuccess = (data)=>{
  return {
    type:FETCH_ROLES_SUCCESS,
    payload: data
  };
};
export const fetchRolesError = (error)=>{
  return {
    type:FETCH_ROLES_ERROR,
    payload:{ error }
  };
};


export const addRole = (params = {})=>{
  return {
    type:ADD_ROLES_START,
    payload: params
  };
};
export const addRoleSuccess = (data)=>{
  return {
    type:ADD_ROLES_SUCCESS,
    payload: data
  };
};
export const addRoleError = (error)=>{
  return {
    type:ADD_ROLES_ERROR,
    payload: error && error.message || "",
  };
};
export const addRoleClear = (data)=>{
  return {
    type:ADD_ROLE_CLEAR,
    payload: data
  };
};

export const editRole = (params = {})=>{
  return {
    type:EDIT_ROLES_START,
    payload: params
  };
};
export const editRoleDone = (data)=>{
  return {
    type:EDIT_ROLES_DONE,
    payload: data
  };
};
export const editRoleClear = (data)=>{
  return {
    type:EDIT_ROLE_CLEAR,
    payload: data
  };
};

export const deleteRoles = (params = {})=>{
  return {
    type:DELETE_ROLES_START,
    payload: params
  };
};
export const deleteRoleDone = (data)=>{
  return {
    type:DELETE_ROLES_DONE,
    payload: data
  };
};
export const changeStatus = (id, status, index)=>{
  return {
    type: CHANGE_STATUS_ROLES_START,
    payload: {
      id, 
      status,
      index,
    },
  };
};

export const changeStatusDone = (params = {})=>{
  return {
    type:CHANGE_STATUS_ROLES_END,
    payload: params
  };
};