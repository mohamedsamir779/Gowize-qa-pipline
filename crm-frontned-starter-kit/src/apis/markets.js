import qs from "qs";
import * as axiosHelper from "./api_helper";

export const getMarkets = async ({ payload })=>{
  const data = await axiosHelper.get(`/markets/?${qs.stringify(payload)}`, { crypto: true });
  return data;
};

export const addNewMarketAPI = async (values)=>{
  const data = await axiosHelper.post("/markets", {
    name:values.name,
    baseAsset:values.baseAsset,
    quoteAsset:values.quoteAsset,
    active:values.active,
    fee:values.fee,
    minAmount:values.minAmount
  },
  );
  if (data.code === 500){
    throw new Error("Please Enter Valid data");
  }
  return data;
};
export const updateMarket = async ({ payload })=>{
  
  const { id, values } = payload;
  const data = await axiosHelper.patch(`/markets/${id}`, {
    name:values.name,
    active:values.active,
    fee:values.fee,
    minAmount:values.minAmount
  }, { crypto:true });

  if (data.code === 500){
    throw new Error("Please Enter Valid data");
  }
  return data;
}; 

// change market status 
export const changeMarketStatusApi = async({ payload }) => {
  const { id, status } = payload;
  const data = await axiosHelper.post(`/markets/${id}/${status}`);
  if (data.isError) {
    throw new Error(data.message);
  } 
  return data;
};