import * as axiosHelper from "./api_helper";

export const generateSDK = async (customerId) => {
  const result = await axiosHelper.get(`/sumsub/generate/${customerId}`);
  if (result.status)
    return result.result;
  else throw new Error(result.message);
};
