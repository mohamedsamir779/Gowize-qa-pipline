import qs from "qs";
import * as axiosHelper from "./api_helper";

export const getConversionRates = async ({ payload }) => {
  const data = await axiosHelper.get(`/conversionRates?${qs.stringify(payload)}`);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data.result;
};

export const addConversionRate = async ({ payload }) => {
  const data = await axiosHelper.post("/conversionRates", payload);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const editConversionRate = async ({ payload }) => {
  const {
    id,
    baseCurrency,
    targetCurrency,
    value
  } = payload;
  const data = await axiosHelper.patch(`/conversionRates/${id}`, {
    baseCurrency,
    targetCurrency,
    value
  });
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};