/* eslint-disable no-debugger */
import * as axiosHelper from "../api_helper";

export const addLink = async (payload) => {
  const data = await axiosHelper.post("/utm-campaign", {
    ...payload
  });
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};

export const editLink = async (payload) => {
  const data = await axiosHelper.put(`/utm-campaign/${payload.campaignToken}`, {
    ...payload
  });
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};

export const deleteLink = async (campaignToken) => {
  const data = await axiosHelper.del(`/utm-campaign/${campaignToken}`);
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};