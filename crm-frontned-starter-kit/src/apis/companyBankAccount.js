import * as axiosHelper from "./api_helper";
import qs from "qs";

export const getDetails = async ({ payload }) => {
  const paginationPayload = { 
    limit: payload.limit,
    page: payload.page
  };
  const data = await axiosHelper.get(`/company-bank-accounts?${qs.stringify(paginationPayload)}`);
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};

export const postAccount = async ({ payload }) => {
  const data = await axiosHelper.post("/company-bank-accounts", payload);
  if (data.isError){
    throw new Error(data.isError);
  }

  return data;
};

export const deleteAccount = async ({ payload }) => {
  const id = payload;
  const data = await axiosHelper.del(`/company-bank-accounts/${id}`);
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};

export const updateAccount = async ({ payload }) => {
  const { id, values } = payload;
  const data = await axiosHelper.patch(`/company-bank-accounts/${id}`, values);
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};