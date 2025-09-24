import qs from "qs";
import * as axiosHelper from "./api_helper";

export const getAssets = async ({ payload }) => {
  const data = await axiosHelper.get(`/assets/?${qs.stringify(payload)}`, { crypto: false });
  return data;
};

export const addNewSymbol = async (formData) => {
  const data = await axiosHelper.postFormData("/assets", formData);
  if (data.code === 500) {
    throw new Error("Please Enter Valid data");
  }
  return data;
};

export const updateSymbol = async (payload) => {
  const { id, formData } = payload;
  const data = await axiosHelper.updateFormData(`/assets/${id}`, formData);
  if (data.code === 500) {
    throw new Error("Please Enter Valid data");
  }
  return data;
};

export const deleteSymbol = async ({ payload }) => {
  const result = await axiosHelper.del(`/assets/${payload}`, {
    crypto: true
  });
  return result;
};
