import * as axiosHelper from "../api_helper";
import qs from "qs";

export const getAccountsAPI = async (params) => {
  try {
    return await axiosHelper.get(`/accounts?${qs.stringify(params)}`);
  } catch (error) {
    throw new Error("Error while fetching accounts.");
  }
};

export const createAccountAPI = async (params) => {
  try {
    return await axiosHelper.post("/accounts", params);
  } catch (error) {
    throw new Error("Error while creating new account.");
  }
};

export const getAccountTypesAPI = async (params) => {
  try {
    return await axiosHelper.get(`/accounts/account-types?${qs.stringify(params)}`);
  } catch (error) {
    throw new Error("Error while creating new account.");
  }
};

export const updateLeverageAPI = async ({ _id, body }) => {
  try {
    return await axiosHelper.post(`/accounts/${_id}/change-leverage`, body);
  } catch (error) {
    throw new Error("Error while updating leverage.");
  }
};

export const updatePasswordAPI = async ({ _id, body }) => {
  try {
    return await axiosHelper.post(`/accounts/${_id}/change-password`, body);
  } catch (error) {
    throw new Error("Error while updating password.");
  }
};

export const getOpenPositionsAPI = async ({ _id, page, limit }) => {
  try {
    return await axiosHelper.get(`/accounts/${_id}/open-positions?${qs.stringify({
      page,
      limit
    })}`);
  } catch (error) {
    throw new Error("Error while fetching open positions.");
  }
};

export const getClosePositionsAPI = async ({ _id }) => {
  try {
    return await axiosHelper.get(`/accounts/${_id}/close-positions`);
  } catch (error) {
    throw new Error("Error while fetching close positions.");
  }
};

export const getTransfersAPI = async (params) => {
  try {
    return await axiosHelper.get(`fxtransactions/all?${qs.stringify(params)}`);
  } catch (error) {
    throw new Error("Error while fetching latest transactions.");
  }
};

export const createInternalTransferAPI = async (body) => {
  try {
    return await axiosHelper.post("fxtransactions/internalTransfers", body);
  } catch (error) {
    throw new Error("Error while making an internal transfer");
  }
};