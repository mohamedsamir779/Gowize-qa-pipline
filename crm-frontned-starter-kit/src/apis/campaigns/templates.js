import qs from "qs";
import * as axiosHelper from "../api_helper";

export const getCampaignTemplates = async ({ payload }) => {
  const data = await axiosHelper.get(`/campaign-templates?${qs.stringify(payload)}`);
  if (data.isError) {
    throw new Error(data.mesage);
  }
  return data.result;
};

export const addCampaignTemplate = async ({ payload }) => {
  const data = await axiosHelper.post("/campaign-templates", payload);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const editCampaignTemplate = async ({ payload }) => {
  const { id, ...rest } = payload;
  const data = await axiosHelper.patch(`/campaign-templates/${id}`, rest);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const deleteCampaignTemplate = async ({ payload }) => {
  const data = await axiosHelper.del(`/campaign-templates/${payload}`);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const fetchCampaignTemplateHTML = async ({ payload }) => {
  const { id, lang } = payload;
  const data = await axiosHelper.get(`/campaign-templates/${id}/preview/${lang}`);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};
