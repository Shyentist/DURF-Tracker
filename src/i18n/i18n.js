import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from '../../locales/en/translation.json';
import it from '../../locales/it/translation.json';
import eo from "../../locales/eo/translation.json";
import es from "../../locales/es/translation.json";

// Retrieve the array of locales
const locales = Localization.getLocales();

// Check if locales array is not empty and get the first locale's language code
const languageCode = locales.length > 0 ? locales[0].languageCode : 'en';

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    lng: languageCode, // Set the language code
    resources: {
      en: { translation: en },
      it: { translation: it },
      eo: { translation: eo },
      es: { translation: es },
    },
    interpolation: {
      escapeValue: false, // React already escapes values to prevent XSS
    },
  });

export default i18n;
