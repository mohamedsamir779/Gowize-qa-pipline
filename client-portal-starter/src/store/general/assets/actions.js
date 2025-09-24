import { FETCH_ASSETS_START, FETCH_ASSETS_SUCCESS } from "./actionTypes";

export const fetchAssets = (payload) => {
  return {
    type: FETCH_ASSETS_START,
    payload
  };
};
export const getAssetsSuccess = (payload) => {
  return {
    type: FETCH_ASSETS_SUCCESS,
    payload
  };
};