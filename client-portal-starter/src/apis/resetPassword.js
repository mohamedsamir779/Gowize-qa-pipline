import * as axiosHelper from "./api_helper";
export const resetpassword = async (payload)=>{
  let config = {
    headers: {
      Authorization: `Bearer ${payload.token}`,
    }
  };
  delete payload.token;
  const data = await axiosHelper.patch("/customer/reset-password", payload, config);
  return data;
};