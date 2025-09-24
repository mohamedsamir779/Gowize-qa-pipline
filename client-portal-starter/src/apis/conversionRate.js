import * as axiosHelper from "./api_helper";
import qs from "qs";

export const getConversionRate = async (params) => {
  const result = await axiosHelper.get(`/conversionRates/conversion-rate?${qs.stringify(params)}`);
  if (result.status)
    return result.result;
  else throw new Error(result.message);
};
