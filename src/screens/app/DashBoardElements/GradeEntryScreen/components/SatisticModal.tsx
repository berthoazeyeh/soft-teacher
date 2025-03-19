import { StyleSheet, Text, View } from "react-native"
import { useCurrentUser, useTheme } from "store";
import { Theme } from "utils";
import { I18n } from 'i18n';
import { Button, Dialog, Portal } from "react-native-paper";
import React from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';






export const SatisticModal = ({ isVisible, onDismiss, data }: {
    isVisible: boolean, onDismiss: (v: boolean) => void, data: {
        total: number;
        withMarks: number;
        withoutMarks: number;
        passed: number;
        failed: number;
    }
}): React.JSX.Element => {
    const theme = useTheme();
    const SyncingModalLabels: any = I18n.t("UnSyncModal");
    const styles = createStyles(theme);
    const user = useCurrentUser();
    // console.log(SyncingModalLabels);

    return (
        <Portal>
            <Dialog
                visible={isVisible}
                dismissable={true}
                onDismiss={() => onDismiss(false)}
                style={styles.dialog}
            >
                <Dialog.Content>
                    <View style={{ paddingBottom: 9 }}>
                        <Text
                            style={{
                                color: theme.primaryText,
                                ...Theme.fontStyle.inter.semiBold,
                                fontSize: 18,
                                textAlign: "center"
                            }}
                        >
                            {I18n.t("Dashboard.MyAbsencesScreen.statistics")}
                        </Text>
                    </View>

                    {/* Statistiques */}
                    <View style={styles.statsContainer}>
                        <StatItem icon="account-group" label={SyncingModalLabels?.totalStudents} value={data.total} color={theme.primary} />

                        <StatItem icon="check-circle" label={SyncingModalLabels?.studentsWithMarks} value={data.withMarks} color="green" />
                        <StatItem icon="close-circle" label={SyncingModalLabels?.studentsWithoutMarks} value={data.withoutMarks} color="red" />

                        <StatItem icon="star-circle" label={SyncingModalLabels?.studentsPassed} value={data.passed} color="blue" />
                        <StatItem icon="alert-circle" label={SyncingModalLabels?.studentsFailed} value={data.failed} color="orange" />
                    </View>

                    {/* Bouton Fermer */}
                    <View style={styles.buttonContainer}>
                        <Button
                            mode="contained"
                            style={{ flex: 1 }}
                            labelStyle={{ color: theme.secondaryText }}
                            onPress={() => onDismiss(false)}
                            icon="close"
                            contentStyle={{ backgroundColor: theme.primaryText }}
                        >
                            {SyncingModalLabels?.cancel}
                        </Button>
                    </View>
                </Dialog.Content>
            </Dialog>
        </Portal>
    );
};

// Composant pour chaque statistique avec icône
const StatItem = ({ icon, label, value, color }: { icon: string, label: string, value: number, color: string }) => {
    const theme = useTheme();
    const styles = createStyles(theme);
    return <View style={styles.statItem}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
        <Text style={styles.statText}>{label}: <Text style={styles.statTextVal}>{value}</Text></Text>
    </View>
};

const createStyles = (theme: any) => StyleSheet.create({
    dialog: {
        borderRadius: 15,
        paddingHorizontal: 1,
        paddingVertical: 1,
        backgroundColor: theme.primaryBackground,
    },
    statsContainer: {
        paddingVertical: 12,
        justifyContent: "center",
        gap: 10,
    },
    statItem: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    statText: {
        fontSize: 16,
        color: "black",
        ...Theme.fontStyle.inter.regular
    },
    statTextVal: {
        fontSize: 17,
        color: "black",
        ...Theme.fontStyle.inter.bold
    },
    buttonContainer: {
        paddingTop: 12,
        justifyContent: "space-around",
        flexDirection: "row",
        gap: 10,
    },
});

