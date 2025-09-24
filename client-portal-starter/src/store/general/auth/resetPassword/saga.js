import {
  takeEvery, call, put, all, fork,
} from "redux-saga/effects";
import { resetpassword } from "apis/resetPassword";
import { showErrorNotification, showSuccessNotification } from "store/general/notifications/actions";
import { CHANGE_PASSWORD_START, RESET_PASSWORD_START } from "./actionsType";
import { resetPasswordError, resetPasswordSuccess } from "./actions";
import { changePasswordWithOldPassword } from "apis/auth";

function * resetClientPassword ({ payload }){
  try {
    const data = yield call(resetpassword, payload);
    const { status, message  } = data;
    if (status){
      yield put(resetPasswordSuccess());
      yield put(showSuccessNotification("Password Changed Successfully"));
    } else {
      yield put(resetPasswordError({
        message,
      }));
      // yield call(showErrorNotification(message));
    }
  } catch (error){
    yield put(showErrorNotification("Error happened while reseting password"));
  }
}

function* changePassword({ payload }){
  try {
    const data = yield call(changePasswordWithOldPassword, payload);
    const { status, message  } = data;
    if (status){
      yield put(resetPasswordSuccess());
      yield put(showSuccessNotification("Password Changed Successfully"));
    } else {
      yield put(showErrorNotification(`Error: ${message}`));
    }
  } catch (error){
    yield put(showErrorNotification(error.message || "Error happened while changing password"));
  }
}


function * WatchResetPassword(){
  yield takeEvery(RESET_PASSWORD_START, resetClientPassword);
  yield takeEvery(CHANGE_PASSWORD_START, changePassword);
}

function* resetPasswordSaga() {
  yield all([fork(WatchResetPassword)]);
}


export default resetPasswordSaga;