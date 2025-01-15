import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../i18n/i18n";

export const useLanguage = () => {
  const [language, setLanguage] = useState<string | null>(null);

  // Load saved language on component mount
  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem("language");
      if (savedLanguage) {
        setLanguage(savedLanguage);
        i18n.changeLanguage(savedLanguage);
      }
    };
    loadLanguage();
  }, []);

  // Function to change language and save it
  const changeLanguage = async (lang: string) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    await AsyncStorage.setItem("language", lang);
  };

  return { language, changeLanguage };
};
