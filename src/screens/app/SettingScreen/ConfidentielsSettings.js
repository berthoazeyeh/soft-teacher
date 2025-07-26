import React, { useState } from "react";
import Icon from "react-native-vector-icons/MaterialIcons";
import { View, Text, StyleSheet, Switch } from "react-native";
import { showCustomMessage, Theme } from "utils";
import { Header } from "components";
import whitPropsAll from "./whitPropsAll";

const ConfidentielsSettings = ({
  theme,
  navigation,
  I18n,
  onSettings,
  settings,
}) => {
  const [selectedNotifications, setSelectedNotifications] = useState({
    alerts: false,
    updates: false,
    promotions: false,
  });

  const notificationOptions = [
    { label: I18n.t("SettingsScreen.notifications.alerts"), key: "alert", value: settings?.alert },
    { label: I18n.t("SettingsScreen.notifications.courses"), key: "cources", value: settings?.cources },
    { label: I18n.t("SettingsScreen.notifications.badging"), key: "badging", value: settings?.badging },
    { label: I18n.t("SettingsScreen.notifications.updates"), key: "update", value: settings?.update },
  ];

  const toggleNotification = (key) => {
    const updatedSettings = { ...settings, [key]: !settings[key] };
    onSettings(updatedSettings);
    showCustomMessage(
      "success",
      I18n.t("SettingsScreen.notifications.successMessage"),
      "success"
    );
  };

  const {
    privacyTitle,
    notificationsTitle,
  } = I18n.t("SettingsScreen");

  return (
    <View style={styles(theme).container}>
      <View style={{ height: 45 }}>
        <Header title={privacyTitle} navigation={navigation} theme={theme} />
      </View>
      <View style={{ padding: 5, flex: 1 }}>
        <Text style={styles(theme).sectionTitle}>{notificationsTitle}</Text>
        {notificationOptions.map((option) => (
          <View key={option.key} style={styles(theme).notificationRow}>
            <Text style={styles(theme).primaryText}>{option.label}</Text>
            <Switch
              value={option.value}
              onValueChange={() => toggleNotification(option.key)}
              thumbColor={option.value ? theme.primary : "#ccc"}
              trackColor={{ false: "#767577", true: theme.primaryLight }}
            />
          </View>
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
    sectionTitle: {
      fontSize: 20,
      ...Theme.fontStyle.inter.semiBold,
      marginVertical: 10,
      color: theme.primaryText,
    },
    primaryText: {
      fontSize: 14,
      ...Theme.fontStyle.inter.regular,
      color: theme.primaryText,
    },
    notificationRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
      marginVertical: 5,
      backgroundColor: theme.gray,
      borderRadius: 10,
    },
  });

export default whitPropsAll(ConfidentielsSettings);