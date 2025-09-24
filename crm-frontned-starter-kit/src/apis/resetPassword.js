import * as axiosHelper from "./api_helper";

export const resetPassword = async (payload) => { 
  let config = {
    headers: {
      Authorization: `Bearer ${payload.token}`,
    }
  };
  delete payload.token;
  const data = await axiosHelper.patch("/users/reset-password", payload, config);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};