import { CUSTOMER_SUB_PORTALS } from "common/constants";
import {
  CHANGE_FOREX_PORTAL,
}
  from "./actionTypes";

const initialState = {
  portal: CUSTOMER_SUB_PORTALS.LIVE
};

const ForexLayout = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_FOREX_PORTAL:
      return {
        ...state,
        portal: action.payload
      };
    default:
      return state = { ...state };
  }
};
export default ForexLayout;