import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { showCustomMessage, Theme } from 'utils';
import { useTheme } from 'store';
import dynamicStyles from '../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataTable } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import { ActivityIndicator } from 'react-native';
import useSWRMutation from 'swr/mutation';
import { LOCAL_URL, postData } from 'apis';
import { I18n } from 'i18n';



const NotesItem = ({ item, onPress, showbutton, selectedStudent, onPressShowMore, onSuccesUpdateNote }:
    { showbutton: boolean, onPress: () => any, item: any, selectedStudent: any, onPressShowMore: () => any, onSuccesUpdateNote: () => any }) => {
    const [collapsed, setCollapsed] = useState(true);
    const theme = useTheme();
    const styles = dynamicStyles(theme);
    const GradeEntryText: any = I18n.t("Dashboard.GradeEntry");


    return (
        <View
            style={{ marginBottom: 10, gap: 5, paddingHorizontal: 0, borderBottomWidth: 1, borderBottomColor: theme.gray, paddingBottom: 10, }}>
            <View style={{ flexDirection: "row", }}>
                <View style={{ justifyContent: "space-between", flex: 1, gap: 1, alignContent: "center", }}>
                    <Text selectable={true} style={{ ...Theme.fontStyle.inter.semiBold, fontSize: 14, color: theme.primaryText }}>{item?.name}</Text>
                    {
                        item?.is_invited &&
                        <Text style={{ color: theme.primary, ...Theme.fontStyle.inter.regular, fontSize: 12 }}>{item?.home_classroom?.name ?? ''}</Text>
                    }
                </View>
                <View style={{ flexDirection: "row", }}>
                    <TouchableOpacity style={[{
                        borderColor: theme.primary,
                        borderWidth: 1,
                        padding: 3,
                        paddingHorizontal: 15,
                        borderRadius: 20,
                        height: 25,
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "center",
                    }, item?.is_exist && { backgroundColor: theme.primary, color: theme.secondaryText }]}
                        onPress={showbutton ? onPress : () => null}
                    >
                        {!showbutton && <Text style={styles.value1}>{item?.exam_marks && item?.exam_marks?.is_exist ? item?.exam_marks?.total_weight_marks?.toString().slice(0, 4) : "--"}</Text>}
                        {showbutton && <Text style={styles.value1}>{(item?.exam_marks && item?.exam_marks?.marks > 0) ? item?.exam_marks?.marks?.toString().slice(0, 4) : "--"}</Text>}
                    </TouchableOpacity>
                    <MaterialCommunityIcons name={"dots-vertical"} size={23} color={theme.primaryText} />
                </View>
            </View>

            <View style={{ flexDirection: "row", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
                {
                    item.attendee && item.attendee.status === "present" &&
                    <View
                        style={{ borderWidth: 1, borderColor: theme.gray, paddingHorizontal: 5, paddingVertical: 3, alignItems: "center", borderRadius: 5, backgroundColor: theme.primary }}
                    >
                        <Text style={{ color: theme.secondaryText, ...Theme.fontStyle.inter.regular, fontSize: 14 }}>{GradeEntryText.status_present}</Text>
                    </View>

                }
                {
                    item.attendee && item.attendee.status === "absent" &&
                    <View
                        style={{ borderWidth: 1, borderColor: theme.gray, paddingHorizontal: 5, paddingVertical: 3, alignItems: "center", borderRadius: 5, backgroundColor: "red" }}
                    >
                        <Text style={{ color: theme.secondaryText, ...Theme.fontStyle.inter.regular, fontSize: 14 }}>{GradeEntryText.status_absent}</Text>
                    </View>

                }
                {
                    !item.attendee &&
                    <View
                        style={{ borderWidth: 1, borderColor: theme.gray, paddingHorizontal: 5, paddingVertical: 3, alignItems: "center", borderRadius: 5, }}
                    >
                        <Text style={{ color: theme.primaryText, ...Theme.fontStyle.inter.regular, fontSize: 12 }}>{GradeEntryText.status_no_call}</Text>
                    </View>

                }
                {
                    item.note &&
                    <View
                        style={{ borderWidth: 1, borderColor: "red", paddingHorizontal: 5, paddingVertical: 3, alignItems: "center", borderRadius: 5, }}
                    >
                        <Text style={{ color: theme.primaryText, ...Theme.fontStyle.inter.regular, fontSize: 12 }}>{item?.note}</Text>
                    </View>

                }
                {
                    !showbutton &&
                    <TouchableOpacity
                        onPress={() => {
                            onPressShowMore();
                            setCollapsed(!collapsed);

                        }}
                        style={{ borderWidth: 1, borderColor: theme.gray, paddingHorizontal: 5, paddingVertical: 3, alignItems: "center", borderRadius: 5, }}
                    >
                        <Text style={{ color: theme.primaryText, ...Theme.fontStyle.inter.regular, fontSize: 12 }}>{collapsed ? GradeEntryText.action_show_details : GradeEntryText.action_hide_details}</Text>
                    </TouchableOpacity>

                }
            </View>
            {!showbutton && <Collapsible collapsed={collapsed} duration={1000} easing="easeOutCubic">
                {!collapsed && <DataTable>
                    {item?.exam_marks && item?.exam_marks?.sub_exams && item?.exam_marks?.sub_exams.map((item: any, index: number) => (
                        <DataTableItem item={item} key={index} theme={theme} index={index} selectedStudent={selectedStudent} onSuccesUpdateNote={onSuccesUpdateNote} />
                    ))}
                </DataTable>}
            </Collapsible>}
        </View>
    );
};

const DataTableItem = (props: any): React.JSX.Element => {
    const { item, theme, index, selectedStudent, onSuccesUpdateNote } = props;
    const styles = createStyles(theme);
    const [note, setNote] = useState(item?.marks > 0 ? item?.marks?.toString() : "--");
    const [loading, setLoading] = useState(false);
    const [showbutton, setShowbutton] = useState(false);
    const { trigger: postNoteForStudentSubExam } = useSWRMutation(`${LOCAL_URL}/api/change-notes/student/sub-exam/${item?.id}`, postData)
    const GradeEntryText: any = I18n.t("Dashboard.GradeEntry");


    const postNoteForStudent = async () => {
        const data = {
            student_id: selectedStudent?.id,
            marks: parseInt(note)
        }
        setLoading(true)
        try {
            const res = await postNoteForStudentSubExam(data)
            if (!res?.success) {
                showCustomMessage("Information", res.message, "warning", "bottom")
                return;
            }
            onSuccesUpdateNote();
            showCustomMessage("Success", GradeEntryText.message_success, "success", "top")

        } catch (error: any) {

            showCustomMessage("Information", GradeEntryText.message_error + error.message, "warning", "bottom")

        } finally {
            setLoading(false)
            setShowbutton(false);
        }
    };
    return (
        <View key={index?.toString()} style={styles.container}>
            <View style={styles.cellView}>
                <Text style={styles.dayText}>
                    {item?.name ?? ""}
                </Text>
            </View>
            <Text style={styles.dayText}>
                {item?.weight?.toString().slice(0, 4)} %
            </Text>
            <View style={{ flexDirection: "row", gap: 10, }}>
                <TextInput
                    placeholder={GradeEntryText.note1}
                    value={note}
                    verticalAlign="middle"
                    onChangeText={(text) => {
                        if (text.length > 0) {
                            setShowbutton(true);
                        } else {
                            setShowbutton(false);
                        }
                        setNote(text);
                    }}
                    style={[styles.input, item?.is_exist && { backgroundColor: theme.primary, color: theme.secondaryText }]}
                    textAlign="center"
                    textAlignVertical="center"
                    keyboardType="numeric"
                    numberOfLines={1}
                    maxLength={4}
                />
                {
                    loading && <ActivityIndicator />
                }
                {
                    showbutton && !loading &&
                    <TouchableOpacity
                        onPress={() => {
                            postNoteForStudent();
                        }}
                        style={styles.collapseToggle}>
                        <MaterialCommunityIcons
                            name={"check-underline"}
                            color={theme.primary}
                            size={25}
                        />
                    </TouchableOpacity>
                }
            </View>
        </View>
    );
};


const createStyles = (theme: any) => StyleSheet.create({
    container: {
        marginVertical: 15,
        flexDirection: "row",
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center",
    },
    row: {
        width: "100%",
    },
    cell: {
        flex: 1,
    },
    cellView: {
        flexDirection: "column",
        flex: 1,
    },
    cad: {
        flex: 1,
        marginHorizontal: 5, // Space between cards
    },
    dayText: {
        ...Theme.fontStyle.inter.semiBold,
        fontSize: 13,
        color: theme.primaryText,
    },
    dateText: {
        ...Theme.fontStyle.inter.regular,
        color: theme.primaryText,
    },
    iconCell: {
        alignItems: "center",
        justifyContent: "center",
    },
    collapseToggle: {
        justifyContent: "flex-end",
        alignSelf: "center",
        textAlign: "right",
        ...Theme.fontStyle.inter.bold,
        color: theme.primary,
    },
    collapsibleContainer: {
        backgroundColor: theme.gray3,
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    collapsibleText: {
        ...Theme.fontStyle.inter.semiBold,
        color: theme.primaryText,
    },
    boldText: {
        ...Theme.fontStyle.inter.bold,
    },
    remark: {
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 10,
        width: "100%",
        marginVertical: 5,
        textAlign: "center",
        ...Theme.fontStyle.inter.semiBold,
        borderColor: theme.gray4,
        color: theme.primaryText,
    },
    italicText: {
        ...Theme.fontStyle.inter.italic,
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        alignItems: "center",
        borderRadius: 5,
        height: 35,
        width: 80,
        textAlign: "center",
        paddingHorizontal: 7,
        fontSize: 12,
        color: theme.primaryText,
        backgroundColor: theme.gray,
        ...Theme.fontStyle.inter.bold
    },
});



export default NotesItem;
