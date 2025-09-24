
import qs from "qs";
import * as axiosHelper from "./api_helper";

// fetch a trading accounts by login number
export const getTradingAccountByLogin = async ({ payload })=>{
  const result = await axiosHelper.get(`/accounts?${qs.stringify(payload)}`);
  if (!result.status) {
    throw new Error(result.message);
  }

  return result;
};

// fetch trading accounts by customerId
export const getTradingAccountByCustomerId = async ({ payload })=>{
  const result = await axiosHelper.get(`/accounts?${qs.stringify(payload)}`);
  if (!result.status) {
    throw new Error(result.message);
  }

  return result;
};

export const getAccountTypes = async({ payload }) => {
  const data = await axiosHelper.get(`/accounts/account-types?${qs.stringify(payload)}`);
  return data.result;
};

export const createAccountType = async({ payload }) => {
  const data = await axiosHelper.post("/accounts/account-types", payload);
  if (!data.result) throw new Error(data.message);
  return data.result;
};

export const updateAccountType = async({ payload }) => {
  const { id, ...rest } = payload;
  const data = await axiosHelper.patch(`/accounts/account-types/${id}`, rest);
  if (!data.result) throw new Error(data.message);
  return data.result;
};

export const createTradingAccount = async({ payload }) => {
  delete payload.type;
  delete payload.platform;
  const data = await axiosHelper.post("/accounts", payload);
  if (!data.result) throw new Error(data.message);
  return data.result;
};

export const linkTradingAccount = async({ payload }) => {
  const data = await axiosHelper.post("/accounts/link", payload);
  if (!data.result) throw new Error(data.message);
  return data.result;
};

export const getTradingAccounts = async({ payload }) => {
  const data = await axiosHelper.get("/accounts?" + qs.stringify(payload));
  return data.result;
};

export const getTradingAccountsStateLess = async({ payload }) => {
  const data = await axiosHelper.get("/accounts/stateless?" + qs.stringify(payload));
  return data.result;
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

export const updateTypeAPI = async ({  payload }) => {
  try {
    return await axiosHelper.post("/accounts/change-group", payload);
  } catch (error) {
    throw new Error("Error while updating account type.");
  }
};

export const changeAccessAPI = async ({  payload }) => {
  try {
    return await axiosHelper.post("/accounts/change-access", payload);
  } catch (error) {
    throw new Error("Error while changing account access.");
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

export const getClosePositionsAPI = async ({ _id, page, limit }) => {
  try {
    return await axiosHelper.get(`/accounts/${_id}/close-positions?${qs.stringify({
      page,
      limit
    })}`);
  } catch (error) {
    throw new Error("Error while fetching close positions.");
  }
};
