import * as axiosHelper from "./api_helper";
import qs from "qs";

export const getClientBankDetails = async ({ payload }) => {
  const id  = payload.clientId;
  const paginationPayload = { 
    limit: payload.limit,
    page: payload.page
  };
  const data = await axiosHelper.get(`/bank-accounts/${id}?${qs.stringify(paginationPayload)}`);
  if (data.isError){
    throw new Error(data.isError);
  }

  return data;
};

export const postBankAccount = async ({ payload }) => {
  const data = await axiosHelper.post("/bank-accounts", payload);
  if (data.isError){
    throw new Error(data.isError);
  }

  return data;
};

export const deleteBankAccount = async ({ payload }) => {
  const id = payload;
  const data = await axiosHelper.del(`/bank-accounts/${id}`);
  if (data.isError){
    throw new Error(data.isError);
  }

  return data;
};

export const updateBankAccount = async ({ payload }) => {
  const { id, values } = payload;
  const data = await axiosHelper.patch(`/bank-accounts/${id}`, values);
  if (data.isError){
    throw new Error(data.isError);
  }

  return data;
};