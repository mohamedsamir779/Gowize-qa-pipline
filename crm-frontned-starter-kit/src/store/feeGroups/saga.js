import { 
  takeEvery, 
  call, 
  put,
  delay
} from "redux-saga/effects";
import 
{
  fetchFeeGroups,
  addFeeGroup, 
  updateFeeGroup,
  deleteFeeGroup
} from "apis/fee-groups";
import { 
  FETCH_FEE_GROUPS_START,
  ADD_FEES_GROUPS_START,
  EDIT_FEE_GROUP_START,
  DELETE_FEE_GROUP_START
} from "./actionsType";
import { 
  fetchFeeGroupsSuccess,
  apiError,
  addFeeGroupSuccess,
  editFeeGroupSuccess,
  deleteFeeGroupSuccess,
  addModalClear,
  editModalClear,
  deleteModalClear
} from "./actions";
import { showSuccessNotification } from "store/notifications/actions";
function * getFeeGroups({ payload :{ params } }){
  try {
    const result = yield call(fetchFeeGroups, params);
    yield put(fetchFeeGroupsSuccess(result));
  } catch (error){
    yield put(apiError(error));
  }
}
function * addNewFeesGroup ({ payload }){
  
  try {
    const data = yield call(addFeeGroup, payload);
    const { status, result } = data;
    if (status === true){
      yield put(addFeeGroupSuccess(result));
      yield put(showSuccessNotification("Fee Group has been added successfully!"));
      yield delay(1000);
      yield put(addModalClear());
    }
  } catch (error){
    yield put(apiError(error));
    yield delay(2000);
    yield put(apiError(""));
  }
}
function * editFeeGroup({ payload }){
  try {
    yield call(updateFeeGroup, payload);
    const { body, id } = payload;
    yield put(editFeeGroupSuccess({
      _id:id, 
      ...body
    }));
    yield put(editModalClear());
    yield put(showSuccessNotification("Fee Group has been updated successfully!"));
  } catch (error){
    yield put(apiError(error));
    yield delay(2000);
    yield put(apiError(""));
  }
}
function * deleteFeegroup ({ payload : { id } }){
  try {
    yield call(deleteFeeGroup, id);
    yield put(deleteFeeGroupSuccess(id));
    yield put(showSuccessNotification("Fee Group has been deleted successfully!"));
    yield delay(1000);
    yield put(deleteModalClear());
  } catch (error){
    yield put(apiError(error));
    yield delay(1000);
    yield put(apiError(""));
  }
}
function * feeGroupSaga(){
  yield takeEvery(FETCH_FEE_GROUPS_START, getFeeGroups);
  yield takeEvery (ADD_FEES_GROUPS_START, addNewFeesGroup);
  yield takeEvery(EDIT_FEE_GROUP_START, editFeeGroup);
  yield takeEvery (DELETE_FEE_GROUP_START, deleteFeegroup);
}
export default feeGroupSaga;