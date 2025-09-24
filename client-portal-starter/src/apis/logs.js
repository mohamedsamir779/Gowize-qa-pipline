
import qs from "qs";
import * as axiosHelper from "./api_helper";

export async function getLogs(params){
  const result = await axiosHelper.get(`/logs?${qs.stringify(params)}`);
  if (result.status){
    return result;
  } else throw new Error(result.message);
}
