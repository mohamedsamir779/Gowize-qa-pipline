import * as axiosHelper from "./api_helper";

export async function getProfile() {
  const result = await axiosHelper.get("/auth/profile");
  if (result.code === 401) {
    throw new Error("You are not authorized");
  }
  return result;
}
export const saveEmailConfiguration = async ({ payload }) => {
  const data = await axiosHelper.post("/users/email-config", payload);
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};

export const changeActiveEmailConfiguration = async ({ payload }) => {
  const data = await axiosHelper.post("/users/email-config/active", payload);
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};

export const testEmailConfiguration = async ({ payload }) => {
  const data = await axiosHelper.post("/users/email-config/test", payload);
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};
