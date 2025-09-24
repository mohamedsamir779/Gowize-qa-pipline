import qs from "qs";
import * as axiosHelper from "./api_helper";

export const getOrderProfitsAPI = async ({ payload }) => {
  const data = await axiosHelper.get(`/risk/orders?${qs.stringify(payload)}`);
  if (data.isError) {
    throw new Error(data.mesage);
  }
  
  return data.result;
};