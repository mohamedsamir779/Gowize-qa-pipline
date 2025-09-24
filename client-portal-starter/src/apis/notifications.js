
import QueryString from "qs";
import * as axiosHelper from "./api_helper";

export const fetchNotifications = async (payload) => {
  const data = await axiosHelper.get(`/notifications?${QueryString.stringify(payload)}`);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const markNotificationsRead = async (payload) => {
  const data = await axiosHelper.patch("/notifications/mark-read", payload);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};