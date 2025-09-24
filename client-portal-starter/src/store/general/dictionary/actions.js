import {
  FETCH_DICTIONARY_START,
  FETCH_DICTIONARY_END,
} from "./actionTypes";
  
export const fetchDictStart = ()=>{
  return {
    type:FETCH_DICTIONARY_START,
  };
};
export const fetchDictEnd = (data)=>{
  return {
    type:FETCH_DICTIONARY_END,
    payload: data
  };
};