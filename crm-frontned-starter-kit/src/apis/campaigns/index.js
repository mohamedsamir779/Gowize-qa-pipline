import qs from "qs";
import * as axiosHelper from "../api_helper";

export const getEmailCampaigns = async ({ payload }) => {
  const data = await axiosHelper.get(`/email-campaign?${qs.stringify(payload)}`);
  if (data.isError) {
    throw new Error(data.mesage);
  }
  return data.result;
};

export const addEmailCampaign = async ({ payload }) => {
  const data = await axiosHelper.post("/email-campaign", payload);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const editEmailCampaign = async ({ payload }) => {
  const { id, ...rest } = payload;
  const data = await axiosHelper.patch(`/email-campaign/${id}`, rest);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const deleteEmailCampaign = async ({ payload }) => {
  const data = await axiosHelper.del(`/email-campaign/${payload}`);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};
