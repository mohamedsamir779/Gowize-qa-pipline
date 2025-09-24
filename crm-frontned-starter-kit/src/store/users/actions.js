import {
  FETCH_USERS_START,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_ERROR,
  ADD_USERS_START,
  ADD_USERS_SUCCESS,
  ADD_USERS_ERROR,
  ADD_USER_CLEAR,

  FETCH_USERS_ROLES_START,
  FETCH_USERS_ROLES_SUCCESS,
  FETCH_USERS_ROLES_ERROR,

  EDIT_USERS_PASS_START,
  EDIT_USERS_START,
  EDIT_USERS_DONE,
  EDIT_USER_CLEAR,
  EDIT_USERS_ERROR,

  DELETE_USERS_START,
  DELETE_USERS_DONE,
  GET_ASSIGNED_USERS_START,
  GET_ASSIGNED_USERS_SUCCESS,
  ASSIGN_AGENT_START,
  ASSIGN_AGENT_COMPLETE,
  ASSIGN_AGENT_CLEAR,
  ASSIGN_AGENT_ERROR,
  GET_ASSIGNED_USERS_FAIL,
  USER_DISABLE_2FA_START,
  EDIT_TARGET_START,
  EDIT_TARGET_SUCCESS,
  EDIT_TARGET_FAIL,
} from "./actionTypes";

export const fetchUsers = (params = {}) => {
  return {
    type: FETCH_USERS_START,
    payload: params
  };
};

export const fetchUsersSuccess = (data) => {
  return {
    type: FETCH_USERS_SUCCESS,
    payload: data
  };
};
export const fetchUsersError = (error) => {
  return {
    type: FETCH_USERS_ERROR,
    payload: { error }
  };
};

export const fetchUsersRoles = (params = {}) => {
  return {
    type: FETCH_USERS_ROLES_START,
    payload: params
  };
};

export const fetchUsersRolesSuccess = (data) => {
  return {
    type: FETCH_USERS_ROLES_SUCCESS,
    payload: data
  };
};
export const fetchUsersRolesError = (error) => {
  return {
    type: FETCH_USERS_ROLES_ERROR,
    payload: { error }
  };
};

export const addUser = (params = {}) => {
  return {
    type: ADD_USERS_START,
    payload: params
  };
};
export const addUserSuccess = (data) => {
  return {
    type: ADD_USERS_SUCCESS,
    payload: data
  };
};
export const addUserError = (error) => {
  return {
    type: ADD_USERS_ERROR,
    payload: error && error.message || "",
  };
};
export const addUserClear = (data) => {
  return {
    type: ADD_USER_CLEAR,
    payload: data
  };
};

export const editUser = (params = {}) => {
  return {
    type: EDIT_USERS_START,
    payload: params
  };
};
export const editUserPass = (params = {}) => {
  return {
    type: EDIT_USERS_PASS_START,
    payload: params
  };
};
export const editUserDone = (data) => {
  return {
    type: EDIT_USERS_DONE,
    payload: data
  };
};
export const editUserError = (data) => {
  return {
    type: EDIT_USERS_ERROR,
    payload: data
  };
};
export const editUserClear = (data) => {
  return {
    type: EDIT_USER_CLEAR,
    payload: data
  };
};

export const deleteUsers = (params = {}) => {
  return {
    type: DELETE_USERS_START,
    payload: params
  };
};
export const deleteUserDone = (data) => {
  return {
    type: DELETE_USERS_DONE,
    payload: data
  };
};
export const getSalesAgentsStart = (params = {}) => {
  return {
    type: GET_ASSIGNED_USERS_START,
    payload: params
  };
};
export const getSalesAgentsSuccess = (data) => {
  return {
    type: GET_ASSIGNED_USERS_SUCCESS,
    payload: data
  };
};
export const getSalesAgentsFail = (data) => {
  return {
    type: GET_ASSIGNED_USERS_FAIL,
  };
};
export const assignAgentStart = (params = {}) => {
  return {
    type: ASSIGN_AGENT_START,
    payload: params
  };
};
export const assignAgentSuccess = (data) => {
  return {
    type: ASSIGN_AGENT_COMPLETE,
    payload: data
  };
};
export const assignAgentClear = (data) => {
  return {
    type: ASSIGN_AGENT_CLEAR,
    payload: data
  };
};
export const assignAgentError = (data) => {
  return {
    type: ASSIGN_AGENT_ERROR,
    payload: data
  };
};
export const disable2FA = (params) => {
  return {
    type: USER_DISABLE_2FA_START,
    payload: params
  };
};
export const editTargetStart = (params = {}) => {
  return {
    type: EDIT_TARGET_START,
    payload: params
  };
};
export const editTargetSuccess = (data) => {
  return {
    type: EDIT_TARGET_SUCCESS,
    payload: data
  };
};
export const editTargetFail = (data) => {
  return {
    type: EDIT_TARGET_FAIL,
    payload: data
  };
};
