import * as axiosHelper from "../api_helper";
import qs from "qs";

export const fetchWithdrawalGatewaysAPI = async () => {
  const gateways = await axiosHelper.get(
    "/fxtransactions/withdrawals-gateways"
  );
  if (!gateways.status) {
    throw new Error(gateways.message);
  }
  return gateways;
};

export const addWithdrawalAPI = async ({ payload }) => {
  const result = await axiosHelper.post("/fxtransactions/withdrawals", payload);
  if (!result.status) {
    throw new Error(result.message);
  }
  return result;
};

export const getDepositsAPI = async (params) => {
  const result = await axiosHelper.post(
    `/fxtransactions/withdrawals?${qs.stringify(params)}`
  );
  if (!result.status) {
    throw new Error(result.message);
  }
  return result;
};
