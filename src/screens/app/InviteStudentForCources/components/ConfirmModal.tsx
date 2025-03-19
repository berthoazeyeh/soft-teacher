import { StyleSheet, View } from "react-native"
import { isDarkMode, useCurrentUser, useTheme } from "store";
import { I18n } from 'i18n';
import moment from "moment";
import React from "react";
import Modal from 'react-native-modal';
import { DataClassType } from "..";
import { Dimensions } from "react-native";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { showCustomMessage, Theme } from "utils";
import { Button } from "react-native-paper";
import useSWRMutation from "swr/mutation";
import { getData, LOCAL_URL, postData } from "apis";
import { clearManyToManyRelations, syncAllStudentsNew } from "services/StudentsServices";
import { db } from "apis/database";
const { height, width } = Dimensions.get('window')

export const ConfirmModal = ({ visible, dataList, setModalVisible, subject, classroom, onSuccessAll }: { visible: boolean, dataList: DataClassType[], setModalVisible: (value: boolean) => void, subject: any, classroom: any, onSuccessAll: () => void, }): React.JSX.Element => {
    const theme = useTheme()
    const SyncingModalLabels: any = I18n.t("InviteStudentForCourses");
    const styles = createStyles(theme);
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    let count = 0;
    const user = useCurrentUser();
    const { trigger: getAllTeachersClassRoomStudent } = useSWRMutation(`${LOCAL_URL}/api/teacher/classes/${user?.id}`, getData)
    const { trigger: postInvitation } = useSWRMutation(`${LOCAL_URL}/api/invite-student`, postData)

    dataList.forEach(item => {
        count += item.selectedStudent.length;
    })
    async function onPressConfirm() {
        try {
            setIsLoading(true);
            let admission_ids: any[] = [];
            dataList.forEach(item => {
                item.selectedStudent.forEach(student => {
                    admission_ids.push(student?.admission_id);
                })

            })
            const data = { admission_ids: admission_ids, subject_id: subject?.id, visiting_classroom_id: classroom?.id };
            console.log(data, admission_ids.length);
            const response = await postInvitation(data);
            console.log(response);

            if (response?.success) {
                showCustomMessage("Succes", response?.message, 'success', "center");
                await syncStudents();
                onSuccessAll();
            } else {
                showCustomMessage(I18n.t('AddAssignmentScreen.info'), response?.message, "warning", "bottom")
            }

        } catch (err: any) {
            showCustomMessage(I18n.t('AddAssignmentScreen.info'), I18n.t('AddAssignmentScreen.loadingError') + err.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoading(false);
        }
    }




    const syncStudents = async () => {
        try {
            const resStudent = await getAllTeachersClassRoomStudent();
            if (resStudent?.success) {
                const student: any[] = resStudent?.success ? resStudent?.data : []
                const clear = await clearManyToManyRelations(db);
                console.log(clear);
                for (let index = 0; index < student.length; index++) {
                    const element = student[index];
                    console.log("getAllTeachersClassRoomStudent------size-------", element?.students);
                    const tmp = await syncAllStudentsNew(element.students, db, element?.id);
                    console.log(tmp);
                }
            } else {
                console.log(resStudent);
                showCustomMessage("Information1", resStudent?.message ?? '', "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + (err?.message ?? ''), "warning", "bottom")
            // console.error('Une erreur s\'est produite :', err);
        } finally {

        }
    };


    return <Modal
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
        onSwipeCancel={() => setModalVisible(false)}
        swipeDirection={'down'}
        isVisible={visible}
        style={styles.modalContent}
        backdropColor={isDarkMode() ? theme.underlayColor : 'black'}>
        <View style={styles.modalView}>
            <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: 10, }}>
                <Text style={[styles.text, {
                    ...Theme.fontStyle.inter.black,
                    fontSize: 16,
                }]}>{SyncingModalLabels.confirmation}</Text>
            </View>
            <FlatList
                data={dataList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <View
                        style={styles.item}>
                        <View>
                            <Text style={styles.text}>{item.classRoom?.name}</Text>
                            {item.isHomeClass && <Text style={{
                                ...Theme.fontStyle.inter.regular,
                                fontSize: 12,
                                color: "blue"
                            }}>{'Principal class'}</Text>}
                        </View>
                        <Text style={styles.text}>{item.selectedStudent.length}/{item.allStudent.length} student(s)</Text>
                    </View>
                )}
                showsVerticalScrollIndicator={false}
            />
            <View style={{ justifyContent: "center", alignItems: "center", paddingVertical: 10, }}>

                <Text style={[styles.text, {
                    ...Theme.fontStyle.inter.black,
                    fontSize: 16,
                }]}>Total: {count} student(s)</Text>
            </View>

            <Button
                mode="contained-tonal"
                loading={isLoading}
                style={{ backgroundColor: theme.primary, paddingHorizontal: 30, marginBottom: 10, marginHorizontal: 10, }}
                labelStyle={{ color: theme.secondaryText }}
                onPress={onPressConfirm}
                icon={"check"}>
                {"Confirmer"}
            </Button>
        </View>
    </Modal>
}


const createStyles = (theme: any) => StyleSheet.create({
    modalContent: {
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: -5,
    },
    modalView: {
        backgroundColor: theme.primaryBackground,
        paddingVertical: 10,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        width: width,
        height: height * 0.65,
        paddingHorizontal: 10,
    },
    item: {
        padding: 5,
        marginVertical: 5,
        // height: 35,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        backgroundColor: "#ddd",
        flexDirection: "row",
        borderRadius: 10,
        // alignItems: "center",
        justifyContent: "space-between",
    },
    selectedItem: {
        backgroundColor: "#007bff",
    },
    text: {
        color: theme.primaryText,
        fontSize: 14,
        ...Theme.fontStyle.inter.semiBold,
    },
})


