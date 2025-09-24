import * as axiosHelper from "./api_helper";

export const fetchProfileAPI = async () => {
  const result = await axiosHelper.get("auth/profile");
  if (result.status)
    return result.result;
  else
    throw new Error(result.message);
};

export const editProfileAPI = async (user) => {
  const result = await axiosHelper.patch("customer/profile", user);
  if (result.status) {
    return result.message;
  }
  else throw new Error(result.message);
};

export const editProfileSettingsAPI = async (settings) => {
  const result = await axiosHelper.patch("customer/settings", settings);
  if (result.status) {
    return result.message;
  }
  else throw new Error(result.message);
};

export const submitProfileAPI = async (params) => {
  const result = await axiosHelper.post("customer/profile-submit", params);
  if (result.status) {
    return result.result;
  }
  else throw new Error(result.message);
};

export const convertProfileAPI = async () => {
  const result = await axiosHelper.get("/customer/convert");
  if (result.status) {
    return result;
  }

  throw new Error(result.message);
};

export const uploadPorfileAvatarAPI = async (params) => {
  const result = await axiosHelper.postFormData("/customer/profile-avatar", params);
  if (result.status) {
    return result;
  }

  throw new Error(result.message);
};