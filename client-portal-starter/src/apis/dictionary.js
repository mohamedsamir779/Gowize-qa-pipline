import * as axiosHelper from "./api_helper";
// import qs from "qs";

export const getDictionary = async()=>{
  try {
    const dictionary = await axiosHelper.get("/dictionaries");
    return dictionary;
  } catch (error){
    throw new Error("Error happened while fetching dictionary");
  }
   
};