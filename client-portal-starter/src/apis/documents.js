import * as axiosHelper from "./api_helper";

export const getDocuments = async ()=>{
  const data = await axiosHelper.get("/documents");
  return data;
};

export const uploadDocuments = async (payload)=>{
  const data = await axiosHelper.postFormData("/documents", payload);
  if (data.status) {
    return data;
  }
  
  throw new Error(data.message);
};
