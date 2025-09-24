import {
  REGISTER_LIVE_USER,
  REGISTER_LIVE_USER_SUCCESSFUL,
  REGISTER_LIVE_USER_FAILED,
  REGISTER_DEMO_USER,
  REGISTER_DEMO_USER_SUCCESSFUL,
  REGISTER_DEMO_USER_FAILED,

  REGISTER_FOREX_LIVE_USER_REQUESTED,
  REGISTER_FOREX_LIVE_USER_SUCCESS,
  REGISTER_FOREX_LIVE_USER_FAIL,

  REGISTER_FOREX_DEMO_USER_REQUESTED,
  REGISTER_FOREX_DEMO_USER_SUCCESS,
  REGISTER_FOREX_DEMO_USER_FAIL,

  REGISTER_FOREX_IB_USER_REQUESTED,
  REGISTER_FOREX_IB_USER_SUCCESS,
  REGISTER_FOREX_IB_USER_FAIL
} from "./actionTypes";

export const registerLiveUser = user => {
  return {
    type: REGISTER_LIVE_USER,
    payload: { user },
  };
};

export const registerLiveUserSuccessful = user => {
  return {
    type: REGISTER_LIVE_USER_SUCCESSFUL,
    payload: user,
  };
};

export const registerLiveUserFailed = user => {
  return {
    type: REGISTER_LIVE_USER_FAILED,
    payload: user,
  };
};

export const registerDemoUser = user => {
  return {
    type: REGISTER_DEMO_USER,
    payload: { user },
  };
};

export const registerDemoUserSuccessful = user => {
  return {
    type: REGISTER_DEMO_USER_SUCCESSFUL,
    payload: user,
  };
};

export const registerDemoUserFailed = user => {
  return {
    type: REGISTER_DEMO_USER_FAILED,
    payload: user,
  };
};

// forex live 
export const registerForexLiveUser = (user) => {
  return {
    type: REGISTER_FOREX_LIVE_USER_REQUESTED,
    payload: { user },
  };
};
export const registerForexLiveUserSuccessful = (user) => {
  return {
    type: REGISTER_FOREX_LIVE_USER_SUCCESS,
    payload: user,
  };
};
export const registerForexLiveUserFailed = (user) => {
  return {
    type: REGISTER_FOREX_LIVE_USER_FAIL,
    payload: user,
  };
};

// forex demo
export const registerForexDemoUser = (user) => {
  return {
    type: REGISTER_FOREX_DEMO_USER_REQUESTED,
    payload: { user },
  };
};
export const registerForexDemoUserSuccessful = (user) => {
  return {
    type: REGISTER_FOREX_DEMO_USER_SUCCESS,
    payload: user,
  };
};
export const registerForexDemoUserFailed = (user) => {
  return {
    type: REGISTER_FOREX_DEMO_USER_FAIL,
    payload: user,
  };
};

// forex ib
export const registerForexIbUser = (user) => {
  return {
    type: REGISTER_FOREX_IB_USER_REQUESTED,
    payload: { user },
  };
};
export const registerForexIbUserSuccessful = (user) => {
  return {
    type: REGISTER_FOREX_IB_USER_SUCCESS,
    payload: user,
  };
};
export const registerForexIbUserFailed = (user) => {
  return {
    type: REGISTER_FOREX_IB_USER_FAIL,
    payload: user,
  };
};