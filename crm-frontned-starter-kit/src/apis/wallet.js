import qs from "qs";
import * as axiosHelper from "./api_helper";

export const getWallets = async  ({ payload })=>{
  const wallets = await axiosHelper.get(`/wallets?${qs.stringify(payload)}`, { crypto:true });
  return wallets;
};

export const getClientWalletDetails = async ({ payload }) => {
  const params = {
    belongsTo: payload.belongsTo,
    customerId: payload.belongsTo,
    ...payload,
  };
  const data = await axiosHelper.get(`/wallets?${qs.stringify(params)}`);
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};

export const addNewWallet = async ({ payload }) => {
  const data = await axiosHelper.post("/wallets", payload);
  if (data.isError){
    throw new Error(data.message);
  }

  return data;
};
// export const changeStatusWallet = async({ payload }) => {
//   const data = await axiosHelper.post(`/wallets/${payload.id}/${payload.status}`);
//   if (data.isError) {
//     throw new Error(data.message);
//   } 
//   return data;
// };
export const changeStatusWallet = async ({ payload }) => { 
  const statu = {
    status: payload?.status 
  };
  const { id } = payload;
  const data = await axiosHelper.patch(`/wallets/${id}`, statu);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};
export const convertWallet = async (payload)=>{
  const data = await axiosHelper.post("/convert", payload);
  if (data.isError){
    throw new Error(data.message);
  }
  return data;
};

export const getWalletTransfers = async (params) => {
  const data = await axiosHelper.get(`/wallet/transfers?${qs.stringify(params)}`);
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};

export const approveTransfer = async ( payload) => {
  const data = await axiosHelper.patch(`/wallet/transfers/approve/${payload}`);
  if (data.isError) {
    throw new Error(data.message);
  } 
  return data;
};

export const rejectTransfer = async (payload) => {
  const data = await axiosHelper.patch(`/wallet/transfers/reject/${payload}`);
  if (data.isError) {
    throw new Error(data.message);
  } 
  return data;
};