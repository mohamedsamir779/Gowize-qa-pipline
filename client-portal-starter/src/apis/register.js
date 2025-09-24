import * as axiosHelper from "./api_helper";

export const registerLiveAPI = async (params) => {
  try {
    const { user } = params;
    const url = "/register/crypto/live";
    delete user.accountType;
    delete user.history;
    delete user.confirmPassword;
    delete user.search;
    const result = axiosHelper.post(url, user);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const registerDemoAPI = async(params) =>{
  try {
    const { user } = params;
    const url = "/register/crypto/demo";
    delete user.accountType;
    delete user.history;
    delete user.confirmPassword;
    delete user.search;
    const result = axiosHelper.post(url, user);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

// forex live
export const registerForexLiveAPI = async(params) =>{
  try {
    const { user } = params;
    let url = "/register/fx/live";
    if (user.isCorporate) {
      url = "/register/fx/corporate";
    }
    delete user.accountType;
    delete user.history;
    delete user.confirmPassword;
    delete user.search;
    const result = axiosHelper.post(url, user);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

// forex demo
export const registerForexDemoAPI = async(params) =>{
  try {
    const { user } = params;
    const url = "/register/fx/demo";
    delete user.accountType;
    delete user.history;
    delete user.confirmPassword;
    delete user.search;
    const result = axiosHelper.post(url, user);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

// demo ib
export const registerForexIbAPI = async(params) =>{
  try {
    const { user } = params;
    let url = "/register/fx/ib";
    if (user.isCorporate) {
      url = "/register/fx/corporate-ib";
    }
    delete user.accountType;
    delete user.history;
    delete user.confirmPassword;
    delete user.search;
    const result = axiosHelper.post(url, user);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const checkUserEmailApi = async (payload)=>{
  try {
    const { payload:{ email } } = payload ;
    const result = await axiosHelper.get(`/customer/check-email?email=${email}`);
    return result;
  } catch (err){
    throw new Error(err.message);
  }
};

export const sendEmailPinAPI = async ({ email })=>{
  try {
    const resp = await axiosHelper.post("/register/send-pin", {
      email: email,
    });
    if (resp.status) {
      return resp;
    }
    else return resp.message;
  } catch (error) {
    return error.message;
  }
};

export const verifyEmailPinAPI = async ({ email, emailPin })=>{
  try {
    const resp = await axiosHelper.post("/register/verify-pin", {
      email: email,
      emailPin: emailPin
    });
    if (resp.status) {
      return resp;
    }
    else return resp.message;
  } catch (error) {
    return error.message;
  }
};