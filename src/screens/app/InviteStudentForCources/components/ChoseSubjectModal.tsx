import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import dynamicStyles from "../style";
import { useTheme } from "store";
import { bus, getRandomColor, profils, Theme } from "utils";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { I18n } from 'i18n';
import { Dialog, Divider, Portal } from "react-native-paper";
import moment from "moment";
import React from "react";

export const ChoseSubjectModal = ({ visible, subjects, onSelectSubject }: { visible: boolean, subjects: any[], onSelectSubject: (value: any) => void }): React.JSX.Element => {
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
                        {"Veillez choisir le cours"}
                    </Text>
                </View>
                <FlatList
                    data={subjects}
                    keyExtractor={(item: any, index) => index.toString()}
                    scrollEnabled={false}
                    nestedScrollEnabled={false}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => {
                                onSelectSubject(item)
                            }}>
                            <Text style={styles.title}> {item?.name}</Text>
                            {/* <Text style={styles.subtitle}>{item.age}</Text> */}
                        </TouchableOpacity>
                    )}
                />
            </Dialog.Content>
        </Dialog>
    </Portal>

}


const createStyles = (theme: any) => StyleSheet.create({
    dialog: {
        borderRadius: 15,
        paddingHorizontal: 1,
        paddingVertical: 1,
        height: "60%",
        backgroundColor: theme.primaryBackground,
    },
    item: {
        padding: 15,
        marginVertical: 10,
        borderRadius: 10,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 14,
        ...Theme.fontStyle.inter.semiBold,
        color: theme.primaryText
    },
})


