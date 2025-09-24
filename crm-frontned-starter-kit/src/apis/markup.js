import * as axiosHelper from "./api_helper";

export const updateMarkup = async ({ payload }) => {
  const { id, values } = payload;
  const data = await axiosHelper.patch(`/markups/${id}`, {
    title: values.title,
    isPercentage: values.isPercentage,
    value: values.value,
    markets: values.markets,
  }, { crypto: false });

  if (data.isError) {
    throw new Error(data.message);
  }
  if (data.code === 500) {
    throw new Error("Please Enter Valid data");
  }
  return data;
};

export const deleteMarkupAPI = async (id) => {
  const result = await axiosHelper.del(`/markups/${id}`, {
    crypto: false
  });
  if (result.isError){
    throw new Error(result.message);
  }
  return result;
};

export const addMarkupAPI = async (values) => {
  const data = await axiosHelper.post("/markups/", values, { crypto: false });
  if (data.isError)
    throw new Error(data.message);
  if (data.code === 500) {
    throw new Error("Please Enter Valid data");
  }
  return data;
};