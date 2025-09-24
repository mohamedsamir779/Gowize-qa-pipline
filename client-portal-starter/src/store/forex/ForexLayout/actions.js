import { CHANGE_FOREX_PORTAL } from "./actionTypes";

export const changeForexPortal = (portal) =>{
  return {
    type: CHANGE_FOREX_PORTAL,
    payload: portal
  };
};