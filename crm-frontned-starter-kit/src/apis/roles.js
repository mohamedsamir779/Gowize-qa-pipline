

import qs from "qs";
import * as axiosHelper from "./api_helper";

export const getRoles = async({ payload }) => {
  const data = await axiosHelper.get(`/roles?${qs.stringify(payload)}`);
  return data.result;
};

export const addRole = async({ payload }) => {
  const data = await axiosHelper.post("/roles", payload);
  if (data.isError) {
    throw new Error(data.message);
  } 
  return data;
};

export const editRole = async({ payload }) => {
  const { id, values } = payload;
  const data = await axiosHelper.patch(`/roles/${id}`, values);
  if (data.isError) {
    throw new Error(data.message);
  } 
  return data;
};

export const deleteRole = async({ payload }) => {
  const data = await axiosHelper.del(`/roles/${payload}`);
  if (data.isError) {
    throw new Error(data.message);
  } 
  return data;
};

export const changeStatusRole = async({ payload }) => {
  const data = await axiosHelper.post(`/roles/${payload.id}/${payload.status}`);
  if (data.isError) {
    throw new Error(data.message);
  } 
  return data;
};