import * as axiosHelper from "./api_helper";
import qs from "qs";

// fetch credits
export const getCredits = async ({ payload }) => {
  const result = await axiosHelper.get(`/fxtransactions/credits?${qs.stringify(payload)}`);
  if (!result.status){
    throw new Error(result.message);
  }

  return result;
};

// add credit
export const postCredit = async ({ payload }) => {
  const result = await axiosHelper.post("/fxtransactions/credits", payload);
  if (!result.status){
    throw new Error(result.message);
  }

  return result;
};