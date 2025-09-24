import qs from "qs";
import * as axiosHelper from "./api_helper";

export const fetchWalletsAPI = async ({ payload }) => {
  const result = await axiosHelper.get(`/wallets/?${qs.stringify(payload)}`);
  if (result.status)
    return result.result;
  else
    throw new Error(result.message);
};

export const createWalletTransferRequest = async({ payload }) => {
  const data = await axiosHelper.post("/wallet/transfer", payload);
  if (data.isError) {
    throw new Error(data.message);
  } 
  return data;
};

export const fetchReportsAPI = async (payload) => {
  const result = await axiosHelper.get(`/wallet/report/?${qs.stringify(payload)}`);
  if (result.status)
    return result.result;
  else
    throw new Error(result.message);
};

export const createIbWalletTransferAPI = async ({ payload }) => {
  const result = await axiosHelper.post("/ib-wallet/transfer", payload);
  if (result.isError) {
    throw new Error(result.message);
  } 
  return result;
};
