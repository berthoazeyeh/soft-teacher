import React from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { showCustomMessage, Theme } from "utils";
import { Header } from "components";
import whitPropsAll from "./whitPropsAll";

const languageListData = [{ language: "English", value: "en" }, { language: "French", value: "fr" }];

const LanguageSettings = ({
  theme,
  navigation,
  selectedLanguage,
  onLanguageSelect,
  I18n
}) => {
  const handleUpdateLanguage = (languageSelected, label) => {
    onLanguageSelect(languageSelected);
    const {
      toastMessages,
    } = I18n.t("SettingsScreen.languageSettings");
    console.log(`${toastMessages[0]} ${languageSelected}`);
    const text = `${toastMessages[0]} ${label}`;
    showCustomMessage("Success", text?.toString(), "success");
  };
  const { languageTitle
  } = I18n.t("SettingsScreen");


  return (
    <View style={styles(theme).container}>
      <View style={{ height: 45 }}>
        <Header title={languageTitle} navigation={navigation} theme={theme} />
      </View>
      <View style={{ padding: 5, flex: 1 }}>
        {languageListData.map((item, index) => (
          <TouchableOpacity
            key={index}
            activeOpacity={0.9}
            style={styles(theme).button}
            hitSlop={{ top: 15, bottom: 15, left: 0, right: 0 }}
            onPress={() => handleUpdateLanguage(item.value, item.language)}
          >
            <Icon
              name={
                selectedLanguage === item.value
                  ? "radio-button-checked"
                  : "radio-button-unchecked"
              }
              size={27}
              color={selectedLanguage === item.value ? theme.primary : theme.primaryText}
              style={styles(theme).iconSpacing}
            />
            <Text style={styles(theme).primaryText}>{item.language}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column",
      justifyContent: "flex-start",
      backgroundColor: theme.primaryBackground,
    },
    button: {
      padding: 10,
      height: 50,
      margin: 10,
      borderRadius: 10,
      alignItems: "center",
      flexDirection: "row",
      elevation: 2,
      zIndex: 2,
      backgroundColor: theme.primaryBackground
    },
    primaryText: {
      fontSize: 18,
      fontWeight: "400",
      ...Theme.fontStyle.montserrat.semiBold,
      color: theme.primaryText,
    },
    iconSpacing: {
      marginRight: 10,
    },
  });

export default whitPropsAll(LanguageSettings);
