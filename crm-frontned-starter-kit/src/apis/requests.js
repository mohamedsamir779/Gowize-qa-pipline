import * as axiosHelper from "./api_helper";
import qs from "qs";

export const getIbsRequsts = async ({ payload }) => {
  const data = await axiosHelper.get(`/requests/ib?${qs.stringify(payload)}`);
  if (data.isError){
    throw new Error(data.isError);
  }

  return data;
};

export const approveIbRequest = async (data) =>{
  const requestId = data;
  const result = await axiosHelper.post("/requests/ib/approve", requestId);
  return result;
};

export const rejectIbRequest = async (data) =>{
  const requestId = data;
  const result = await axiosHelper.post("/requests/ib/reject", requestId);
  return result;
};

export const getLeveragesRequsts = async ({ payload }) => {
  const data = await axiosHelper.get(`/requests/leverage?${qs.stringify(payload)}`);
  if (data.isError){
    throw new Error(data.isError);
  }

  return data;
};

export const approveLeverageRequest = async (data) =>{
  const requestId = data;
  const result = await axiosHelper.post("/requests/leverage/approve", requestId);
  if (result.isError){
    throw new Error(result.message);
  }
  return result;
};

export const rejectLeverageRequest = async (data) =>{
  const requestId = data;
  const result = await axiosHelper.post("/requests/leverage/reject", requestId);
  if (result.isError){
    throw new Error(result.message);
  }
  return result;
};

export const fetchAccountRequests = async (payload) =>{
  const data = await axiosHelper.get(`/requests/account?${qs.stringify(payload)}`);
  if (data.isError){
    throw new Error(data.message);
  }
  return data; 
};

export const approveAccountRequest = async (requestId) =>{
  const result = await axiosHelper.post("/requests/account/approve", requestId);
  if (result.isError) {
    throw new Error(result.isError);
  }
  return result;
};

export const rejectAccountRequest = async (requestId) =>{
  const result = await axiosHelper.post("/requests/account/reject", requestId);
  if (result.isError){
    throw new Error(result.isError);
  }
  return result;
};