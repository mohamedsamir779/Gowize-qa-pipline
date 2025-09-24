import * as axiosHelper from "./api_helper";
import qs from "qs";

// fetch forex deposits
export const getForexDeposits = async ({ payload }) => {
  const result = await axiosHelper.get(`/fxtransactions/deposits?${qs.stringify(payload)}`);
  if (!result.status){
    throw new Error(result.message);
  }

  return result;
};

// add forex deposit
export const postForexDeposit = async ({ payload }) => {
  const result = await axiosHelper.post("/fxtransactions/deposits", payload);
  if (!result.status){
    throw new Error(result.message);
  }

  return result;
};

export const rejectFxDeposit = async (id, customerId) => {
  const result = await axiosHelper.patch(`/fxtransactions/deposit/${id}/reject`, { customerId });
  if (result.isError){
    throw new Error(result.message);
  }

  return result;
};
