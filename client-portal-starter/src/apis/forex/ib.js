import * as axiosHelper from "../api_helper";
import qs from "qs";

export const getIbClientsAPI = async (params) => {
  try {
    return await axiosHelper.get(`/ib/clients?${qs.stringify(params)}`);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getIbClientAccountsAPI = async (params) => {
  try {
    return await axiosHelper.get(`/ib/client/accounts?${qs.stringify(params)}`);

  } catch (error) {
    throw new Error(error.message);
  }
};

export const getIbClientAccountActivitiesAPI = async (params) => {
  try {
    const type = params.type;
    delete params.type;
    return await axiosHelper.get(`/ib/client/account/${type}?${qs.stringify(params)}`);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getIbTransactionsAPI = async (params) => {
  try {
    return await axiosHelper.get(`/ib/client/transactions?${qs.stringify(params)}`);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getIbDashboardSummary = async (params) => {
  try {
    return await axiosHelper.get(`/ib/summary?${qs.stringify(params)}`);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getIbWallet = async (params) => {
  try {
    return await axiosHelper.get(`/ib-wallet?${qs.stringify(params)}`);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const addQuestionnaire = async (params) => {
  try {
    return await axiosHelper.patch("/ib/questionnaire", params);
  } catch (error) {
    throw new Error(error.message);
  }
};

export async function fetchIbAgreements() {
  try {
    const result = await axiosHelper.get("/ib/agrements");
    return result;
  } catch (error) {
    throw new Error("Error while fetching IB agreements.");
  }
}

export async function internaltransferAPI(params) {
  const result = await axiosHelper.post("/ib/internalTransfer", params);
  if (result.isError){
    throw new Error(result.message);
  }

  return result;
}

export const getReferrals = async ({ payload }) => {
  try {
    const data = await axiosHelper.get(`/ib/referrals?${qs.stringify(payload)}`);
    if (data.isError) {
      throw new Error(data.isError);
    }
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getStatement = async ({ payload }) => {
  const data = await axiosHelper.get(`/ib/statement?${qs.stringify(payload)}`);
  if (data.isError){
    throw new Error(data.message);
  }
  return data;
};

export const getStatementDeals = async ({ payload }) => {
  const data = await axiosHelper.get(`/ib/statement/deals?${qs.stringify(payload)}`);
  if (data.isError) {
    throw new Error(data.isError);
  }
  return data;
};

// get ib client accounts (owned by the client ibMT4 + ibMT5)
export const getClientIbAccountAPI = async () => {
  const data = await axiosHelper.get("/ib/accounts");
  if (data.isError) {
    throw new Error(data.isError);
  }
  return data;
};

// get all clients accounts
export const getAllClientsIbAccountAPI = async ({ payload }) => {
  const joinedCustomersIds = Object.values(payload.customersId);
  const data = await axiosHelper.get(`/ib/all/clients/accounts?type=${payload.type}&customersId=${[joinedCustomersIds]}`);
  if (data.isError) {
    throw new Error(data.isError);
  }
  return data;
};