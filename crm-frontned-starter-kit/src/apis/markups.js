import qs from "qs";
import * as axiosHelper from "./api_helper";

export const getMarkups = async ({ payload }) => {
  const data = await axiosHelper.get(`/markups?${qs.stringify(payload)}`, { crypto: false });

  if (data.isError && !data.status) {
    throw new Error(data.message);
  }

  return data;
};

export const fetchSingleMarkupAPI = async (markupId) => {
  const data = await axiosHelper.get(`/markups/${markupId}`, { crypto:false });
  if (data.isError && !data.status){
    throw new Error(data.message);
  }
  return data;
};