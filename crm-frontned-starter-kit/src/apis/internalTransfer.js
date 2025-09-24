import * as axiosHelper from "./api_helper";
import qs from "qs";

// fetch internal transfers
export const getInternalTransfers = async ({ payload }) => {
  const result = await axiosHelper.get(`/fxtransactions/internalTransfers?${qs.stringify(payload)}`);
  if (!result.status){
    throw new Error(result.message);
  }

  return result;
};

// add internal transfer
export const postInternalTransfer = async (values) => {
  const result = await axiosHelper.post("/fxtransactions/internalTransfers", values);
  if (!result.status){
    throw new Error(result.message);
  }

  return result;
};

export const postIbInternalTransfer = async (values) => {
  const result = await axiosHelper.post("/ib/internalTransfer", values);
  if (!result.status){
    throw new Error(result.message);
  }

  return result;
};

export const approveInternalTransferAPI = async (id)=>{
  const result = await axiosHelper.patch(`/fxtransactions/internalTransfers/${id}/approve`);
  if (result.isError){
    throw new Error(result.message);
  }
  return result;
};

export const rejectInternalTransferAPI = async (id)=>{
  const result = await axiosHelper.patch(`/fxtransactions/internalTransfers/${id}/reject`);
  if (result.isError){
    throw new Error(result.message);
  }
  return result;
};

export const addApprovedInternalTransferAPI = async (payload)=> {
  const result = await axiosHelper.post("/wallet/transfers", payload);
  if (result.isError){
    throw new Error(result.message);
  }
  return result;
};