import { Image, StyleSheet, Text, View } from "react-native"
import { useCurrentUser, useMustSuncFirtTime, useTheme } from "store";
import { showCustomMessage, synchronisation, Theme } from "utils";
import { I18n } from 'i18n';
import { Button, Dialog, Portal } from "react-native-paper";
import React, { useCallback, useEffect } from "react";
import { getLocalUnSyncAttendanceLinesGroupedBySessionAndClass } from "services/AttendanceLineServices";
import { db } from "apis/database";
import { Assignment, AttendanceKey, AttendanceLine, FacultyAttendance, syncAssignmentToServersPromise, syncAttendanceLinesToServersPromise, syncTeacherAttendancesToServersPromise } from "services/CommonServices";
import MyRotatingImage from "./MyRotatingImage";
import { getLocalAssignmentsWithRooms } from "services/AssignmentsServices";
import { useFocusEffect } from "@react-navigation/native";
import { getLocalUnSyncFacultyAttendances } from "services/FacultyAttendanceServices";

export const UnSyncModal = ({ handlesResync }: { handlesResync: () => void, }): React.JSX.Element => {
    const theme = useTheme()
    const [isVisible, setIsVisible] = React.useState(false);
    const [isMutating, setIsMutating] = React.useState(false);
    const [dataToSync, setDataToSync] = React.useState<Map<AttendanceKey, AttendanceLine[]>>();
    const [assignmentToSync, setAssignmentToSync] = React.useState<Assignment[]>([]);
    const [facultyAttendance, setFacultyAttendance] = React.useState<FacultyAttendance[]>([]);
    const SyncingModalLabels: any = I18n.t("UnSyncModal");
    const styles = createStyles(theme);
    const mustSuncFirtTime = useMustSuncFirtTime();
    const user = useCurrentUser();
    // useEffect(() => {
    //     // getLocalUnSyncAttendanceLines();
    //     if (!mustSuncFirtTime) {
    //         getLocalUnSyncAttendanceLines();
    //     } else {
    //         setIsVisible(false);
    //     }
    // }, [mustSuncFirtTime])
    useFocusEffect(
        useCallback(() => {
            if (!mustSuncFirtTime) {
                getLocalUnSyncAttendanceLines();
            } else {
                setIsVisible(false);
            }
            return () => {
            };
        }, [mustSuncFirtTime])
    );



    async function getLocalUnSyncAttendanceLines() {
        try {
            const response1 = await getLocalUnSyncAttendanceLinesGroupedBySessionAndClass(db);
            const responseAssignment = await getLocalAssignmentsWithRooms(db);
            const responseattendance = await getLocalUnSyncFacultyAttendances(db);

            if (response1.success) {
                const list: Map<AttendanceKey, AttendanceLine[]> | undefined = response1?.data;
                console.log("getLocalUnSyncAttendanceLinesGroupedBySession------.......", list?.size);
                if (list) {
                    setDataToSync(list!);
                }
                if (list && list.size > 0) {
                    setIsVisible(true);
                }
            } else {
                console.log("error", response1.error);
            }
            if (responseAssignment.success && responseAssignment.data) {
                if (responseAssignment.data.length > 0 && !isVisible) {
                    setAssignmentToSync(responseAssignment.data);
                    setIsVisible(true);
                }
            } else {
                console.log("error", responseAssignment.error);

            }
            if (responseattendance.success && responseattendance.data) {
                if (responseattendance.data.length > 0 && !isVisible) {
                    setFacultyAttendance(responseattendance.data);
                    setIsVisible(true);
                }
            } else {
                console.log("error", responseAssignment.error);

            }
        } catch (error) {
            console.log("error", error);
            console.log("error", error);

        }
    }
    async function syncAttendanceLinesToServers() {
        try {
            if (dataToSync) {
                try {
                    await syncAttendanceLinesToServersPromise(dataToSync);
                } catch (error) {
                    showCustomMessage("Information", "Erreur de synchronisation." + error, "warning", "bottom");

                }
            }
        } catch (error) {
            console.log("error", error);
        }
    }
    async function syncAssignmentToServers() {
        try {
            if (assignmentToSync) {
                try {
                    await syncAssignmentToServersPromise(assignmentToSync, user?.id);
                } catch (error) {
                    showCustomMessage("Information", "Erreur de synchronisation." + error, "warning", "bottom");

                }
            }
        } catch (error) {
            console.log("error", error);
        }
    }
    async function syncTeachersAttendancesToServers() {
        try {
            if (facultyAttendance.length > 0) {
                try {
                    await syncTeacherAttendancesToServersPromise(facultyAttendance);
                } catch (error) {
                    showCustomMessage("Information", "Erreur de synchronisation." + error, "warning", "bottom");
                }
            }
        } catch (error) {
            console.log("error", error);
        }
    }


    async function syncToServers() {
        if (isMutating) return;
        try {
            setIsMutating(true);
            await syncAttendanceLinesToServers();
            await syncAssignmentToServers();
            await syncTeachersAttendancesToServers();
        } catch (error) {
            showCustomMessage("Information", "Erreur de synchronisation." + error, "warning", "bottom");
        } finally {
            setDataToSync(undefined);
            setAssignmentToSync([]);
            setFacultyAttendance([]);
            setIsMutating(false);
            setIsVisible(false);
            getLocalUnSyncAttendanceLines();
            handlesResync();
        }
    }


    return <Portal>
        <Dialog
            visible={isVisible}
            dismissable={true}
            onDismiss={() => setIsVisible(false)}
            style={styles.dialog} >
            <Dialog.Content>
                <View style={{ paddingBottom: 9, }}>
                    <Text style={[{ color: theme.primaryText, ...Theme.fontStyle.inter.semiBold, fontSize: 18, textAlign: "center" }]}>
                        {SyncingModalLabels?.sync_required}
                    </Text>
                    <Text style={[{ color: theme.primaryText, ...Theme.fontStyle.inter.regular, fontSize: 13, textAlign: "center" }]}>
                        {SyncingModalLabels?.offline_changes_detected}
                    </Text>
                </View>
                {isMutating && <MyRotatingImage source={synchronisation} size={100} duration={2000} />}
                {!isMutating && <Image source={synchronisation} style={{ width: 100, resizeMode: "cover", height: 100, borderRadius: 3, alignSelf: "center" }} />}
                <View style={{ paddingVertical: 9, paddingHorizontal: 10, gap: 5, }}>
                    <Text style={[{ color: theme.primaryText, ...Theme.fontStyle.inter.bold, fontSize: 14, }]}>
                        {SyncingModalLabels?.dataToSync}:
                    </Text>
                    <Text style={[{ color: theme.primaryText, ...Theme.fontStyle.inter.regular, fontSize: 14, }]}>
                        {I18n.t("UnSyncModal.attendanceSheets", { size: dataToSync?.size })}
                    </Text>
                    <Text style={[{ color: theme.primaryText, ...Theme.fontStyle.inter.regular, fontSize: 14, }]}>
                        {I18n.t("UnSyncModal.assignments", { count: assignmentToSync.length })}
                    </Text>
                    <Text style={[{ color: theme.primaryText, ...Theme.fontStyle.inter.regular, fontSize: 14, }]}>
                        {I18n.t("UnSyncModal.presence", { count: facultyAttendance.length })}
                    </Text>
                </View>
                <View style={{ paddingTop: 12, justifyContent: "space-around", flexDirection: "row", gap: 10, }}>
                    <Button
                        mode="contained"
                        style={{ flex: 1 }}
                        labelStyle={{ color: theme.secondaryText }}
                        onPress={() => {
                            setIsVisible(false);
                        }}
                        icon={"close"}
                        contentStyle={{ backgroundColor: theme.primaryText }}>
                        {SyncingModalLabels?.cancel}
                    </Button>
                    <Button
                        mode="contained"
                        style={{ flex: 1, }}
                        labelStyle={{ color: theme.secondaryText }}
                        contentStyle={{ backgroundColor: theme.primary }}
                        onPress={async () => {
                            syncToServers();
                        }}
                        icon={"check"}>
                        {SyncingModalLabels?.synchronize}
                    </Button>
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


