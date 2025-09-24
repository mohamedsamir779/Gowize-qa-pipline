import qs from "qs";
import * as axiosHelper from "./api_helper";

export const getTransactionsProfitsAPI = async ({ payload }) => {
  const data = await axiosHelper.get(`/risk/balances/?${qs.stringify(payload)}`);
  if (data.isError) {
    throw new Error(data.mesage);
  }
  
  return data.result;
};