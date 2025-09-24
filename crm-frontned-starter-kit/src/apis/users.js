

import qs from "qs";
import * as axiosHelper from "./api_helper";

export const getUsers = async ({ payload }) => {
  const data = await axiosHelper.get(`/users?${qs.stringify(payload)}`);
  return data.result;
};
export const getAssignedUsers = async ({ payload }) => {
  const data = await axiosHelper.get(`/users/assignable?${qs.stringify(payload)}`);
  return data;
};
export const getRoles = async ({ payload }) => {
  const data = await axiosHelper.get(`/roles?${qs.stringify(payload)}`);
  return data.result;
};
export const addUser = async ({ payload }) => {
  const data = await axiosHelper.post("/users", payload);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const editUser = async ({ payload }) => {
  const { id, values } = payload;
  const data = await axiosHelper.patch(`/users/${id}`, values);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const editUserPass = async ({ payload }) => {
  const { id, values } = payload;
  const data = await axiosHelper.patch(`/users/${id}/password`, values);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const resetUserPass = async ({ payload }) => {
  const { id, values } = payload;
  const data = await axiosHelper.patch(`/users/${id}/password-change`, values);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const deleteUser = async ({ payload }) => {
  const data = await axiosHelper.del(`/users/${payload}`);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const assignSalesAgent = async ({ payload }) => {
  // /users for multiple assigns from client list, /clients for single change from client profile
  const url = payload?.clientId ? "/clients/assign" : "/users/assign";
  const data = await axiosHelper.post(url, payload);
  return data;
};

export const checkUserEmailApi = async (payload) => {
  const data = await axiosHelper.get(`/users/check-email?${qs.stringify(payload, { encode: false })}`);
  return data;
};

export const disable2FA = async (payload) => {
  const { id } = payload;
  const res = await axiosHelper.post("/users/disable-2fa", { userId: id });
  if (res.status)
    return res.status;
  else throw new Error(res.message);
};

export const editTarget = async (payload) => {
  const res = await axiosHelper.patch("/target/", payload);
  if (res.status)
    return res.result;
  else throw new Error(res.message);
};

export const getTarget = async (payload) => {
  const res = await axiosHelper.get(`/target?${qs.stringify(payload)}`);
  if (res.status)
    return res.result;
  else throw new Error(res.message);
};

export const getCanBeAssignedUserTargets = async () => {
  const res = await axiosHelper.get("/target/all");
  if (res.status)
    return res.result;
  else throw new Error(res.message);
};

export const editAllTargets = async (payload) => {
  const res = await axiosHelper.patch("/target/all", payload);
  if (res.status)
    return res.result;
  else throw new Error(res.message);
};

export const editUserSettings = async (payload) => {
  const res = await axiosHelper.patch("/users/settings", payload);
  if (res.status)
    return res.result;
  else throw new Error(res.message);
};

export const sendUserEmail = async (payload) => {
  const res = await axiosHelper.post("/users/send-email", payload);
  if (res.status)
    return res.result;
  else throw new Error(res.message);
};