import qs from "qs";
import * as axiosHelper from "./api_helper";

export async function getWithdrawals(params){
  const result = await axiosHelper.get(`/transactions/withdraw?${qs.stringify(params)}`);
  if (result.isSuccess === false){
    throw Error("Error while fetching data");
  }
  return result;
}

export async function getDeposits(params){
  const result = await axiosHelper.get(`/transactions/deposit?${qs.stringify(params)}`);
  if (result.isSuccess === false){
    throw Error("Error while fetching deposits");
  }
  return result;
}

export async function getConverts(params){
  const result = await axiosHelper.get(`/convert?${qs.stringify(params)}`);
  if (result.isSuccess === false){
    throw Error("Error while fetching deposits");
  }
  
  return result;
}

// deposit gateWays
export async function getDepositGateWays(){
  const result = await axiosHelper.get("/transactions/deposit/gateways");
  if (result.isSuccess === false){
    throw Error("Error while fetching data");
  }
  return result;
}

// withdrawal gateWays
export async function getWithdrawalGateWays(){
  const result = await axiosHelper.get("/transactions/withdraw/gateways");
  if (result.isSuccess === false){
    throw Error("Error while fetching data");
  }
  return result;
}