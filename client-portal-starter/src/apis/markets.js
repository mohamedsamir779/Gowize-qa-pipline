import qs from "qs";
import * as axiosHelper from "./api_helper";

export const fetchMarkets = async ({ payload }) => {
  const data = await axiosHelper.get(`/markets/markets/all?${qs.stringify(payload)}`);
  if (data.isError) {
    return data;
  } 
  return data.result;
};