import {
  takeEvery,
  call,
  put,
} from "redux-saga/effects";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";
import {
  fetchIbAgreements,
  fetchIbProducts,
  postMasterIb,
  patchMasterIb,
  postSharedIb,
  patchSharedIb,
  deleteIbAgreement
} from "apis/ib-agreements";
import {
  FETCH_IB_AGREEMENTS_START,
  FETCH_IB_PRODUCTS_START,
  ADD_MASTER_IB_AGREEMENT_START,
  UPDATE_MASTER_IB_AGREEMENT_START,
  ADD_SHARED_IB_AGREEMENT_START,
  UPDATE_SHARED_IB_AGREEMENT_START,
  DELETE_IB_AGREEMENT_START,
} from "./actionTypes";
import {
  fetchAgreementsSuccess,
  fetchProductsSuccess,
  createMasterIbAgreementSuccess,
  updateMasterIbAgreementSuccess,
  createSharedIbAgreementSuccess,
  apiError,
  deleteIbAgreementSuccess,
  updateSharedIbAgreementSuccess,
} from "./actions";

function* getIbAgreements({ payload }) {
  try {
    const { result } = yield call(fetchIbAgreements, payload);
    yield put(fetchAgreementsSuccess(result));
  } catch (error) {
    yield put(apiError(error));
  }
}

function* getIbProducts() {
  try {
    const { result } = yield call(fetchIbProducts);
    yield put(fetchProductsSuccess(result));
  } catch (error) {
    yield put(apiError(error));
  }
}

function* addMasterIbAgreement({ payload }) {
  try {
    const { result, message } = yield call(postMasterIb, payload);
    if (result) {
      yield put(createMasterIbAgreementSuccess(result));
      yield put(showSuccessNotification("Master IB agreement added successfully!"));
    } else {
      yield put(showErrorNotification(message));
    }
  } catch (error) {
    yield put(apiError(error.message));
  }
}

function* updateMasterIbAgreement({ payload }) {
  try {
    const { result, message } = yield call(patchMasterIb, payload);
    if (result) {
      yield put(updateMasterIbAgreementSuccess(result));
      yield put(showSuccessNotification("Master IB agreement edited successfully!"));
    } else {
      yield put(showErrorNotification(message));
    }
  } catch (error) {
    yield put(apiError(error.message));
  }
}

function* addSharedIbAgreement({ payload }) {
  try {
    const { result, message } = yield call(postSharedIb, payload);
    if (result) {
      yield put(createSharedIbAgreementSuccess(result));
      yield put(showSuccessNotification("Shared IB agreement added successfully!"));
    } else {
      yield put(showErrorNotification(message));
    }
  } catch (error) {
    yield put(apiError(error.message));
  }
}
function* updateSharedIbAgreement({ payload }) {
  try {
    const { result, message } = yield call(patchSharedIb, payload);
    if (result) {
      yield put(updateSharedIbAgreementSuccess(result));
      yield put(showSuccessNotification("Shared IB agreement edited successfully!"));
    } else {
      yield put(showErrorNotification(message));
    }
  } catch (error) {
    yield put(apiError(error.message));
  }
}

function * deleteAgreement({ payload }){
  try {
    yield call(deleteIbAgreement, payload);
    yield put(deleteIbAgreementSuccess(payload));
    yield put(showSuccessNotification("Agreement has been deleted successfully!"));
  } catch (error){
    yield put(showErrorNotification(error?.message ?? "Something went wrong"));
    yield put(apiError("An error happned during deleting the agreement"));
  }
}

function* IbAgreementSaga() {
  yield takeEvery(FETCH_IB_AGREEMENTS_START, getIbAgreements);
  yield takeEvery(FETCH_IB_PRODUCTS_START, getIbProducts);
  yield takeEvery(ADD_MASTER_IB_AGREEMENT_START, addMasterIbAgreement);
  yield takeEvery(UPDATE_MASTER_IB_AGREEMENT_START, updateMasterIbAgreement);
  yield takeEvery(ADD_SHARED_IB_AGREEMENT_START, addSharedIbAgreement);
  yield takeEvery(UPDATE_SHARED_IB_AGREEMENT_START, updateSharedIbAgreement);
  yield takeEvery(DELETE_IB_AGREEMENT_START, deleteAgreement);
}

export default IbAgreementSaga;