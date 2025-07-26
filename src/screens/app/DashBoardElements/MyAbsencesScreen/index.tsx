import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Easing } from "react-native";
import { isDarkMode, useCurrentUser, useTheme } from "store";
import dynamicStyles from "./styles";
import { getRandomColor, logo, profils, showCustomMessage, Theme } from "utils";
import { FlatList } from "react-native";
import moment from "moment";
import { Image } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Banner, Button, Checkbox, Divider, FAB, Menu, Searchbar } from "react-native-paper";
import { Animated } from "react-native";
import Modal from 'react-native-modal';
import { ScrollView } from "react-native-gesture-handler";
import useSWRMutation from "swr/mutation";
import { getData, LOCAL_URL, postData } from "apis";
import AttendanceScreen from "../AttendanceScreen";
import AttendanceItem from "./Components/AttendenceItem";
import { RefreshControl } from "react-native";
import { CustomerLoader, MyAnimatedBanner } from "components";
import { UserBlock } from "./Components";
import AttendanceMenuButton from "./Components/ActionMenuItem";

import { I18n } from 'i18n';
import { getStudentsByFilter } from "services/StudentsServices";
import { db } from "apis/database";
import { getStudentsWithAttendance, syncAttendanceLines } from "services/AttendanceLineServices";
import { FacultyAttendance, Session, StudentAttendances } from "services/CommonServices";
import { Alert } from "react-native";
import { saveFacultyAttendance } from "services/FacultyAttendanceServices";



export interface AttendanceDataItem {
    [key: string]: boolean | number | string;
    student_id: number | string;
    remark: string;
    // status: Record<'present' | 'absent' | 'late', boolean>;
}

interface AttendanceCount {
    present: number;
    absent: number;
    late: number;
    excused: number;
}

/**
 * Compte le nombre d'étudiants présents, absents, en retard et excusés.
 * @param {Student[]} students - La liste des étudiants.
 * @returns {AttendanceCount} - Un objet contenant les comptes.
 */


function MyAbsencesScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom, subject } = route.params
    const theme = useTheme()
    const user = useCurrentUser();
    const [lastAttendence, setLastAttendence] = useState<any[]>([])
    const [lastAttendenceElements, setLastAttendenceElements] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isLoadingLastAttend, setIsLoadingLastAttend] = useState(false)
    const [visibleBanner, setVisibleBanner] = useState(false)
    const [updatingUser, setUpdatingUser] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const styles = dynamicStyles(theme)
    const [dataAttend, setDataAttend] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<StudentAttendances[]>([])
    const [attendanceList, setAttendanceList] = useState<StudentAttendances[]>([])
    const [refresh, setRefresh] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [attendanceCount, setAttendanceCount] = useState<AttendanceCount | undefined>();
    const [attendanceDataList, setAttendanceDataList] = useState<AttendanceDataItem[]>([]);


    const addAttendanceDataItem = (newItem: AttendanceDataItem) => {
        setAttendanceDataList((prevList) => {
            // Cherche l'index de l'élément avec le même student_id
            const index = prevList.findIndex(item => item.student_id === newItem.student_id);
            if (index !== -1) {
                // Remplace l'élément existant
                const updatedList = [...prevList];
                updatedList[index] = newItem;
                return updatedList;
            }
            // Ajoute le nouvel élément si aucun doublon n'existe
            return [...prevList, newItem];
        });
    };


    function showCloseSessionAlert() {
        Alert.alert(
            I18n.t("Dashboard.MyAbsencesScreen.closeSessionTitle"), // Titre traduit
            I18n.t("Dashboard.MyAbsencesScreen.closeSessionMessage"), // Message traduit
            [
                {
                    text: I18n.t("Dashboard.MyAbsencesScreen.continueButton"), // Bouton "Continuer" traduit
                    onPress: () => postAttendencesForGroupedStudent(),
                    style: "cancel",
                },
                {
                    text: I18n.t("Dashboard.MyAbsencesScreen.closeButton"), // Bouton "Clôturer" traduit
                    onPress: () => saveAttendance(subject),
                    style: "destructive",
                },
            ]
        );
    }
    const saveAttendance = async (item: Session) => {
        console.log(item.facultyAttendance);
        setLoading(true);
        try {
            let facultyAttendance: FacultyAttendance = item.facultyAttendance ? {
                ...item.facultyAttendance,
                checkout: moment(item.end_datetime).format('YYYY-MM-DD HH:mm:ss'),
                is_local: true,
                name: '...',
            } : {
                name: '...',
                user_id: user?.id,
                session_id: item.id,
                date: moment().format('YYYY-MM-DD HH:mm:ss'),
                checkin: moment().format('YYYY-MM-DD HH:mm:ss'),
                present: true,
                absent: false,
                late: false,
                is_local: true,
                remark: "RAS"
            };
            const res = await saveFacultyAttendance(db, facultyAttendance, true);
            console.log("saveFacultyAttendance------", res);
        } catch (error) {
            console.log(error);
            showCustomMessage("Information", 'Une erreur s\'est produite lors de l\'enregistrement de l\'absence :' + error, "warning", "bottom")
        } finally {
            postAttendencesForGroupedStudent();
        }
    }
    const countAttendance = (students: any[]) => {
        const counts: AttendanceCount = {
            present: 0,
            absent: 0,
            late: 0,
            excused: 0,
        };

        students.forEach((student) => {
            if (student.attendance_line) {
                if (student.attendance_line.present) counts.present++;
                if (student.attendance_line.absent) counts.absent++;
                if (student.attendance_line.late) counts.late++;
                if (student.attendance_line.excused) counts.excused++;
            }
        });
        setAttendanceCount(counts)
        // return counts;
    };
    const markAllAsPresent = () => {

        setAttendanceDataList([]);
        var attendanceDataListTMP: AttendanceDataItem[] = filteredData.map((item) => {
            return { student_id: item.id, remark: 'R.A.S', present: true };
        });
        setAttendanceDataList(attendanceDataListTMP);
    };
    const markAllAsAbsent = () => {
        setAttendanceDataList([]);
        var attendanceDataListTMP: AttendanceDataItem[] = filteredData.map((item) => {
            return { student_id: item.id, remark: 'R.A.S', absent: true };
        });
        setAttendanceDataList(attendanceDataListTMP);
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            title: classRoom?.name + ` -- (${filteredData.length})`,
            headerRight: () => <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={() => {
                    setShowSearch(true)
                    showHeader()
                }}
            >
                <MaterialCommunityIcons name='account-search' size={30} color={theme.primaryText} />
            </TouchableOpacity>,
        });
    }, [attendanceList, filteredData]);


    // moment.locale("en");
    const { trigger: getTeacherSubjectInClassRoome } = useSWRMutation(`${LOCAL_URL}/api/attendances/session/room/${subject?.id}/${classRoom?.id}`, getData)
    const { trigger: setAttendencesForStudent } = useSWRMutation(`${LOCAL_URL}/api/crud/attendance-line/session/${subject?.id}/${classRoom?.id}`, postData)
    const { trigger: setAttendencesForGroupedStudent, isMutating: loadingTMP } = useSWRMutation(`${LOCAL_URL}/api/crud/attendance-lines/session/${subject?.id}/${classRoom?.id}`, postData)
    const { trigger: getTeacherTimeTableInClassRoome } = useSWRMutation(`${LOCAL_URL}/api/attendance/room/${classRoom?.id}/from_date?date=${moment(subject?.start_datetime).format("YYYY/MM/DD").toString()}`, getData)
    const { trigger: setLastAttendencesAsCurrent, } = useSWRMutation(`${LOCAL_URL}/api/crud/attendances-lines/session/${subject?.id}/${classRoom?.id}/${lastAttendenceElements?.attendance_id}`, postData)

    // console.log(attendanceCount);

    const getTeacherTimeTableInClassRoom = async () => {
        try {
            setIsLoading(true);
            const res = await getTeacherTimeTableInClassRoome();
            // console.log(res?.data);
            if (res?.success) {
                const timetable: any[] = res?.success ? res?.data : []
                // console.log(res);
                // setLastAttendence(timetable);
                // setLastAttendenceElements(res);
                // setVisibleBanner(true)
                const timer = setTimeout(() => {
                    setVisibleBanner(false)
                }, 5000);
                return () => clearTimeout(timer);
            } else {
                console.log(res);
                showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err?.message, "warning", "bottom")
            // console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoading(false);
            setRefresh(false);
        }
    };


    const postLastAttendencesAsNew = async () => {

        setIsLoadingLastAttend(true)
        const data = {
        }
        try {
            const assigma = await setLastAttendencesAsCurrent(data)
            if (!assigma?.success) {
                console.log(assigma);

                showCustomMessage("Information", assigma?.message, "warning", "bottom")
                return;
            }
            setShowModal(false);
            showCustomMessage('Success', "State updated to ", "success", "center")

        } catch (error: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + error?.message, "warning", "bottom")

        } finally {
            getTeacherTimeTables(false)
            setIsLoadingLastAttend(false)
        }
    };
    const postAttendencesForStudent = async (key: any, value: any, student: any, onccesPostAttendences?: () => void,) => {

        setUpdatingUser(true)
        const data = {
            [key]: true,
            student_id: student?.id,
            remark: "R.A.S"
        }
        try {
            const assigma = await setAttendencesForStudent(data)
            if (!assigma?.success) {
                console.log(assigma);

                showCustomMessage("Information", assigma?.message, "warning", "bottom")
                return;
            }
            setModalVisible(false);
            showCustomMessage(student?.name, "State updated to " + key, "success", "top")

        } catch (error: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + error?.message, "warning", "bottom")

        } finally {
            getTeacherTimeTables(false)
            onccesPostAttendences && onccesPostAttendences()
            setUpdatingUser(false)
        }
    };
    const postAttendencesForGroupedStudent = async () => {
        try {
            setLoading(true);

            const correctData = attendanceDataList.map(data => {
                return {
                    ...data,
                    "session_id": subject?.id,
                    "is_local": true,
                }
            });
            const res = await syncAttendanceLines(correctData, db);
            setModalVisible(false);
            setAttendanceDataList([]);
            console.log(res);

            // const assigma = await setAttendencesForGroupedStudent(attendanceDataList)
            // if (!assigma?.success) {
            //     showCustomMessage("Information", assigma?.message, "warning", "bottom")
            //     return;
            // }
            // setModalVisible(false);
            // setAttendanceDataList([]);

            showCustomMessage("Information", "State updated to ", "success", "top")

        } catch (error: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + error?.message, "warning", "bottom")
        } finally {
            // getTeacherTimeTables(false)
            getLocalTeacherTimeTables(false);
            setLoading(false);
        }
    };
    // const MyLables = I18n.t("Dashboard.MyAbsencesScreen",)
    // console.log(MyLables);

    const getTeacherTimeTables = async (relording: boolean) => {
        if (relording)
            setAttendanceList([]);
        try {
            setIsLoading(true);
            const res = await getTeacherSubjectInClassRoome();
            if (res?.success) {
                const timetable: any[] = res?.success ? res?.data : []
                console.log(";;;;;;;;'''''''", timetable);
                // setAttendanceList(timetable);

            } else {
                // showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            // showCustomMessage("Information", 'Une erreur s\'est produite :' + err?.message, "warning", "bottom")
            // console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoading(false);
            setRefresh(false);
        }

    };

    const getLocalTeacherTimeTables = async (relording: boolean) => {
        if (relording)
            setAttendanceList([]);
        try {
            setIsLoading(true);
            const res = await getStudentsWithAttendance(db, classRoom?.id, subject?.id);
            // console.log(res);

            // const res = await getStudentsByClassroom(db, classRoom?.id);
            if (res?.success && res?.data) {
                const timetable = res?.success ? res?.data : []
                // const timetableTMP = timetable.map((t) => { return { ...t, attendance_line: "" } });
                console.log("getLocalTeacherTimeTables;;;;;;;;'''''''", timetable.length);
                setAttendanceList(timetable);

            } else {
                showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err?.message, "warning", "bottom")
            // console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoading(false);
            setRefresh(false);
            // getTeacherTimeTables(false);
        }

    };

    useEffect(() => {
        // getTeacherTimeTables(true)
        getLocalTeacherTimeTables(true)

        // getTeacherTimeTableInClassRoom()
    }, [refresh])


    const toggleModal = () => {
        setModalVisible(false);

    };
    const toggleModal2 = () => {
        setShowModal(true);
        setVisibleBanner(false)

    };


    const headerHeight = useRef(new Animated.Value(60)).current;  // Assuming 60 is your header height

    // Animation function to show header
    const showHeader = () => {
        Animated.timing(headerHeight, {
            toValue: 60, // Full height of the header
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false, // height doesn't support native driver
        }).start();
    };

    // Animation function to hide header
    const hideHeader = () => {
        Animated.timing(headerHeight, {
            toValue: 0, // Hide the header by reducing its height
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    };

    const onPressAddElement = (student: any, data: any[]) => {
        setSelectedStudent(student);
        setDataAttend(data);
    }

    const onChangeSearch = (query: string) => {
        const sortedData = attendanceList.sort((a, b) => {
            if (a.attendance_line && b.attendance_line) {
                return -1;
            } else if (a.attendance_line && b.attendance_line) {
                return 1;
            } else {
                return 0;
            }
        });
        setSearchQuery(query);
        const filtered = sortedData.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filtered);
    };

    useEffect(() => {
        onChangeSearch("")
        countAttendance(attendanceList);
    }, [attendanceList]);
    const renderEmptyElement = () => (
        <View style={styles.emptyData}>
            {isLoading &&
                <ActivityIndicator color={theme.primary} size={25} />}
            {!isLoading &&
                <Text style={styles.emptyDataText}>{"Aucun cours present."}</Text>}
        </View>
    );




    return <View style={styles.container}>
        <MyAnimatedBanner
            visibleBanner={visibleBanner}
            setVisibleBanner={setVisibleBanner}
            isLocalImages={true}
            iconUrl={logo}
            cancelLabel={I18n.t("Dashboard.MyAbsencesScreen.cancelLabel")}
            confirmAction={toggleModal2}
            modifyLabel={I18n.t("Dashboard.MyAbsencesScreen.modifyLabel")}
            message={I18n.t("Dashboard.MyAbsencesScreen.bannerMessage", { "endTime": moment(lastAttendenceElements?.end_date).format("HH:mm"), "facultyName": lastAttendenceElements?.faculty?.name })
            }

        />

        <View style={{ flexDirection: "row", justifyContent: attendanceDataList.length > 0 ? "space-evenly" : "center" }}>
            <AttendanceMenuButton
                markAllPresent={markAllAsPresent}
                markAllAbsent={markAllAsAbsent}
            />
            {attendanceDataList.length > 0 && <TouchableOpacity
                onPress={() => {
                    setAttendanceDataList([]);
                }}
                style={{ backgroundColor: "red", borderRadius: 20, justifyContent: "center", paddingHorizontal: 15, paddingVertical: 3 }}>
                <Text style={{
                    fontSize: 15,
                    ...Theme.fontStyle.inter.regular,
                    color: 'white',
                    textAlign: "center"
                }}>{I18n.t("Dashboard.MyAbsencesScreen.clearButton")}</Text>

            </TouchableOpacity>}
        </View>
        {showSearch && <Animated.View style={[styles.header, { height: headerHeight }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}>
                <Searchbar
                    placeholder={I18n.t("Dashboard.MyAbsencesScreen.searchPlaceholder")}
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    right={() =>
                        <TouchableOpacity
                            style={{ marginRight: 10 }}
                            onPress={() => {
                                hideHeader()
                            }}
                        >
                            <MaterialCommunityIcons name="close-circle" size={25} color="black" />
                        </TouchableOpacity>
                    }
                    style={{
                        height: 50,
                        borderRadius: 15,
                        flex: 1,
                        backgroundColor: '#f0f0f0',
                    }}
                />
                <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => {
                        console.log('Filter clicked');
                    }}
                >
                    <MaterialCommunityIcons name="filter" size={30} color="black" />
                </TouchableOpacity>
            </View>
        </Animated.View>}
        <View style={styles.content}>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => {
                            setRefresh(true)
                        }}
                    />}
                data={filteredData}
                renderItem={({ item, index }) =>
                    <AttendanceItem
                        theme={theme}
                        setStudent={setSelectedStudent}
                        setModalVisible={setModalVisible}
                        setSelectedStudent={onPressAddElement}
                        postAttendencesForStudent={postAttendencesForStudent}
                        item={item}
                        attendanceDataList={attendanceDataList}
                        onAddNewAttendanceForStudent={(newData) => {
                            addAttendanceDataItem(newData);
                        }}
                    />
                }
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={renderEmptyElement}
            />
        </View>
        {attendanceCount &&
            <View style={{ height: 50, backgroundColor: "#537D8D", gap: 5, elevation: 5, zIndex: 2 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <Text style={{
                        fontSize: 14,
                        ...Theme.fontStyle.inter.regular,
                        color: 'white',
                        textAlign: "center"
                    }}>{I18n.t("Dashboard.MyAbsencesScreen.totalStudents", { "count": attendanceList?.length ?? 0 })} </Text>
                    <Text style={{
                        fontSize: 14,
                        ...Theme.fontStyle.inter.regular,
                        color: 'white',
                        textAlign: "center"
                    }}>{I18n.t("Dashboard.MyAbsencesScreen.presentCount", { "count": attendanceCount.present })} </Text>
                </View>

                <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                    <Text style={{
                        fontSize: 14,
                        ...Theme.fontStyle.inter.regular,
                        color: 'white',
                        textAlign: "center"
                    }}>{I18n.t("Dashboard.MyAbsencesScreen.late", { "count": attendanceCount.late })} </Text>

                    <Text style={{
                        fontSize: 14,
                        ...Theme.fontStyle.inter.regular,
                        color: 'white',
                        textAlign: "center"
                    }}>{I18n.t("Dashboard.MyAbsencesScreen.absentCount", { "count": `${attendanceCount.absent} ` })}</Text>
                    <Text style={{
                        fontSize: 14,
                        ...Theme.fontStyle.inter.regular,
                        color: 'white',
                        textAlign: "center"
                    }}>{I18n.t("Dashboard.MyAbsencesScreen.excused", { "count": attendanceCount.excused })} </Text>

                </View>
            </View>
        }
        <Modal
            onBackButtonPress={() => setModalVisible(false)}
            onBackdropPress={() => setModalVisible(false)}
            onSwipeCancel={() => setModalVisible(false)}
            isVisible={modalVisible}
            style={styles.modalContent}
            backdropColor={isDarkMode() ? theme.underlayColor : 'black'}
        >
            <View style={styles.modalView}>
                <View style={[styles.modalContent]}>
                    <Text style={styles.titleText}>{selectedStudent?.name}</Text>
                    <View style={{ flex: 1, width: "100%" }}>
                        <ScrollView >

                            {dataAttend?.map(([key, value], index) =>
                                <TouchableOpacity key={index} style={styles.checkboxContainer}
                                    onPress={() => {
                                        addAttendanceDataItem({
                                            [key as string]: true,
                                            student_id: selectedStudent?.id,
                                            remark: 'R.A.S',
                                        })
                                        setModalVisible(false)
                                        // postAttendencesForStudent(key, value, selectedStudent)
                                    }}
                                >
                                    <Checkbox
                                        status={value ? 'checked' : 'unchecked'}
                                        onPress={() => {
                                            addAttendanceDataItem({
                                                [key as string]: true,
                                                student_id: selectedStudent?.id,
                                                remark: 'R.A.S',
                                            })
                                            setModalVisible(false)

                                            // postAttendencesForStudent(key, value, selectedStudent) 
                                        }}
                                    />
                                    <Text style={styles.itemTitleText}>{capitalizeFirstLetter(key)}</Text>
                                </TouchableOpacity>)}

                        </ScrollView>

                    </View>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "100%" }}>
                        <View>
                            {updatingUser && <ActivityIndicator size={"large"} style={{ marginHorizontal: 20 }} />}
                        </View>
                        <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>{I18n.t("Dashboard.MyAbsencesScreen.modalClose")}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
        <Modal
            onBackButtonPress={() => setShowModal(false)}
            onBackdropPress={() => setShowModal(false)}
            // swipeDirection={'down'}

            isVisible={showModal}
            style={styles.modalContent}
            backdropColor={isDarkMode() ? theme.underlayColor : 'black'}>
            <View style={styles.modalView1}>
                <View style={{ alignItems: "center" }}>

                    <View style={styles.viewBar} />
                    <Text style={styles.titleBottonSheet}> Fiche d'appel :</Text>
                    <Divider style={{ width: "50%" }} />
                    <Text style={styles.modalcontainerText}>{"En validant, vous avez la posibilite de remodifier cette fiche."}</Text>
                </View>
                <TouchableOpacity
                    style={{ marginRight: 10, position: "absolute", right: 0, top: 9 }}
                    onPress={() => {
                        setShowModal(false)
                    }}
                >
                    <MaterialCommunityIcons name="close-circle" size={30} color="red" />
                </TouchableOpacity>
                <ScrollView >
                    <View style={styles.contentContainer}>
                        {isLoadingLastAttend &&
                            <View style={styles.emptyData}>
                                <ActivityIndicator color={theme.primary} size={"large"} />
                                <Text style={styles.emptyDataText}>{"chargement..."}</Text>
                            </View>}
                        {(lastAttendence.length <= 0 && !isLoadingLastAttend) &&
                            <View style={styles.emptyData}>
                                <Text style={styles.emptyDataText}>{"Erreur rencontrée lors du chargement de la fiche d'appel."}</Text>
                            </View>}
                        {lastAttendence.length > 0 && lastAttendence?.map((user, index) => (
                            <UserBlock
                                key={index}
                                name={user.name}
                                photoUrl={user.avatar}
                                isPresent={user.attendance_line}
                            />
                        ))}
                    </View>
                </ScrollView>
                <Button
                    mode="contained-tonal"
                    disabled={isLoadingLastAttend}
                    style={{ backgroundColor: isLoadingLastAttend ? theme.gray : theme.primary, paddingHorizontal: 30, marginBottom: 10, marginHorizontal: 10, }}
                    labelStyle={{ color: theme.secondaryText }}
                    onPress={async () => {
                        postLastAttendencesAsNew()
                    }}
                    icon={isLoadingLastAttend ? undefined : "check-underline"}>
                    {isLoadingLastAttend ?
                        <ActivityIndicator color={theme.secondaryText} />
                        : "Valider et modifier"
                    }

                </Button>
            </View>
        </Modal>
        <FAB
            label={I18n.t("Dashboard.MyAbsencesScreen.submitAttendance", { current: attendanceDataList.length, total: attendanceList.length })}
            onPress={() => showCloseSessionAlert()}
            visible={attendanceDataList.length > 0}
            color={theme.secondaryText}
            style={{
                padding: 0,
                bottom: 55,
                alignSelf: "center",
                backgroundColor: theme.primary,
                position: 'absolute',
            }}

        />
        <CustomerLoader loading={loading} theme={theme} I18n={I18n} color={theme.primary} />

    </View>;
    function capitalizeFirstLetter(text: any) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

}

export default MyAbsencesScreen;