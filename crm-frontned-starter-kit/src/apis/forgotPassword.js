import * as axiosHelper from "./api_helper";

export const forgotPassword = async ({ email }) => { 
  const data = await axiosHelper.patch("/users/forgot-password", { email });
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};