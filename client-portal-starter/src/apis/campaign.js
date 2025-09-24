
import * as axiosHelper from "./api_helper";

export function unsubscribe(payload) {
  return axiosHelper.post("/campaign-unsubscribers/unsubscribe", payload);
}
