import {
  FETCH_TEAMS_START,
  FETCH_TEAMS_SUCCESS,
  FETCH_TEAMS_ERROR,
  ADD_TEAMS_START,
  ADD_TEAMS_SUCCESS,
  ADD_TEAMS_ERROR,
  ADD_TEAMS_CLEAR,

  FETCH_MANAGERS_TEAMS_START,
  FETCH_MANAGERS_TEAMS_SUCCESS,
  FETCH_MANAGERS_TEAMS_ERROR,

  FETCH_MEMBERS_TEAMS_START,
  FETCH_MEMBERS_TEAMS_SUCCESS,
  FETCH_MEMBERS_TEAMS_ERROR,

  EDIT_TEAMS_MEMBERS_START,
  EDIT_TEAMS_MEMBERS_DONE,
  EDIT_TEAMS_MEMBERS_ERROR,
  // EDIT_TEAMS_MEMBERS_CLEAR,

  EDIT_TEAMS_START,
  EDIT_TEAMS_DONE,
  EDIT_TEAMS_ERROR,
  EDIT_TEAMS_CLEAR,

  DELETE_TEAMS_START,
  DELETE_TEAMS_DONE,
} from "./actionTypes";

export const fetchTeams = (params = {}) => {
  return {
    type: FETCH_TEAMS_START,
    payload: params
  };
};
export const fetchTeamsSuccess = (data) => {
  return {
    type: FETCH_TEAMS_SUCCESS,
    payload: data
  };
};
export const fetchTeamsError = (error) => {
  return {
    type: FETCH_TEAMS_ERROR,
    payload: { error }
  };
};

export const fetchManagers = (params = {}) => {
  return {
    type: FETCH_MANAGERS_TEAMS_START,
    payload: params
  };
};

export const fetchManagersSuccess = (data) => {
  return {
    type: FETCH_MANAGERS_TEAMS_SUCCESS,
    payload: data
  };
};
export const fetchManagersError = (error) => {
  return {
    type: FETCH_MANAGERS_TEAMS_ERROR,
    payload: { error }
  };
};
export const fetchMembers = (params = {}) => {
  return {
    type: FETCH_MEMBERS_TEAMS_START,
    payload: params
  };
};

export const fetchMembersSuccess = (data) => {
  return {
    type: FETCH_MEMBERS_TEAMS_SUCCESS,
    payload: data
  };
};
export const fetchMembersError = (error) => {
  return {
    type: FETCH_MEMBERS_TEAMS_ERROR,
    payload: { error }
  };
};


export const addTeam = (params = {}) => {
  return {
    type: ADD_TEAMS_START,
    payload: params
  };
};
export const addTeamSuccess = (data) => {
  return {
    type: ADD_TEAMS_SUCCESS,
    payload: data
  };
};
export const addTeamError = (error) => {
  return {
    type: ADD_TEAMS_ERROR,
    payload: error && error.message || "",
  };
};
export const addTeamClear = (data) => {
  return {
    type: ADD_TEAMS_CLEAR,
    payload: data
  };
};


export const editTeam = (params = {}) => {
  return {
    type: EDIT_TEAMS_START,
    payload: params
  };
};
export const editTeamDone = (data) => {
  return {
    type: EDIT_TEAMS_DONE,
    payload: data
  };
};
export const editTeamError = (data) => {
  return {
    type: EDIT_TEAMS_ERROR,
    payload: data
  };
};
export const editTeamClear = (data) => {
  return {
    type: EDIT_TEAMS_CLEAR,
    payload: data
  };
};

export const editTeamMembers = (params = {}) => {
  return {
    type: EDIT_TEAMS_MEMBERS_START,
    payload: params
  };
};
export const editTeamMembersDone = (data) => {
  return {
    type: EDIT_TEAMS_MEMBERS_DONE,
    payload: data
  };
};
export const editTeamMembersError = (data) => {
  return {
    type: EDIT_TEAMS_MEMBERS_ERROR,
    payload: data
  };
};
export const editTeamMembersClear = (data) => {
  return {
    type: EDIT_TEAMS_CLEAR,
    payload: data
  };
};

export const deleteTeam = (params = {}) => {
  return {
    type: DELETE_TEAMS_START,
    payload: params
  };
};
export const deleteTeamDone = (data) => {
  return {
    type: DELETE_TEAMS_DONE,
    payload: data
  };
};
