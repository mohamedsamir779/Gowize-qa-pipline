import * as axiosHelper from "../api_helper";

export const getSystemEmailConfigurations = async () => {
  const data = await axiosHelper.get("/email-config");
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};

export const saveEmailConfiguration = async ({ payload }) => {
  const data = await axiosHelper.post("/email-config", payload);
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};

export const changeActiveEmailConfiguration = async ({ payload }) => {
  const data = await axiosHelper.post("/email-config/active", payload);
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};

export const testEmailConfiguration = async ({ payload }) => {
  const data = await axiosHelper.post("/email-config/test", payload);
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};

// Notification Groups

export const getNotificationGroups = async () => {
  const data = await axiosHelper.get("/notification-groups");
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};

export const updateNotificationGroups = async ({ payload }) => {
  const data = await axiosHelper.post("/notification-groups", payload);
  if (data.isError){
    throw new Error(data.isError);
  }
  return data;
};