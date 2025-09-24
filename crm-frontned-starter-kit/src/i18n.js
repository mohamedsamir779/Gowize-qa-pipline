import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import backend from "i18next-http-backend";

import translationGr from "./locales/gr/translation.json";
import translationIT from "./locales/it/translation.json";
import translationRS from "./locales/rs/translation.json";
import translationSP from "./locales/sp/translation.json";
import translationENG from "./locales/eng/translation.json";
import translationAR from "./locales/ar/translation.json";

// the translations
const resources = {
  gr: {
    translation: translationGr,
  },
  it: {
    translation: translationIT,
  },
  rs: {
    translation: translationRS,
  },
  sp: {
    translation: translationSP,
  },
  eng: {
    translation: translationENG,
  },
  ar: {
    translation: translationAR,
  }
};

const API_URL = process.env.REACT_APP_API_CRM_DOMAIN || "http://localhost:3001";

const language = localStorage.getItem("I18N_LANGUAGE");
if (!language) {
  localStorage.setItem("I18N_LANGUAGE", "en");
}

i18n
  .use(detector)
  .use(backend)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // resources,
    // lng: localStorage.getItem("I18N_LANGUAGE") || "en",
    
    // keySeparator: false, // we do not use keys in form messages.welcome
    
    // interpolation: {
    //   escapeValue: false, // react already safes from xss
    // },
    fallbackLng: "en", // use en if detected lng is not available
    saveMissing: true,
    backend: {
      // backend,
      loadPath: `${API_URL}/locales/{{lng}}/{{ns}}.json`,
      addPath: `${API_URL}/locales/add/{{lng}}/{{ns}}`,
      crossDomain: true,
    }
  });

export default i18n;
