import * as axiosHelper from "./api_helper";
import qs from "qs";

export const getClientTransactions = async ({ payload })=>{
  const records = await axiosHelper.get(`/transactions/?${qs.stringify(payload)}`);
  return records.result;
};