import * as axiosHelper from "./api_helper";

export const getWallets = async () => {
  const data = await axiosHelper.get("/wallets");
  if (data.isError) {
    throw new Error(data.isError);
  }
  return data?.result;
};
export const addDeposit = async (values) => {
  // const { id, values } = payload;
  const data = await axiosHelper.postFormData("transactions/deposit/", values);
  // if (data.isError) {
  //   throw new Error(data.message);
  // }
  return data;
};
export const addForexDeposit = async (values) => {
  console.log("Forex deposit: ", { values });
  const data = await axiosHelper.postFormData("fxtransactions/deposits", values);
  return data;
};
// export const fetchwallets = async () => {
//     const data = await axiosHelper.get('wallets');
//     return data.result;
// }

export const paymentGatewayDeposit = async (values, paymentGateway) => {
  let url = "";
  switch (paymentGateway) {
    case "OLX_FOREX":
      url = "psp/olxforex/pay";
      break;
    case "FINITIC_PAY":
      url = "psp/finitic-pay/checkout";
      break;
    case "EPAYME": 
      url = "psp/epayme/pay";
      break;
    case "PAYMAXIS":
      url = "psp/paymaxis/pay";
      break;  
      case "VISA_MASTER":
      url = "psp/checkout/pay";
      break;
  }
  const data = await axiosHelper.post(url, values);
  return data;
};

export const getFiniticPayFeesConfig = async () => {
  const data = await axiosHelper.get("/psp/finitic-pay/fees");
  return data;
};
