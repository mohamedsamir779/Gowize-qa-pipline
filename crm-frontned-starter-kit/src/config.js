module.exports = {
  google: {
    API_KEY: "",
    CLIENT_ID: "",
    SECRET: "",
  },
  facebook: {
    APP_ID: "",
  },
  devMode: process.env.REACT_APP_DEV_MODE === "true" || false,
  enableFX: process.env.REACT_APP_ENABLE_FX === "true" || true,
  enableCrypto: process.env.REACT_APP_ENABLE_CRYPTO === "true" || false,
  enableIB: process.env.REACT_APP_ENABLE_IB === "true" || false,
  enableGold: process.env.REACT_APP_ENABLE_GOLD === "true" || false,
  enableMM: process.env.REACT_APP_ENABLE_MM === "true" || false,
  defaultPortal: process.env.REACT_APP_DEFAULT_PORTAL || "FOREX",

};
