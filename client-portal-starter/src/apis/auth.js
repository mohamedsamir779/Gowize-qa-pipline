
 
import * as axiosHelper from "./api_helper";

export const loginUserAPI = async(values) => {
  const data = await axiosHelper.loginApi("/auth/login", values, {
    headers: {
      Authorization: "",
    }
  });
  if (data.isError) {
    return data;
  } 
  return data;
};
export const getProfileData = async () => { 
  const data = await axiosHelper.get("/auth/profile");
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const forgotPassword = async ({ email }) => { 
  const data = await axiosHelper.patch("/customer/forgot-password", { email });
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const changePasswordWithOldPassword = async (payload) => {
  const data = await axiosHelper.patch("/customer/change-password", payload);
  return data;
};

export const verifyCodeAPI = async (params)=>{
  const result = await axiosHelper.post("/auth/verify_otp", {
    token: params.token,
    email: params.email,
    ...params,
  });
  if (result.isError)
    throw new Error(result.message);
  else return result;
};

export const verifyFirstCodeAPI = async (params)=>{
  const result = await axiosHelper.post("/auth/verify_first_otp", { token:params });
  if (result.isError)
    throw new Error(result.message);
  else return result;
};

export const generateQRCodeAPI = async ()=>{
  const result = await axiosHelper.get("/auth/generateQR");
  if (result.isError)
    throw new Error(result.message);
  else return result;
};