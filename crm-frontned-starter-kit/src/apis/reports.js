

import qs from "qs";
import * as axiosHelper from "./api_helper";

export const getReports = async ({ payload }) => {
  const { reportType, ...params } = payload;
  const data = await axiosHelper.get(`/reports/${reportType}?${qs.stringify(params)}`);
  return data.result;
};

export const downloadReport = async (payload) => {
  const { reportType, ...params } = payload;
  return await axiosHelper.get(`/reports/download/${reportType}?${qs.stringify(params)}`, { responseType: "blob" });
};