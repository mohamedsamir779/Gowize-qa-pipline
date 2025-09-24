import {
  call, delay, put, takeEvery, takeLatest
} from "redux-saga/effects";
import {
  getDictionary,
  addNewItem,
  removeItem,
  updateActions,
  updateCallStatus,
  updateCountries,
  updateExchange,
  updateMarkups,
  updateFxProducts as updateFxProductsApi,
} from "apis/dictionary";
import {
  fetchDictionarySuccess,
  fetchDictionaryFailed,
  apiError,
  addItemToActions,
  addItemToCountries,
  addItemToExchanges,
  removeItemFromActions,
  removeItemFromCountries,
  removeItemFromExchanges,
  updateActionSuccess,
  updateCallStatusSuccess,
  updateExchangeSuccess,
  updateCountrySuccess,
  editClear,
  addClear,
  clearDeleteModal,
  addItemToMarkups,
  updateMarkupSuccess,
  fetchDictionaryStart,
  removeItemFromMarkups,
  updateProductsSuccess,
  updateProductsFailed,
  addItemToCallStatus,
} from "./actions";
import {
  FETCH_DICTIONARY_START,
  ADD_NEW_ITEM,
  REMOVE_ITEM,
  UPDATE_ACTION_START,
  UPDATE_CALL_STATUS_START,
  UPDATE_EXCHANGE_START,
  UPDATE_COUNTRY_START,
  UPDATE_MARKUP_START,
  UPDATE_PRODUCTS_START,
} from "./actionsType";
import { showErrorNotification, showSuccessNotification } from "store/notifications/actions";

function* fetchDictionary() {
  try {
    const dictionary = yield call(getDictionary);
    const { result } = dictionary;
    yield put(fetchDictionarySuccess(result));
  } catch (error) {
    yield put(fetchDictionaryFailed(error));
    yield put(apiError("Error happend while getting dictionary"));
  }
}

function* addItem({ payload }) {
  try {
    const result = yield call(addNewItem, payload);
    const { status } = result;
    const { data } = payload;
    if (!status) {
      yield put(apiError(result.message));
      return;
    }
    const actionValue = Object.values(data);
    const key = Object.keys(data);
    if (status.code === 200) {
      if (key[0] === "actions") {
        yield put(addItemToActions(actionValue));
        yield put(showSuccessNotification("Action has been added successfully!"));
      }
      else if (key[0] === "exchanges") {
        yield put(addItemToExchanges(actionValue));
        yield put(showSuccessNotification("Exchange has been added successfully!"));
      }
      else if (key[0] === "callStatus") {
        yield put(addItemToCallStatus(actionValue));
        yield put(showSuccessNotification("Call Status has been added successfully!"));
      }
      else if (key[0] === "countries") {
        yield put(addItemToCountries(actionValue));
        yield put(showSuccessNotification("Country has been added successfully!"));
      } else if (key[0] === "markups") {
        yield put(addItemToMarkups(actionValue));
        yield put(showSuccessNotification("Markup has been added successfully!"));
      }
    }
    yield delay(1000);
    yield put(addClear());
  } catch (error) {
    yield put(apiError(error));
  }
}

function* updateAction({ payload }) {
  try {
    yield call(updateActions, payload);
    const { body, value } = payload;
    const { actions: oldValue } = body;
    yield put(updateActionSuccess(oldValue, value));
    yield put(showSuccessNotification("Action has been updated successfully!"));
    yield delay(1000);
    yield put(editClear());
  } catch (error) {
    yield put(apiError(error));
  }
}

function* updateMarkup({ payload }) {
  try {
    yield call(updateMarkups, payload);
    const { body, value } = payload;
    const { actions: oldValue } = body;
    yield put(updateMarkupSuccess(oldValue, value));
    yield put(fetchDictionaryStart());
    yield put(showSuccessNotification("Markups has been updated successfully!"));
    yield delay(1000);
    yield put(editClear());
  } catch (error) {
    yield put(apiError(error));
  }
}

function* updateCallStatusValue({ payload }) {
  try {
    yield call(updateCallStatus, payload);
    const { body, value: newValue } = payload;
    const { callStatus: oldValue } = body;
    yield put(updateCallStatusSuccess(oldValue, newValue));
    yield put(showSuccessNotification("Call Status has been updated successfully!"));
    yield delay(1000);
    yield put(editClear());
  } catch (error) {
    yield put(apiError(error));
  }
}

function* updateExchangeValue({ payload }) {
  try {
    yield call(updateExchange, payload);
    const { body, value: newValue } = payload;
    const { exchanges: oldValue } = body;
    yield put(updateExchangeSuccess(oldValue, newValue));
    yield put(showSuccessNotification("Exchange has been updated successfully!"));
    yield delay(1000);
    yield put(editClear());
  } catch (error) {
    yield put(apiError(error));
  }
}

function* removeItemFromDictionary({ payload }) {
  try {

    const result = yield call(removeItem, payload);
    const { status } = result;
    const { data } = payload;
    const actionValue = Object.values(data);
    const key = Object.keys(data);

    if (status.code === 200) {
      if (key[0] === "actions") {
        yield put(removeItemFromActions(actionValue));
        yield put(showSuccessNotification("Action has been deleted successfully!"));
      }
      else if (key[0] === "exchanges") {
        yield put(removeItemFromExchanges(actionValue));
        yield put(showSuccessNotification("Exchange has been deleted successfully!"));
      }
      else if (key[0] === "countries") {
        yield put(removeItemFromCountries(actionValue));
        yield put(showSuccessNotification("Country has been deleted successfully!"));
      } else if (key[0] === "markups") {
        yield put(removeItemFromMarkups(actionValue));
        yield put(showSuccessNotification("Markups has been deleted successfully!"));
      }
    }
    yield delay(1000);
    yield put(clearDeleteModal());
  } catch (error) {
    yield put(apiError(error));
  }
}

function* updateCountry({ payload }) {
  try {
    yield call(updateCountries, payload);
    const { body } = payload;
    const { countries } = body;
    const { value } = payload;
    yield put(updateCountrySuccess(countries._id, value));
    yield put(showSuccessNotification("Country has been updated successfully"));
    yield delay(1000);
    yield put(editClear());
  } catch (error) {
    yield put(apiError(error));
  }
}

function* updateFxProducts({ payload }) {
  try {
    const products = payload;
    yield call(updateFxProductsApi, { body: { products } });
    yield put(updateProductsSuccess(products));
    yield put(showSuccessNotification("Products has been updated successfully"));
    yield delay(1000);
    yield put(editClear());
  } catch (error) {
    yield put(updateProductsFailed(error));
    yield put(showErrorNotification(error));
    yield put(apiError(error));
  }
}

function* dictionarySaga() {
  yield takeEvery(FETCH_DICTIONARY_START, fetchDictionary);
  yield takeEvery(ADD_NEW_ITEM, addItem);
  yield takeEvery(REMOVE_ITEM, removeItemFromDictionary);
  yield takeEvery(UPDATE_ACTION_START, updateAction);
  yield takeLatest(UPDATE_MARKUP_START, updateMarkup);
  yield takeEvery(UPDATE_EXCHANGE_START, updateExchangeValue);
  yield takeEvery(UPDATE_CALL_STATUS_START, updateCallStatusValue);
  yield takeEvery(UPDATE_COUNTRY_START, updateCountry);
  yield takeEvery(UPDATE_PRODUCTS_START, updateFxProducts);
}
export default dictionarySaga;