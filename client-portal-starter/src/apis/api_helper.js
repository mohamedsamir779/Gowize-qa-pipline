/* eslint-disable no-debugger */
import axios from "axios";
import { defaultPortal } from "config";
import * as url from "./url_helper";

export const setUser = (user) => {
  localStorage.setItem("PORTAL", user.defaultPortal || defaultPortal);
  localStorage.setItem("authUser", JSON.stringify(user));
};

const getToken = () => {
  try {
    const authUser = JSON.parse(localStorage.getItem("authUser"));
    return authUser?.token || "";
  } catch (error) {
    throw new Error(error);
  }
};

export const redirectToLogin = function () {
  return window.location.replace(url.LOGIN);

};

//apply base url for axios
const API_URL = `${process.env.REACT_APP_API_CP_DOMAIN}/api/v1/cp`;

const axiosApi = axios.create({
  baseURL: API_URL,
});

const setHeaderAuth = () => {
  axiosApi.defaults.headers.common["Authorization"] = `Bearer ${getToken()}`;
};
// axiosApi.interceptors.response.use(
//   response => response,
//   error => Promise.reject(error)
// );

const apiErrorHandler = (errObj) => {
  if (errObj.response && errObj.response.data) {
    if (errObj.response.data.code === 401) {
      localStorage.removeItem("authUser");
      redirectToLogin();
    }
    return errObj.response.data;
  }
  return errObj;
};

export async function get(url, config = {}) {
  setHeaderAuth();
  const path = `${url}`;
  return await axiosApi.get(path, { ...config }).then(response => response.data).catch(err => apiErrorHandler(err));
}

export async function post(url, data, config = {}) {
  console.log("Post body: ",  
  {
    url, 
    data
   });
  setHeaderAuth();
  const path = `${url}`;
  console.log({ path });
  return axiosApi
    .post(path, { ...data }, { ...config })
    .then(response => {
      return response.data;
    }).catch(err => apiErrorHandler(err));
}

export async function patch(url, data, config = {}) {
  setHeaderAuth();
  const path = `${url}`;
  return axiosApi
    .patch(path, { ...data }, { ...config })
    .then(response => {
      return response.data;
    }).catch(err => apiErrorHandler(err));
}

export async function put(url, data, config = {}) {
  setHeaderAuth();
  const path = `${url}`;
  return axiosApi
    .put(path, { ...data }, { ...config })
    .then(response => response.data).catch(err => apiErrorHandler(err));
}

export async function del(url, config = {}) {
  setHeaderAuth();
  const path = `${url}`;
  return await axiosApi
    .delete(path, { ...config })
    .then(response => response.data).catch(err => apiErrorHandler(err));
}

export async function loginApi(url, data, config = {}) {
  setHeaderAuth();
  const res = await post(url, data, config);
  if (res && res.result && res.result.token) {
    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${res.result.token}`;
  }
  return res;
}

export async function postFormData(url, data) {
  setHeaderAuth();
  const path = `${url}`;
  return axiosApi({
    method: "post",
    url: path,
    data,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then(function (response) {
    return response.data;
  }).catch(err => apiErrorHandler(err));
}

export const GetToken = getToken;