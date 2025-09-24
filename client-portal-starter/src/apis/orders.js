
import qs from "qs";
import * as axiosHelper from "./api_helper";

export async function getOrders(params){
  const result = await axiosHelper.get(`/orders?${qs.stringify(params)}`);
  return result;

}

export const postOrderAPI = async (params) => {
  let reqParams = {};
  if (params.orderType === "market") {
    if (params.type === "buy") {
      reqParams = {
        symbol: params.market.pairName,
        type: params.orderType,
        side: params.type,
        amount: `${params.baseAmount}`
      };
    } else if (params.type === "sell") {
      reqParams = {
        symbol: params.market.pairName,
        type: params.orderType,
        side: params.type,
        amount: `${params.baseAmount}`
      };
    }
  } else if (params.orderType === "limit") {
    if (params.type === "buy") {
      reqParams = {
        symbol: params.market.pairName,
        type: params.orderType,
        side: params.type,
        amount: `${params.baseAmount}`,
        price: params.quoteAmount
      };
    } else if (params.type === "sell") {
      reqParams = {
        symbol: params.market.pairName,
        type: params.orderType,
        side: params.type,
        amount: `${params.baseAmount}`,
        price: params.quoteAmount
      };
    }
  }
  // if (params.type === 'buy') {
  //     reqParams = { ...reqParams, amount: `${params.baseAmount}` }
  // }
  // if (params.type === 'sell') {
  //     reqParams = { ...reqParams, price: params.quoteAmount }
  // }
  const result = await axiosHelper.post("orders", reqParams);
  if (result.status){
    return result;
  }
  else throw new Error(result.message);
};