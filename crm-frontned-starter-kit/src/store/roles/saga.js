import {
  call, put, takeEvery
} from "redux-saga/effects";
// Login Redux States
import {
  FETCH_ROLES_START,
  ADD_ROLES_START,
  EDIT_ROLES_START,
  DELETE_ROLES_START,
  CHANGE_STATUS_ROLES_START
} from "./actionTypes";
import {
  fetchRolesSuccess, fetchRolesError, addRoleSuccess, addRoleError, addRoleClear, editRoleDone, editRoleClear, deleteRoleDone, changeStatusDone
} from "./actions";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

//Include Both Helper File with needed methods
import * as rolesApi from "../../apis/roles";


function * fetchRoles(params){
 
  try {
    const data = yield call(rolesApi.getRoles, params);    
    yield put(fetchRolesSuccess(data));
  }
  catch (error){
    yield put(fetchRolesError(error));
  } 

  
}

function * addRole(params){
  try {
    const data = yield call(rolesApi.addRole, params);
    
    
    const { result } = data;
    yield put(addRoleSuccess(result));
    yield put(showSuccessNotification("Role added successfully"));
    // yield delay(2000);
    yield put(addRoleClear());
  }
  catch (error){
    yield put(addRoleError(error));
    // yield delay(2000);
    // yield put(addRoleClear());
  } 

  
}

function * editRole(params){
  try {
    yield call(rolesApi.editRole, params);
    
    
    // const { result } = data;
    yield put(editRoleDone({
      result: params.payload.values,
      id: params.payload.id  
    }));
    yield put(showSuccessNotification("Role updated successfully"));

    // yield delay(2000);
    yield put(editRoleClear());
  }
  catch (error){
    yield put(editRoleDone({ error: error.message }));
    // yield delay(2000);
    // yield put(editRoleClear());
  } 

  
}

function * deleteRole(params) {
  try {
    const data = yield call(rolesApi.deleteRole, params);
    const { result } = data;
    yield put(deleteRoleDone({
      result,
      id: params.payload 
    }));
    yield put(showSuccessNotification("Role deleted successfully"));

  }
  catch (error){
    yield put(deleteRoleDone({ error: error.message }));
    yield put(showErrorNotification(error.message));

  } 

  
}

function * changeStatusRole(params) {
  try {
    const data = yield call(rolesApi.changeStatusRole, params);
    const { result } = data;
    yield put(changeStatusDone({
      result,
      id: params.payload.id,
      index: params.payload.index,

    }));
    yield put(showSuccessNotification("Role Status Changed successfully"));

  }
  catch (error){
    yield put(changeStatusDone({
      error: error.message,
      index: params.payload.index,
    }));
    yield put(showErrorNotification(error.message));

  } 

  
}

function* authSaga() {
  yield takeEvery(FETCH_ROLES_START, fetchRoles);
  yield takeEvery(ADD_ROLES_START, addRole);
  yield takeEvery(EDIT_ROLES_START, editRole);
  yield takeEvery(DELETE_ROLES_START, deleteRole);
  yield takeEvery(CHANGE_STATUS_ROLES_START, changeStatusRole);
}

export default authSaga;
