import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";
import { useTranslation } from 'react-i18next';
import { useLanguage } from "../src/hooks/useLanguage";

export default function Settings() {
  const { language, changeLanguage } = useLanguage();

  const { t } = useTranslation();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const languages = [
    { code: "en", label: "English" },
    { code: "it", label: "Italiano" },
    { code: "eo", label: "Esperanto" },
    { code: "es", label: "Español (Castellano)" },
  ];

  const handleLanguageChange = async (selectedLanguage: string) => {
    changeLanguage(selectedLanguage);
    setIsDropdownOpen(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("settings.selectLanguage")}</Text>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Text style={styles.dropdownText}>
          {languages.find((lang) => lang.code === language)?.label}
        </Text>
      </TouchableOpacity>

      {isDropdownOpen && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={isDropdownOpen}
          onRequestClose={() => setIsDropdownOpen(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setIsDropdownOpen(false)}
          >
            <View style={styles.modalContent}>
              <FlatList
                data={languages}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => handleLanguageChange(item.code)}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: 200,
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 16
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: 250,
  },
  modalItem: {
    paddingVertical: 10,
  },
  modalItemText: {
    fontSize: 16,
    textAlign: "center",
  },
});
