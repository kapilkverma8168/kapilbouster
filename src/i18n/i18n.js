import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import hi from "./hi.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export const grabTheValue = (key) => {
  let keyChange = key.split(" ").join("-");
  let value = i18n.t(keyChange);
  return value;
};

export default i18n;
