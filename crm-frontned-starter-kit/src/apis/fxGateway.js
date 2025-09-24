import * as axiosHelper from "./api_helper";

export const getForexGatewayOfDeposit = async ()=>{
  const gateways = await axiosHelper.get("/fxtransactions/deposits-gateways");
  
  return gateways;
};

export const getForexGatewaysOfWithdraw = async ()=>{
  const gateways = await axiosHelper.get("/fxtransactions/withdrawals-gateways");
  
  return gateways;
};