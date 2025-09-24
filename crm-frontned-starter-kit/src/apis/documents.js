import * as axiosHelper from "./api_helper";
export const uploadDocuments = async ({ clientId, formData })=>{
  const data = await axiosHelper.postFormData(`/documents/${clientId}`, formData);
  if (data.isError) {
    throw new Error(data.message);
  } 
  return data;
};
export const getDocuments = async ({ payload })=>{
  const data = await axiosHelper.get(`/documents/${payload}`);
  return data;
};
export const changeStatusDocuments = async ({ customerId, documentId, status, rejectionReason = "" })=>{
  const data = await axiosHelper.post(`/documents/${customerId}/${status}/${documentId}`, {
    rejectionReason
  });
  if (data.isError) {
    throw new Error(data.message);
  } 
  return data;
};

export const deleteDocument = async ({ customerId, documentId })=>{
  const data = await axiosHelper.del(`/documents/${customerId}/${documentId}`, {});
  if (data.isError) {
    throw new Error(data.message);
  } 
  return data;
};
