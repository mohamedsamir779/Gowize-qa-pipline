import * as axiosHelper from "./api_helper";
import qs from "qs";

export const getDeposits = async ({ payload })=>{
  const deposits = await axiosHelper.get(`/transactions/deposit?${qs.stringify(payload)}`);
  return deposits;
};
export const makeDeposit = async (values)=>{
  const result = await axiosHelper.post("/transactions/deposit", values);
  if (result.code === 422){
    throw new Error("Deposit has failed");
  }
  return result ;
};
export const aprroveDeposit = async (id, customerId)=>{
  const result = await axiosHelper.patch(`/transactions/deposit/${id}/approve`, { customerId });
  if (result.isError){
    throw new Error(result.message);
  }

  return result;
};

export const approveFxDepositAPI = async (id, customerId)=>{
  const result = await axiosHelper.patch(`/fxtransactions/deposit/${id}/approve`, { customerId });
  if (result.isError){
    throw new Error(result.message);
  }

  return result;
};
export const rejectDeposit = async (id, customerId)=>{
  const result = await axiosHelper.patch(`/transactions/deposit/${id}/reject`, { customerId });
  if (result.isError){
    throw new Error(result.message);
  }
  
  return result;
};

export const getClientDeposits = async ({ payload }) => {
  const { clientId, type } = payload;
  const deposits = await axiosHelper.get(`/transactions/deposit?customerId=${clientId}&type=${type}`);
  const data = { 
    deposits: deposits
  };
  if (deposits.isError){
    throw new Error(data.isError);
  }

  return data;
};
