import qs from "qs";
import * as axiosHelper from "./api_helper";

export const fetchHighKlines = async ({ payload }) => {
  const data = await axiosHelper.get(`/kline/all?${qs.stringify(payload)}`);
  if (data.isError) {
    return data;
  }
  return data.result;
};
export const fetchOHLCV = async ({ payload }) => {
  const data = await axiosHelper.get(`/kline?${qs.stringify(payload)}`);
  if (data.isError) {
    return data;
  }
  // chart accepts kline times in secs
  data.result.data.map((kline) => {
    kline.time /= 1000;
  });
  return data.result;
};