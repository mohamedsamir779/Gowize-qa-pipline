import {
  takeEvery, fork, put, all, call, takeLatest
} from "redux-saga/effects";
import {
  fetchProfileAPI,
  editProfileAPI,
  submitProfileAPI,
  convertProfileAPI,
  uploadPorfileAvatarAPI,
  editProfileSettingsAPI
} from "../../../../apis/profile";
// Login Redux States
import {
  EDIT_PROFILE,
  FETCH_PROFILE_START,
  SUBMIT_IND_PROFILE_START,

  CONVERT_PROFILE_REQUESTED,
  UPLOAD_PROFILE_AVATAR_START,
  DELETE_PROFILE_AVATAR_START,
  UPDATE_PROFILE_SETTINGS
} from "./actionTypes";
import {
  profileSuccess,
  profileError,
  editProfileSuccess,
  submitIndProfileDone,

  convertProfileSuccess,
  convertProfileFail,
  uploadProfileAvatarEnd,
  deleteAvatarImageEnd,
  updateProfileSettingsSuccess,
  updateProfileSettingsFail
} from "./actions";
import { showErrorNotification, showSuccessNotification } from "../../notifications/actions";
import { logoutUser } from "../login/actions";
import { CUSTOMER_SUB_PORTALS } from "common/constants";
import { switchSubPortal } from "store/actions";

function* editProfile({ payload: { user } }) {
  try {
    const result = yield call(editProfileAPI, user);
    yield put(editProfileSuccess(result));
  } catch (error) {
    yield put(profileError(error.message));
  }
}

function* fetchProfile({ payload }) {
  try {
    const data = yield call(fetchProfileAPI);
    if (data.fx.isIb && !data.fx.isClient) yield put(switchSubPortal(CUSTOMER_SUB_PORTALS.IB));
    yield put(profileSuccess(data));
  }
  catch (error) {
    yield put(profileError(error.message));
    yield put(logoutUser(payload.history));
  }
}

function* submmitIndProfile({ payload }) {
  try {

    const data = yield call(submitProfileAPI, payload);
    yield put(submitIndProfileDone({ stages: data }));
    yield put(showSuccessNotification("Profile completed successfully"));
  }
  catch (error) {
    yield put(submitIndProfileDone({
      error: error.message
    }));
  }
}

function* convertProfile() {
  try {
    const data = yield call(convertProfileAPI);
    yield put(convertProfileSuccess(data));
    yield put(showSuccessNotification("Profile converted successfully, Please log in again"));
  } catch (error) {
    yield put(convertProfileFail({ error: error.message }));
    yield put(showErrorNotification(error.message));
  }
}

function* uploadProfileImage({ payload, callback }) {
  try {
    const imageFile = payload;
    const formData = new FormData();
    formData.append("type", "ProfileImage");
    formData.append("images", imageFile);

    const data = yield call(uploadPorfileAvatarAPI, formData);
    yield put(uploadProfileAvatarEnd({ success: data }));
    yield put(showSuccessNotification("Profile avatar uploaded successfully"));
    if (callback) {
      callback();
    }
  } catch (error) {
    yield put(uploadProfileAvatarEnd({ error: error.message }));
    yield put(showErrorNotification(error.message));
  }
}

function* deleteAvatarImage({ callback }) {
  try {
    const data = yield call(uploadPorfileAvatarAPI, { avatarImage: "" });
    yield put(deleteAvatarImageEnd({ success: data }));
    yield put(showSuccessNotification("Profile avatar deleted successfully"));
    if (callback) {
      callback();
    }
  } catch (error) {
    yield put(deleteAvatarImageEnd({ error: error.message }));
    yield put(showErrorNotification(error.message));
  }
}

function* updateProfileSettings({ payload }) {
  try {
    const data = yield call(editProfileSettingsAPI, payload);
    console.log("testing", data);
    console.log("testing", payload);
    yield put(updateProfileSettingsSuccess(payload));
    yield put(showSuccessNotification("Profile settings updated successfully"));
  } catch (error) {
    yield put(updateProfileSettingsFail({ error: error.message }));
    yield put(showErrorNotification(error.message));
  }
}

export function* watchProfile() {
  yield takeEvery(EDIT_PROFILE, editProfile);
  yield takeEvery(FETCH_PROFILE_START, fetchProfile);
  yield takeEvery(SUBMIT_IND_PROFILE_START, submmitIndProfile);
  yield takeEvery(CONVERT_PROFILE_REQUESTED, convertProfile);
  yield takeLatest(UPLOAD_PROFILE_AVATAR_START, uploadProfileImage);
  yield takeLatest(DELETE_PROFILE_AVATAR_START, deleteAvatarImage);
  yield takeLatest(UPDATE_PROFILE_SETTINGS, updateProfileSettings);
}

function* ProfileSaga() {
  yield all([fork(watchProfile)]);
}

export default ProfileSaga;
