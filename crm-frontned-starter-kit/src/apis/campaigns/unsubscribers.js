import qs from "qs";
import * as axiosHelper from "../api_helper";

export const getCampaignUnsubscribers = async ({ payload }) => {
  const data = await axiosHelper.get(`/campaign-unsubscribers?${qs.stringify(payload)}`);
  if (data.isError) {
    throw new Error(data.mesage);
  }
  return data.result;
};
