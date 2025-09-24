import * as axiosHelper from "./api_helper";
import qs from "qs";

export const getClients = async ({ payload }) => {
  const data = await axiosHelper.get(`/clients?${qs.stringify(payload)}`);
  if (data.isError) {
    throw new Error(data.isError);
  }
  return data;
};

export const addClient = async (values) => {
  const data = await axiosHelper.post("/clients", { ...values });
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const addIb = async (values) => {
  const data = await axiosHelper.post("/clients/ib", { ...values });
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

export const getClientById = async ({ payload }) => {
  const id = payload;
  const data = await axiosHelper.get(`/clients/${id}?data=stages`);
  if (data.isError) {
    throw new Error(data.isError);
  }

  return data;
};

export const updateClientDetails = async ({ payload }) => {
  const { id, values, corporatePersonnel } = payload;
  const data = await axiosHelper.patch(`/clients/${id}`, {
    ...values,
    corporatePersonnel
  });
  if (data.isError) {
    throw new Error(data.isError);
  }

  return data;
};

export const updateClientEmploymentStatus = async (payload) => {
  const { id, values } = payload;
  const data = await axiosHelper.patch(`/clients/${id}/experience`, { experience: { ...values } });
  const { isError } = data;
  if (isError) {
    throw new Error("An Error Happened while updating employment Info");
  }
  return data;
};

export const updateClientFinancialInfo = async (payload) => {
  const { id, values } = payload;
  const data = await axiosHelper.patch(`/clients/${id}/financial-info`, { financialInfo: { ...values } });
  const { isError } = data;
  if (isError) {
    throw new Error("Error Happened while updating financial Info");
  }
  return data;
};

export const resetPassowrd = async (payload) => {
  const { id, values } = payload;
  const data = await axiosHelper.post(`/clients/${id}/reset-password`, values);
  const { isError } = data;
  if (isError) {
    throw new Error("Error happened while reseting password");
  }
  return data;
};

export const forgotPassword = async (payload) => {
  const { id, email } = payload;
  const data = await axiosHelper.post(`/clients/${id}/forgot-password`, { email });
  if (data.message == "Error Sending email") {
    throw new Error("Error Sending Email");
  }
  return data;
};

export const disable2FA = async (payload) => {
  const { id } = payload;
  const res = await axiosHelper.post("/clients/disable-2fa", { customerId: id });
  if (res.status)
    return res.status;
  else throw new Error(res.message);
};

export const checkClientEmailApi = async (payload) => {
  const result = await axiosHelper.get(`/clients/check-email?${qs.stringify(payload, { encode: false })}`);
  return result;
};

// ib

export const getReferrals = async ({ payload }) => {
  const { clientId } = payload;
  delete payload.clientId;
  const data = await axiosHelper.get(`/ib/referrals/${clientId}?${qs.stringify(payload)}`);
  if (data.isError) {
    throw new Error(data.isError);
  }
  return data;
};

export const getIbParents = async ({ payload }) => {
  const { clientId } = payload;
  const data = await axiosHelper.get(`/ib/parents/${clientId}`);
  if (data.isError) {
    throw new Error(data.isError);
  }
  return data;
};

export const getStatement = async ({ payload }) => {
  const data = await axiosHelper.get(`/ib/statement?${qs.stringify(payload)}`);
  if (data.isError) {
    throw new Error(data.isError);
  }
  return data;
};

export const getStatementDeals = async ({ payload }) => {
  const data = await axiosHelper.get(`/ib/statement/deals?${qs.stringify(payload)}`);
  if (data.isError) {
    throw new Error(data.isError);
  }
  return data;
};

export const linkClient = async (payload) => {
  const { clientId } = payload;
  delete payload.clientId;
  const data = await axiosHelper.patch(`/ib/link-client/${clientId}/`, payload);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};

//convert clients apis 

export const convertToIB = async (payload) => {
  const { id } = payload;
  const res = await axiosHelper.patch(`/clients/${id}/convert/ib`);
  if (res.status)
    return res.status;
  else throw new Error(res.message);
};

export const unlinkIb = async (payload) => {
  const { clientId } = payload;
  delete payload.clientId;
  const data = await axiosHelper.patch(`/ib/unlink-ib/${clientId}/`);
  if (data.isError) {
    throw new Error(data.isError);
  }
  return data;
};

export const unlinkClients = async (payload) => {
  const data = await axiosHelper.patch("/ib/unlink-clients/", payload);
  if (data.isError) {
    throw new Error(data.isError);
  }
  return data;
};

export const convertToClient = async (payload) => {
  const { clientId } = payload;
  const res = await axiosHelper.patch(`/clients/${clientId}/convert/live`);
  if (res.status)
    return res.status;
  else throw new Error(res.message);
};

export const getMT5Markups = async (payload) => {
  const { clientId } = payload || {};
  const res = await axiosHelper.get(`/clients/${clientId}/mt5-markups`);
  if (res.status) {
    return res;
  }
  else {
    throw new Error(res.message);
  }
};

export const updateCallStatus = async (payload) => {
  const { clientId, callStatus } = payload || {};
  const res = await axiosHelper.patch(`/clients/${clientId}/call-status`, { callStatus });
  if (res.status) {
    return res;
  }
  else {
    throw new Error(res.message);
  }
};

export const getClientGroups = async () => {
  const data = await axiosHelper.get("/clients/count-client-groups");
  if (data.isError) {
    throw new Error(data.mesage);
  }
  return data.result;
};
