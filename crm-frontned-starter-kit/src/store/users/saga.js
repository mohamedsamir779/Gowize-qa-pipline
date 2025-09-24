import {
  call, put, takeEvery, delay, takeLatest
} from "redux-saga/effects";
// Login Redux States
import {
  FETCH_USERS_START,
  FETCH_USERS_ROLES_START,
  ADD_USERS_START,
  EDIT_USERS_PASS_START,
  EDIT_USERS_START,
  DELETE_USERS_START,
  GET_ASSIGNED_USERS_START,
  ASSIGN_AGENT_START,
  USER_DISABLE_2FA_SUCCESS,
  USER_DISABLE_2FA_FAIL,
  USER_DISABLE_2FA_START,
  EDIT_TARGET_START
} from "./actionTypes";
import {
  fetchUsersSuccess,
  fetchUsersRolesSuccess,
  fetchUsersRolesError,
  fetchUsersError,
  addUserSuccess,
  addUserError,
  addUserClear,
  editUserDone,
  editUserError,
  editUserClear,
  deleteUserDone,
  getSalesAgentsSuccess,
  assignAgentSuccess,
  assignAgentError,
  assignAgentClear,
  getSalesAgentsFail,
  editTargetSuccess,
  editTargetFail,
} from "./actions";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

//Include Both Helper File with needed methods

import * as usersApi from "../../apis/users";

function* fetchUsers(params) {

  try {
    const data = yield call(usersApi.getUsers, params);
    yield put(fetchUsersSuccess(data));
  }
  catch (error) {
    yield put(fetchUsersError(error));
  }

}
function* fetchRoles(params) {

  try {
    const data = yield call(usersApi.getRoles, params);
    // console.log("data");  
    // console.log(data);  
    yield put(fetchUsersRolesSuccess(data));
  }
  catch (error) {
    yield put(fetchUsersRolesError(error));
  }

}
function* addUser(params) {
  try {
    const data = yield call(usersApi.addUser, params);
    const { result } = data;
    yield put(addUserSuccess(result));
    yield put(showSuccessNotification("User added successfully"));
    yield put(addUserClear());
  }
  catch (error) {
    yield put(addUserError(error));
    yield delay(2000);
    yield put(addUserClear());
  }


}

function* editUser(params) {
  try {
    const data = yield call(usersApi.editUser, params);
    const { result } = data;
    yield put(editUserDone({
      result,
      id: params.payload.id
    }));
    yield put(showSuccessNotification("User updated successfully"));
    yield put(editUserClear());
  }
  catch (error) {
    yield put(editUserError({ error: error.message }));
    yield delay(2000);
    yield put(editUserClear());
  }
}
function* editUserPass(params) {
  try {
    const data = yield call(usersApi.editUserPass, params);
    const { result } = data;
    yield put(editUserDone({
      result,
      id: params.payload.id
    }));
    yield delay(2000);
    yield put(editUserClear());
  }
  catch (error) {
    yield put(editUserError({ error: error.message }));
    yield delay(2000);
    yield put(editUserClear());
  }
}
function* deleteUser(params) {
  try {
    const data = yield call(usersApi.deleteUser, params);
    const { result } = data;
    yield put(deleteUserDone({
      result,
      id: params.payload
    }));
    yield put(showSuccessNotification("User deleted successfully"));
  }
  catch (error) {
    yield put(deleteUserDone({ error: error.message }));
  }


}
function * fetchSalesAgent(params){
  try {
    const data = yield call(usersApi.getAssignedUsers, params);
    const { result } = data || {};
    yield put(getSalesAgentsSuccess(result));
  } catch (error){
    yield put(getSalesAgentsFail());
    yield put(showErrorNotification("Error happened while fetching agents"));
  }
}
function * assignAgent(params){
  try {
    const data = yield call(usersApi.assignSalesAgent, params);
    const { status } = data;
    if (status){
      yield put(assignAgentSuccess(data));
      yield put(assignAgentClear());
      yield put(showSuccessNotification("Agent has been assigned to the client successfully"));
    }
  } catch (error){
    yield put(assignAgentError());
    yield put(showErrorNotification("Error happened while assigning agent to clients"));
  }
}

function * disable2FA({ payload }) {
  try {
    const res = yield call(usersApi.disable2FA, payload);
    if (res) {
      yield put({
        type: USER_DISABLE_2FA_SUCCESS,
      });
      yield put(showSuccessNotification("Two factor authentication disabled successfully"));
    }
  } catch (error) {
    yield put({
      type: USER_DISABLE_2FA_FAIL,
    });
    yield put(showErrorNotification(error.message));
  }
}

function * editTarget({ payload }) {
  try {
    const res = yield call(usersApi.editTarget, payload);
    if (res) {
      yield put(editTargetSuccess(res));
      yield put(showSuccessNotification("Target changed successfully"));
    }
  } catch (error) {
    yield put(editTargetFail(error.message));
    yield put(showErrorNotification(error.message));
  }
}

function* usersSaga() {
  yield takeEvery(FETCH_USERS_START, fetchUsers);
  yield takeEvery(FETCH_USERS_ROLES_START, fetchRoles);
  yield takeEvery(ADD_USERS_START, addUser);
  yield takeEvery(EDIT_USERS_START, editUser);
  yield takeEvery(EDIT_USERS_PASS_START, editUserPass);
  yield takeEvery(DELETE_USERS_START, deleteUser);
  yield takeLatest(GET_ASSIGNED_USERS_START, fetchSalesAgent);
  yield takeEvery(ASSIGN_AGENT_START, assignAgent);
  yield takeEvery(USER_DISABLE_2FA_START, disable2FA);
  yield takeEvery(EDIT_TARGET_START, editTarget);
}

export default usersSaga;
