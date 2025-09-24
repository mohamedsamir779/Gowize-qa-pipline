import * as axiosHelper from "./api_helper";

export const getSyncDeals = async (payload) => {
  const data = await axiosHelper.post("/sync-deals", payload);
  return data;
};

export const syncMissingDeals = async (payload) => {
  const data = await axiosHelper.post("/sync-deals/sync", payload);
  return data;
};