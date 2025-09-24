import {

  FETCH_DICTIONARY_START,
  FETCH_DICTIONARY_SUCCESS,
  FETCH_DICTIONARY_FAILED,
  API_ERROR,
  ADD_NEW_ITEM,
  REMOVE_ITEM,
  ADD_ITEM_TO_ACTIONS,
  ADD_ITEM_TO_CALL_STATUS,
  ADD_ITEM_TO_COUNTRIES,
  ADD_ITEM_TO_EXCHANGES,
  REMOVE_ITEM_FROM_ACTIONS,
  REMOVE_ITEM_FROM_EXCHANGES,
  REMOVE_ITEM_FROM_COUNTRIES,
  UPDATE_CALL_STATUS_START,
  UPDATE_ACTION_START,
  UPDATE_COUNTRY_START,
  UPDATE_EXCHANGE_START,
  UPDATE_ACTION_SUCCESS,
  UPDATE_EXCHANGE_SUCCESS,
  UPDATE_CALL_STATUS_SUCCESS,
  UPDATE_COUNTRY_SUCCESS,
  EDIT_CLEAR,
  ADD_CLEAR,
  CLEAR_DELETE_MODAL,
  ADD_ITEM_TO_MARKUPS,
  UPDATE_MARKUP_START,
  UPDATE_MARKUP_SUCCESS,
  REMOVE_ITEM_FROM_MARKUP,
  UPDATE_PRODUCTS_START,
  UPDATE_PRODUCTS_SUCCESS,
  UPDATE_PRODUCTS_FAILED,
} from "./actionsType";

export const fetchDictionaryStart = (params = {}) => {
  return {
    type: FETCH_DICTIONARY_START,
    payload: params
  };
};
export const fetchDictionarySuccess = (data) => {
  return {
    type: FETCH_DICTIONARY_SUCCESS,
    payload: data
  };
};
export const fetchDictionaryFailed = (error) => {
  return {
    type: FETCH_DICTIONARY_FAILED,
    payload: { error },
  };
};
export const apiError = (error) => {
  return {
    type: API_ERROR,
    payload: { error }
  };
};
export const addNewItem = (id, data) => {
  return {
    type: ADD_NEW_ITEM,
    payload: {
      id,
      data
    }
  };
};
export const removeItem = (id, data) => {
  return {
    type: REMOVE_ITEM,
    payload: {
      id,
      data
    }
  };
};
export const addItemToActions = (value) => {
  return {
    type: ADD_ITEM_TO_ACTIONS,
    payload: value
  };
};
export const addItemToMarkups = (value) => {
  return {
    type: ADD_ITEM_TO_MARKUPS,
    payload: value
  };
};
export const addItemToExchanges = (value) => {
  return {
    type: ADD_ITEM_TO_EXCHANGES,
    payload: value
  };
};
export const addItemToCallStatus = (value) => {
  return {
    type: ADD_ITEM_TO_CALL_STATUS,
    payload: value
  };
};
export const addItemToCountries = (value) => {
  return {
    type: ADD_ITEM_TO_COUNTRIES,
    payload: value
  };
};
export const removeItemFromCountries = (value) => {
  return {
    type: REMOVE_ITEM_FROM_COUNTRIES,
    payload: value
  };
};
export const removeItemFromActions = (value) => {
  return {
    type: REMOVE_ITEM_FROM_ACTIONS,
    payload: value
  };
};
export const removeItemFromMarkups = (value) => {
  return {
    type: REMOVE_ITEM_FROM_MARKUP,
    payload: value
  };
};
export const removeItemFromExchanges = (value) => {
  return {
    type: REMOVE_ITEM_FROM_EXCHANGES,
    payload: value
  };
};
export const updateActionStart = (value) => {
  return {
    type: UPDATE_ACTION_START,
    payload: value
  };
};
export const updateMarkupStart = (value) => {
  return {
    type: UPDATE_MARKUP_START,
    payload: value
  };
};
export const updateCallStatusStart = (value) => {
  return {
    type: UPDATE_CALL_STATUS_START,
    payload: value
  };
};
export const updateExchangeStart = (value) => {
  return {
    type: UPDATE_EXCHANGE_START,
    payload: value
  };
};
export const updateCountryStart = (value) => {
  return {
    type: UPDATE_COUNTRY_START,
    payload: value
  };
};
export const updateActionSuccess = (oldValue, newValue) => {
  return {
    type: UPDATE_ACTION_SUCCESS,
    payload: {
      oldValue,
      newValue
    }
  };
};
export const updateMarkupSuccess = (oldValue, newValue) => {
  return {
    type: UPDATE_MARKUP_SUCCESS,
    payload: {
      oldValue,
      newValue
    }
  };
};
export const updateExchangeSuccess = (oldValue, newValue) => {
  return {
    type: UPDATE_EXCHANGE_SUCCESS,
    payload: {
      oldValue,
      newValue
    }

  };
};
export const updateCallStatusSuccess = (oldValue, newValue) => {
  return {
    type: UPDATE_CALL_STATUS_SUCCESS,
    payload: {
      oldValue,
      newValue
    }
  };
};
export const updateCountrySuccess = (countryId, newValue) => {
  return {
    type: UPDATE_COUNTRY_SUCCESS,
    payload: {
      countryId,
      newValue
    },
  };
};
export const editClear = () => {
  return {
    type: EDIT_CLEAR
  };
};
export const addClear = () => {
  return {
    type: ADD_CLEAR
  };
};
export const clearDeleteModal = () => {
  return {
    type: CLEAR_DELETE_MODAL
  };
};

export const updateProductsStart = (value) => {
  return {
    type: UPDATE_PRODUCTS_START,
    payload: value
  };
};

export const updateProductsSuccess = (newProducts) => {
  return {
    type: UPDATE_PRODUCTS_SUCCESS,
    payload: {
      newProducts
    }
  };
};

export const updateProductsFailed = (error) => {
  return {
    type: UPDATE_PRODUCTS_FAILED,
    payload: { error },
  };
};
