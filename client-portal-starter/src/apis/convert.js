import * as axiosHelper from "./api_helper";
import qs from "qs";

export const convertAPI = async ({ payload }) => {
  const res = await axiosHelper.post("/convert", payload);
  if (res.status)
    return res;
  else
    throw new Error(res.message);
};

export const previewConversionAPI = async ( payload )=>{
  const body = {
    from:payload.fromAsset,
    to:payload.toAsset
  };
  const res = await axiosHelper.get(`/convert/preview?${qs.stringify(body)}`);
  if (res.status)
    return res;
  else
    throw new Error(res.message);
};