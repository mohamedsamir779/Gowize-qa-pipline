import * as axioHelper from "./api_helper";
import qs from "qs";

export async function fetchIbAgreements(payload) {
  try {
    const result = await axioHelper.get(`/ibagrements/?${qs.stringify(payload)}`);
    return result;
  } catch (error) {
    throw new Error("Error while fetching IB agreements.");
  }
}

export async function fetchIbProducts() {
  try {
    const result = await axioHelper.get("/ibagrements/products");
    return result;
  } catch (error) {
    throw new Error("Error while fetching IB Product data.");
  }
}

export async function postMasterIb(values) {
  try {
    const result = await axioHelper.post("/ibagrements/master", values);
    return result;
  } catch (error) {
    throw new Error("Error while posting master IB agreement.");
  }
}

export async function patchMasterIb(payload) {
  const { id } = payload;
  delete payload.id;
  try {
    const result = await axioHelper.patch(`/ibagrements/master/${id}`, payload);
    return result;
  } catch (error) {
    throw new Error("Error while editing master IB agreement.");
  }
}

export async function postSharedIb(values) {
  try {
    const result = await axioHelper.post("/ibagrements/shared", values);
    return result;
  } catch (error) {
    throw new Error("Error while posting shared IB agreement.");
  }
}

export async function patchSharedIb(payload) {
  const { id } = payload;
  delete payload.id;
  try {
    const result = await axioHelper.patch(`/ibagrements/shared/${id}`, payload);
    return result;
  } catch (error) {
    throw new Error("Error while editing shared IB agreement.");
  }
}

export const deleteIbAgreement = async ({ id })=>{
  try {
    const result = await axioHelper.del(`/ibagrements/${id}`);
    if (result?.isError) {
      throw new Error(result?.message ?? "Error while deleting IB agreement.");
    }
  } catch (error) {
    throw new Error (error?.message ?? "Error while deleting IB agreement.");
  }
};
