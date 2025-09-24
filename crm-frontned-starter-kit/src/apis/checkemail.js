import * as axiosHelper from "./api_helper";
export const checkClientEmailApi = async (email)=>{
  try {
    const result = await axiosHelper.get(`/clients/check-email?email=${email}`);
    return result;
  } catch (err){
    throw new Error(err.message);
  }
};

export const checkLeadEmailApi = async (email)=>{
  try {
    const result = await axiosHelper.get(`/leads/check-email?email=${email}`);
    return result;
  } catch (err){
    throw new Error(err.message);
  }
};