
import * as axiosHelper from "./api_helper";

export const subscribePushNotification = async (payload) => {
  const data = await axiosHelper.post("/subscriptions/push-notification", payload);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const unsubscribePushNotification = async (endpoint) => {
  const data = await axiosHelper.del("/subscriptions/push-notification", {
    data: {
      endpoint
    }
  });
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};