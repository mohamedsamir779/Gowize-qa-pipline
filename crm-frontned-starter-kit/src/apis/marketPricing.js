import qs from "qs";
import * as axiosHelper from "./api_helper";

export const getMarketPrices = async ({ payload }) => {
  const data = await axiosHelper.get(`/pricing?${qs.stringify(payload)}`, { crypto: false });
  if (data.isError && !data.status) {
    throw new Error(data.message);
  }

  return data;
};

export const getOrderBook = async ({ payload }) => {
  const data = await axiosHelper.get(`/order-book?${qs.stringify(payload)}`, { crypto: false });
  if (data.isError && !data.status) {
    throw new Error(data.message);
  }
  
  return data;
};