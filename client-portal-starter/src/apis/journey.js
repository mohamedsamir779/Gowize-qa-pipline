import * as axiosHelper from "./api_helper";

export async function startTradingJourneyAPI() {
  const data = await axiosHelper.post("customer/start-trading");
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
}