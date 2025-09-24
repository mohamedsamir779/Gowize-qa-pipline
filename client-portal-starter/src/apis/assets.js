import * as axiosHelper from "./api_helper";

export const getAssets = async () => {
  const result = await axiosHelper.get("/asset/all");
  if (result.status)
    return result.result;
  else throw new Error(result.message);
};
