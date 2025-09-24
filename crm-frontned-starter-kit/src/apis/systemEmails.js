import qs from "qs";
import * as axiosHelper from "./api_helper";

export const getSystemEmails = async ({ payload }) => {
  const data = await axiosHelper.get(`/systememail?${qs.stringify(payload)}`);
  if (data.isError){
    throw new Error(data.mesage);
  }
    
  return data.result;
};

export const getSystemEmailById = async ({ payload }) => {
  const id = payload;
  const data = await axiosHelper.get(`/systememail/${id}`);
  if (data.isError){
    throw new Error(data.message);
  }

  return data;
};

export const addSystemEmail = async({ payload }) => {
  const data = await axiosHelper.post("/systememail", payload);
  if (data.isError) {
    throw new Error(data.message);
  } 

  return data;
};

export const editSystemEmail = async ({ payload }) => {
  const { id, values } = payload;
  const data = await axiosHelper.patch(`/systememail/${id}`, values);
  if (data.isError){
    throw new Error(data.message);
  }

  return data;
};

export const editSystemEmailContent = async ({ payload }) => {
  const { id, values } = payload;
  const data = await axiosHelper.patch(`/systememail/${id}/content`, values);
  if (data.isError){
    throw new Error(data.message);
  }

  return data;
};

export const deleteSystemEmail = async ({ payload }) => {
  // here the payload is just the id for system email to be deleted 
  const data = await axiosHelper.del(`/systememail/${payload}`);
  if (data.isError){
    throw new Error(data.message);
  }
  
  return data;
};

export const fetchSystemEmailHTML = async ({ payload }) => {
  const { id, lang } = payload;
  const data = await axiosHelper.get(`/systememail/${id}/preview/${lang}`);
  if (data.isError){
    throw new Error(data.message);
  }

  return data;
};

export const changeSystemEmailStatus = async({ payload }) => {
  const { id, status } = payload;
  const data = await axiosHelper.post(`/systememail/${id}/${status}`);
  if (data.isError) {
    throw new Error(data.message);
  } 
  return data;
};

export const addUserTemplate = async(payload) => {
  const data = await axiosHelper.post("/systememail/user", payload);
  if (data.isError) {
    throw new Error(data.message);
  } 
  return data;
};

export const getUserTemplates = async () => {
  const data = await axiosHelper.get("/systememail/user");
  if (data.isError){
    throw new Error(data.mesage);
  }
  return data.result;
};
