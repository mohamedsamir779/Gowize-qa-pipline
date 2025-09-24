import qs from "qs";
import * as axiosHelper from "./api_helper";

export const getOrders = async ({ payload }) => {
  const data = await axiosHelper.get(`/order/?${qs.stringify(payload)}`);
  if (data.isError) {
    throw new Error(data.mesage);
  }

  return data.result;
};

export const getUserOrders = async ({ payload }) => {
  const id = payload;
  const data = await axiosHelper.get(`/order/${id}`);
  if (data.isError) {
    throw new Error(data.message);
  }

  return data;
};

export const addUserOrder = async ({ payload }) => {
  const data = await axiosHelper.post("/order", payload);
  if (data.isError) {
    throw new Error(data.message);
  }

  return data;
};

export const getMarkets = async ({ payload }) => {
  const data = await axiosHelper.get(`/markets?${qs.stringify(payload)}`);
  return data.result;
};
export const getPricing = async (payload) => {
  const data = await axiosHelper.get("/pricing?" + ("pairName=" + payload.pairName) + ("&markupId=" + (payload?.markupId || "")));
  return data.result;
};
export const deleteUserOrder = async ({ payload }) => {
  // here the payload is just the id for system email to be deleted 
  const data = await axiosHelper.del(`/order/${payload}`);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};