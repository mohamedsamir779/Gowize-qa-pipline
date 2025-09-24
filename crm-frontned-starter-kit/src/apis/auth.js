
 
import * as axiosHelper from "./api_helper";

export const loginUser = async(values) => {
  const data = await axiosHelper.loginApi("/auth/login", values);
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

export const generateQRCodeAPI = async ()=>{
  const result = await axiosHelper.get("/auth/generateQR");
  if (result.isError)
    throw new Error(result.message);
  else return result;
};