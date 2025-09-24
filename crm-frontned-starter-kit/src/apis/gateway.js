import * as axiosHelper from "./api_helper";
export const getGatewayOfDeposit = async ()=>{
  const gateways = await axiosHelper.get("/transactions/deposit/gateways");
  
  return gateways;
};
export const getGatewaysOfWithdraw = async ()=>{
  const gateways = await axiosHelper.get("/transactions/withdraw/gateways");
  return gateways;
};