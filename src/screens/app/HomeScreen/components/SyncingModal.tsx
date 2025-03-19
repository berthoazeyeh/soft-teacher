import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import dynamicStyles from "../style";
import { useTheme } from "store";
import { bus, getRandomColor, profils, Theme } from "utils";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { I18n } from 'i18n';
import { Dialog, Divider, Portal } from "react-native-paper";
import moment from "moment";
import React from "react";

export const SyncingModal = ({ visible, index }: { visible: boolean, index: number }): React.JSX.Element => {
    const theme = useTheme()
    const SyncingModalLabels: any = I18n.t("SyncingModal");
    const styles = createStyles(theme);
    return <Portal>
        <Dialog
            visible={visible}
            dismissable={false}
            style={styles.dialog} >
            <Dialog.Content>
                <View style={{ paddingBottom: 9, }}>
                    <Text style={[{ color: theme.primaryText, ...Theme.fontStyle.inter.semiBold, fontSize: 18, textAlign: "center" }]}>
                        {SyncingModalLabels?.welcome_message}
                    </Text>
                    <Text style={[{ color: theme.primaryText, ...Theme.fontStyle.inter.regular, fontSize: 13, textAlign: "center" }]}>
                        {SyncingModalLabels?.loading_message}
                    </Text>
                </View>
                <View style={{ paddingVertical: 9, paddingHorizontal: 20, gap: 5, justifyContent: "center" }}>
                    <View style={{ paddingVertical: 2, justifyContent: "space-around", flexDirection: "row" }}>
                        <Text style={[{ color: theme.primaryText, ...Theme.fontStyle.inter.regular, fontSize: 13, textAlign: "center" }]}>
                            {SyncingModalLabels?.step_1}
                        </Text>
                        {index === 0 && <ActivityIndicator />}
                        {index != 0 && <MaterialCommunityIcons name="check-underline-circle-outline" size={25} color={index >= 0 ? theme.primary : theme.gray} />}
                    </View>
                    <View style={{ paddingVertical: 2, justifyContent: "space-around", flexDirection: "row" }}>
                        <Text style={[{ color: theme.primaryText, ...Theme.fontStyle.inter.regular, fontSize: 13, textAlign: "center" }]}>
                            {SyncingModalLabels?.step_2}
                        </Text>
                        {index === 1 && <ActivityIndicator />}
                        {index != 1 && <MaterialCommunityIcons name="check-underline-circle-outline" size={25} color={index >= 1 ? theme.primary : theme.gray} />}
                    </View>
                    <View style={{ paddingVertical: 2, justifyContent: "space-around", flexDirection: "row" }}>
                        <Text style={[{ color: theme.primaryText, ...Theme.fontStyle.inter.regular, fontSize: 13, textAlign: "center" }]}>
                            {SyncingModalLabels?.step_3}
                        </Text>
                        {index === 2 && <ActivityIndicator />}
                        {index != 2 && <MaterialCommunityIcons name="check-underline-circle-outline" size={25} color={index >= 2 ? theme.primary : theme.gray} />}
                    </View>
                    <View style={{ paddingVertical: 2, justifyContent: "space-around", flexDirection: "row" }}>
                        <Text style={[{ color: theme.primaryText, ...Theme.fontStyle.inter.regular, fontSize: 13, textAlign: "center" }]}>
                            {SyncingModalLabels?.step_4}
                        </Text>
                        {index === 3 && <ActivityIndicator />}
                        {index != 3 && <MaterialCommunityIcons name="check-underline-circle-outline" size={25} color={index >= 3 ? theme.primary : theme.gray} />}
                    </View>
                    {index >= 3 &&
                        <View style={{ paddingTop: 6, }}>
                            <Text style={[{ color: theme.primaryText, ...Theme.fontStyle.inter.semiBold, fontSize: 14, textAlign: "center" }]}>
                                {SyncingModalLabels?.completion_message}
                            </Text>
                        </View>
                    }
                </View>

            </Dialog.Content>
        </Dialog>
    </Portal>

}


const createStyles = (theme: any) => StyleSheet.create({
    dialog: {
        borderRadius: 15,
        paddingHorizontal: 1,
        paddingVertical: 1,
        backgroundColor: theme.primaryBackground,
    },
})


