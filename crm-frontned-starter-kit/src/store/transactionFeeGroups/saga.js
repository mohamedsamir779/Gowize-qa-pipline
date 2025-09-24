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
} from "apis/transaction_fee_groups";
import { 
  FETCH_TRANSACTION_FEE_GROUPS_START,
  ADD_TRANSACTION_FEES_GROUPS_START,
  EDIT_TRANSACTION_FEE_GROUP_START,
  DELETE_TRANSACTION_FEE_GROUP_START
} from "./actionsType";
import { 
  fetchTransactionFeeGroupsSuccess,
  apiError,
  addTransactionFeeGroupSuccess,
  editTransactionFeeGroupSuccess,
  deleteTransactionFeeGroupSuccess,
  addModalClear,
  editModalClear,
  deleteModalClear
} from "./actions";
import { showSuccessNotification } from "store/notifications/actions";
function * getFeeGroups({ payload :{ params } }){
  try {
    const result = yield call(fetchFeeGroups, params);
    yield put(fetchTransactionFeeGroupsSuccess(result));
  } catch (error){
    yield put(apiError(error));
  }
}
function * addNewFeesGroup ({ payload }){
  
  try {
    const data = yield call(addFeeGroup, payload);
    const { status, result } = data;
    if (status === true){
      yield put(addTransactionFeeGroupSuccess(result));
      yield put(showSuccessNotification("Transaction Fee Group has been added successfully!"));
      yield delay(2000);
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
    yield put(editTransactionFeeGroupSuccess({
      _id:id, 
      ...body
    }));
    yield put(showSuccessNotification("Transaction Fee Group has been updated successfully!"));
    yield delay(2000);
    yield put(editModalClear());
  } catch (error){
    yield put(apiError(error));
    yield delay(2000);
    yield put(apiError(""));
  }
}
function * deleteFeegroup ({ payload : { id } }){
  try {
    yield call(deleteFeeGroup, id);
    yield put(deleteTransactionFeeGroupSuccess(id));
    yield put(showSuccessNotification("Transaction Fee Group has been deleted successfully!"));
    yield delay(1000);
    yield put(deleteModalClear());
  } catch (error){
    yield put(apiError(error));
    yield delay(1000);
    yield put(apiError(""));
  }
}
function * transactionFeeGroups(){
  yield takeEvery(FETCH_TRANSACTION_FEE_GROUPS_START, getFeeGroups);
  yield takeEvery (ADD_TRANSACTION_FEES_GROUPS_START, addNewFeesGroup);
  yield takeEvery(EDIT_TRANSACTION_FEE_GROUP_START, editFeeGroup);
  yield takeEvery (DELETE_TRANSACTION_FEE_GROUP_START, deleteFeegroup);
}
export default transactionFeeGroups;