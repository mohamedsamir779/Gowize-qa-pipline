import {
  call, put, takeEvery, delay
} from "redux-saga/effects";
import { 
  fetchAssetsSuccess, 
  apiError, 
  addNewSymbolSuccess,
  deleteSymbolDone,
  editSymbolSuccess,
  assetEditModalClear,
  addAssetModalClear
} from "./actions";
import { 
  getAssets, addNewSymbol, updateSymbol, deleteSymbol
} from "apis/assets";
import {
  FETCH_ASSETS_START, ADD_NEW_SYMBOL, EDIT_SYMBOL_START, DELETE_SYMBOL_START
} from "./actionsType";
import { showSuccessNotification } from "store/notifications/actions";
function * fetchAsset(params){
  try {
    const data = yield call(getAssets, params);
    yield put(fetchAssetsSuccess(data));
  } catch (error){
    yield put(apiError(error));
  }
  

}
function * addNewAsset({ payload :{ newSymbol } }){
  try {
    const data = yield call(addNewSymbol, newSymbol);
    const { status } = data;
    const { result } = data;
    
    if (status){
      yield put(addNewSymbolSuccess(result ));
      yield put(showSuccessNotification("Asset has been added successfully!"));
      yield delay(1000);
      yield put(addAssetModalClear());
    }
    
  } catch (error){
    
    yield put(apiError("Please Enter valid data"));
    yield delay(2000);
    yield put(apiError(""));
  }
 
}
function * editAsset(params){
  const { payload } = params;
  const { id,  jsonData } = payload;
  try {
    const returnedData = yield call(updateSymbol, payload);
    const { status } = returnedData;
 
    if (status){
      const { result } = returnedData;
      const { data } = result;
      const { image } = data;
      yield put(editSymbolSuccess({
        id,
        jsonData,
        image
      }));
    }
    
    yield put(showSuccessNotification("Asset has been updated successfully!"));
    yield delay(1000);
    yield put(assetEditModalClear());
  } catch (error){
    yield put(apiError("Please Enter Valid data"));
  }
  
}
function * deleteAsset(params){
  try {
    const data = yield call(deleteSymbol, params);

    const { result } = data;
    yield put(deleteSymbolDone({
      result,
      id:params.payload,
      
    }));
    yield  put(showSuccessNotification("Asset has been deleted successfully!"));
  } catch (error){
    yield put(apiError("An error happned during deleting this record"));
  }
  

}
function * assetSaga(){
  yield  takeEvery(FETCH_ASSETS_START, fetchAsset);
  yield  takeEvery(ADD_NEW_SYMBOL, addNewAsset);
  yield  takeEvery(EDIT_SYMBOL_START, editAsset);
  yield takeEvery(DELETE_SYMBOL_START, deleteAsset);
}
export default assetSaga;