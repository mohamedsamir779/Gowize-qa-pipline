import qs from "qs";
import * as axiosHelper from "./api_helper";

export const fetchOrderBooks = async ({ payload }) => {
  const data = await axiosHelper.get(`/order-book/all?${qs.stringify(payload)}`);
  if (data.isError) {
    return data;
  } 
  return data.result;
};