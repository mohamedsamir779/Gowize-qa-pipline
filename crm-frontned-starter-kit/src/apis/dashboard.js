

import qs from "qs";
import * as axiosHelper from "./api_helper";

export const getCustomerCountries = async ({ payload }) => {
  const data = await axiosHelper.get(`/dashboard/stats/customers-countries?${qs.stringify(payload)}`);
  return data.result;
};

export const getCustomerStats = async ({ payload }) => {
  const data = await axiosHelper.get(`/dashboard/stats/customers?${qs.stringify(payload)}`);
  return data.result;
};

export const getLeadStages = async ({ payload }) => {
  const data = await axiosHelper.get(`/dashboard/stats/leads?${qs.stringify(payload)}`);
  return data.result;
};

export const getRequestStats = async () => {
  const data = await axiosHelper.get("/dashboard/stats/requests");
  if (data.isError || !data.result) {
    return;
  }
  const obj = {};
  data?.result?.map((s) => {
    obj[s?._id?.type] = {
      ...obj[s?._id?.type],
      [s?._id?.status]: s?.total
    };
  });
  return obj;
};

export const getTransactionStats = async () => {
  const data = await axiosHelper.get("/dashboard/stats/transactions");
  if (data.isError || !data.result) {
    return;
  }
  const obj = {
    forex: {},
    wallets: {}
  };
  if (!data?.result?.forex)
    return obj;
  data?.result?.forex?.map((s) => {
    obj.forex[s?._id?.type] = {
      ...obj.forex[s?._id?.type],
      [s?._id?.status]: s?.total
    };
  });
  data?.result?.wallets?.map((s) => {
    obj.wallets[s?._id?.type] = {
      ...obj.wallets[s?._id?.type],
      [s?._id?.status]: s?.total
    };
  });
  return obj;
};

export const getKycStats = async () => {
  const data = await axiosHelper.get("/dashboard/stats/kyc");
  if (data.isError || !data.result) {
    return;
  }
  data.result.map((s) => {
    if (s._id.approved) {
      data.result.approved = s.total;
    } else if (s._id.rejected) {
      data.result.rejected = s.total;
    } else if (s._id.pending) {
      data.result.pending = s.total;
    } else {
      data.result.noKyc = s.total;
    }
  });
  const { approved, rejected, pending, noKyc } = data.result;
  return {
    approved,
    rejected,
    pending,
    noKyc
  };
};
