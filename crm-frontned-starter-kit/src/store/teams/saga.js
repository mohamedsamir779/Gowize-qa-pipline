import {
  call, put, takeEvery, delay
} from "redux-saga/effects";
// Login Redux States
import {
  FETCH_TEAMS_START,
  ADD_TEAMS_START,
  FETCH_MANAGERS_TEAMS_START,
  FETCH_MEMBERS_TEAMS_START,
  EDIT_TEAMS_START,
  EDIT_TEAMS_MEMBERS_START,
  DELETE_TEAMS_START,
} from "./actionTypes";

import {
  fetchTeamsSuccess,
  fetchTeamsError,
  fetchManagersSuccess,
  fetchManagersError,
  fetchMembersSuccess,
  fetchMembersError,
  addTeamSuccess,
  addTeamError,
  addTeamClear,
  editTeamDone,
  editTeamError,
  editTeamClear,
  editTeamMembersDone,
  editTeamMembersError,
  editTeamMembersClear,
  deleteTeamDone
} from "./actions";

//Include Both Helper File with needed methods
import * as teamsApi from "../../apis/teams";
import { showSuccessNotification } from "store/notifications/actions";

function* fetchTeams(params) {
  try {
    const data = yield call(teamsApi.getTeams, params);
    yield put(fetchTeamsSuccess(data));
  }
  catch (error) {
    yield put(fetchTeamsError(error));
  }
}

function* addTeam(params) {
  try {
    const data = yield call(teamsApi.addTeam, params);
    const { result } = data;
    yield put(addTeamSuccess(result));
    yield put(showSuccessNotification("Team added successfully!"));
    yield put(addTeamClear());
  }
  catch (error) {
    yield put(addTeamError(error));
    yield delay(2000);
    yield put(addTeamClear());
  }
}

function* fetchManagers(params) {
  try {
    const data = yield call(teamsApi.getManagers, params); 
    yield put(fetchManagersSuccess(data));
  }
  catch (error) {
    yield put(fetchManagersError(error));
  }
}

function* fetchMembers(params) {
  try {
    const data = yield call(teamsApi.getMembers, params); 
    yield put(fetchMembersSuccess(data));
  }
  catch (error) {
    yield put(fetchMembersError(error));
  }
}

function* editTeam(params) {
  try {
    const data = yield call(teamsApi.editTeam, params);
    const { result } = data;
    yield put(editTeamDone({
      result,
      id: params.payload.id
    }));
    yield put(showSuccessNotification("Team editted successfully!"));
    yield put(editTeamClear());
  }
  catch (error) {
    yield put(editTeamError({ error: error.message }));
    yield delay(2000);
    yield put(editTeamClear());
  }
}

function* editTeamMembers(params) { 
  try {
    const data = yield call(teamsApi.editTeamMembers, params);
    const { result } = data;
    yield put(editTeamMembersDone({
      result,
      id: params.payload.id
    }));
    yield delay(2000);
    yield put(editTeamMembersClear());
  }
  catch (error) {
    yield put(editTeamMembersError({ error: error.message }));
    yield delay(2000);
    yield put(editTeamClear());
  }
}

function* deleteTeam(params) {
  try {
    const data = yield call(teamsApi.deleteTeam, params);
    const { result } = data;
    yield put(deleteTeamDone({
      result,
      id: params.payload
    }));
  }
  catch (error) {
    yield put(deleteTeamDone({ error: error.message }));
  }
}

function* teamsSaga() {
  yield takeEvery(FETCH_TEAMS_START, fetchTeams);
  yield takeEvery(FETCH_MANAGERS_TEAMS_START, fetchManagers);
  yield takeEvery(FETCH_MEMBERS_TEAMS_START, fetchMembers);
  yield takeEvery(ADD_TEAMS_START, addTeam);
  yield takeEvery(EDIT_TEAMS_START, editTeam);
  yield takeEvery(EDIT_TEAMS_MEMBERS_START, editTeamMembers);
  yield takeEvery(DELETE_TEAMS_START, deleteTeam);
}

export default teamsSaga;
