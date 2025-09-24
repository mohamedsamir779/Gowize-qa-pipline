import {
  FETCH_IB_AGREEMENTS_START, FETCH_IB_AGREEMENTS_SUCCESS,
  FETCH_IB_PRODUCTS_START, FETCH_IB_PRODUCTS_SUCCESS,
  ADD_MASTER_IB_AGREEMENT_START, ADD_MASTER_IB_AGREEMENT_SUCCESS,
  ADD_SHARED_IB_AGREEMENT_START, ADD_SHARED_IB_AGREEMENT_SUCCESS,
  UPDATE_MASTER_IB_AGREEMENT_START, UPDATE_MASTER_IB_AGREEMENT_SUCCESS,
  UPDATE_SHARED_IB_AGREEMENT_START, UPDATE_SHARED_IB_AGREEMENT_SUCCESS,
  DELETE_IB_AGREEMENT_START, DELETE_IB_AGREEMENT_SUCCESS,
  API_ERROR,
} from "./actionTypes";

export const fetchAgreements = (data) => {
  return {
    type: FETCH_IB_AGREEMENTS_START,
    payload: data
  };
};
export const fetchAgreementsSuccess = (data) => {
  return {
    type: FETCH_IB_AGREEMENTS_SUCCESS,
    payload: data
  };
};
export const fetchProducts = () => {
  return {
    type: FETCH_IB_PRODUCTS_START,
  };
};
export const fetchProductsSuccess = (data) => {
  return {
    type: FETCH_IB_PRODUCTS_SUCCESS,
    payload: data
  };
};
export const createMasterIbAgreement = (payload) => {
  return {
    type: ADD_MASTER_IB_AGREEMENT_START,
    payload: payload
  };
};
export const createMasterIbAgreementSuccess = (data) => {
  return {
    type: ADD_MASTER_IB_AGREEMENT_SUCCESS,
    payload: data
  };
};
export const updateMasterIbAgreement = (payload) => {
  return {
    type: UPDATE_MASTER_IB_AGREEMENT_START,
    payload: payload
  };
};
export const updateMasterIbAgreementSuccess = (data) => {
  return {
    type: UPDATE_MASTER_IB_AGREEMENT_SUCCESS,
    payload: data
  };
};
export const createSharedIbAgreement = (payload) => {
  return {
    type: ADD_SHARED_IB_AGREEMENT_START,
    payload: payload
  };
};
export const createSharedIbAgreementSuccess = (data) => {
  return {
    type: ADD_SHARED_IB_AGREEMENT_SUCCESS,
    payload: data
  };
};
export const updateSharedIbAgreement = (payload) => {
  return {
    type: UPDATE_SHARED_IB_AGREEMENT_START,
    payload: payload
  };
};
export const updateSharedIbAgreementSuccess = (data) => {
  return {
    type: UPDATE_SHARED_IB_AGREEMENT_SUCCESS,
    payload: data
  };
};
export const deleteIbAgreement = (payload) => {
  return {
    type: DELETE_IB_AGREEMENT_START,
    payload: payload
  };
};
export const deleteIbAgreementSuccess = (data) => {
  return {
    type: DELETE_IB_AGREEMENT_SUCCESS,
    payload: data
  };
};
export const apiError = (error) => {
  return {
    type: API_ERROR,
    payload: error
  };
};