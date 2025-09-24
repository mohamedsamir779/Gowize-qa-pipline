import * as axiosHelper from "../api_helper";

export const requestPartnershipAPI = async () => {
  try {
    const result = await axiosHelper.post("/requests/ib");
    if (result.status) return result;
    else throw new Error(result.message);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getRequestTypeAPI = async () => {
  try {
    return await axiosHelper.get("/requests/ib");
  } catch (error) {}
};

export const postChangeLeverageReq = async (payload) => {
  const result = await axiosHelper.post("/requests/change-leverage", payload);
  if (result.status) {
    return result;
  } else {
    throw new Error(result.message);
  }
};

export const createAccountRequestAPI = async (params) => {
  try {
    return await axiosHelper.post("/requests/account", params);
  } catch (error) {
    throw new Error("Error while sending new account Request");
  }
};