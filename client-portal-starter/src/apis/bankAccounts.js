import qs from "qs";
import * as axiosHelper from "./api_helper";

export const fetchBankAccountsAPI = async ({ payload }) => {
  const result = await axiosHelper.get(
    `/bank-accounts/?${qs.stringify(payload)}`
  );
  if (result.status) return result.result;
  else throw new Error(result.message);
};

export const fetchCompanyBankAccounts = async () => {
  const result = await axiosHelper.get("/company-bank-accounts/");
  if (result.status) return result.result.docs;
  else throw new Error(result.message);
};

export const addBankAccount = async (values) => {
  // const { id, values } = payload;
  const data = await axiosHelper.post("bank-accounts/", values);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
};
export async function updateBankAccount({ body, id }) {

  const data = await axiosHelper.patch(`/bank-accounts/${id}`, body);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
}

export async function deleteBankAccount(id) {
  const data = await axiosHelper.del(`/bank-accounts/${id}`);
  if (data.isError) {
    throw new Error(data.message);
  }
  return data;
}