import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Easing } from "react-native";
import { isDarkMode, useTheme } from "store";
import dynamicStyles from "./styles";
import { getRandomColor, logo, profils, showCustomMessage, Theme } from "utils";
import { FlatList } from "react-native";
import moment from "moment";
import { Image } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Banner, Button, Checkbox, Divider, Searchbar } from "react-native-paper";
import { Animated } from "react-native";
import Modal from 'react-native-modal';
import { ScrollView } from "react-native-gesture-handler";
import useSWRMutation from "swr/mutation";
import { getData, LOCAL_URL, postData } from "apis";
import AttendanceScreen from "../AttendanceScreen";
import AttendanceItem from "./Components/AttendenceItem";
import { RefreshControl } from "react-native";
import { MyAnimatedBanner } from "components";
import { UserBlock } from "./Components";


function MyAbsencesScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom, subject } = route.params
    const theme = useTheme()
    const [lastAttendence, setLastAttendence] = useState<any[]>([])
    const [lastAttendenceElements, setLastAttendenceElements] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingLastAttend, setIsLoadingLastAttend] = useState(false)
    const [visibleBanner, setVisibleBanner] = useState(false)
    const [updatingUser, setUpdatingUser] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const styles = dynamicStyles(theme)
    const [dataAttend, setDataAttend] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [attendanceList, setAttendanceList] = useState<any[]>([])
    const [refresh, setRefresh] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);


    useLayoutEffect(() => {
        navigation.setOptions({
            title: classRoom?.name + `  -- (${filteredData.length}  Eleve(s))`,
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


    moment.locale("en");
    const { trigger: getTeacherSubjectInClassRoome } = useSWRMutation(`${LOCAL_URL}/api/attendances/session/room/${subject?.id}/${classRoom?.id}`, getData)
    const { trigger: setAttendencesForStudent } = useSWRMutation(`${LOCAL_URL}/api/crud/attendance-line/session/${subject?.id}/${classRoom?.id}`, postData)
    const { trigger: getTeacherTimeTableInClassRoome } = useSWRMutation(`${LOCAL_URL}/api/attendance/room/${classRoom?.id}/from_date?date=${moment(subject?.start_datetime).format("YYYY/MM/DD").toString()}`, getData)
    const { trigger: setLastAttendencesAsCurrent } = useSWRMutation(`${LOCAL_URL}/api/crud/attendances-lines/session/${subject?.id}/${classRoom?.id}/${lastAttendenceElements?.attendance_id}`, postData)


    const getTeacherTimeTableInClassRoom = async () => {
        try {
            setIsLoading(true);
            const res = await getTeacherTimeTableInClassRoome();
            // console.log(res?.data);
            if (res?.success) {
                const timetable: any[] = res?.success ? res?.data : []
                console.log(res);
                setLastAttendence(timetable);
                setLastAttendenceElements(res);
                setVisibleBanner(true)
            } else {
                console.log(res);
                showCustomMessage("Informationdddddddddd", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Informationddddddddddddd", 'Une erreur s\'est produite :' + err?.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
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
            remark: "--"
        }
        try {
            const assigma = await setAttendencesForStudent(data)
            if (!assigma?.success) {
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

    const getTeacherTimeTables = async (relording: boolean) => {
        if (relording)
            setAttendanceList([]);
        try {
            setIsLoading(true);
            const res = await getTeacherSubjectInClassRoome();
            // console.log(";;;;;;;;'''''''", res);
            if (res?.success) {
                const timetable: any[] = res?.success ? res?.data : []
                setAttendanceList(timetable);

            } else {
                showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err?.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoading(false);
            setRefresh(false);
        }

    };

    useEffect(() => {
        getTeacherTimeTables(true)
        getTeacherTimeTableInClassRoom()
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
            if (a.attendance_line === "" && b.attendance_line !== "") {
                return -1;
            } else if (a.attendance_line !== "" && b.attendance_line === "") {
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
            cancelLabel="Annuler"
            confirmAction={toggleModal2}
            modifyLabel="Considérer et modifier"
            message={`L'appel a été fait dans cette classe pendant la période de -- à ${moment(lastAttendenceElements?.end_date).format("HH:mm")} par Mr/Mme. ${lastAttendenceElements?.faculty?.name}. Voulez-vous le considérer et le modifier ?`}

        />
        {showSearch && <Animated.View style={[styles.header, { height: headerHeight }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}>
                <Searchbar
                    placeholder="Search"
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
                    />
                }
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={renderEmptyElement}
            />
        </View>
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
                                        postAttendencesForStudent(key, value, selectedStudent)
                                    }}
                                >
                                    <Checkbox
                                        status={value ? 'checked' : 'unchecked'}
                                        onPress={() => postAttendencesForStudent(key, value, selectedStudent)}
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
                            <Text style={styles.closeButtonText}>Fermer</Text>
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
                    <Text style={styles.titleBottonSheet}>Fiche d'appel : 08h-10h</Text>
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
                        {lastAttendence?.map((user, index) => (
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
    </View>;
    function capitalizeFirstLetter(text: any) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

}

export default MyAbsencesScreen;