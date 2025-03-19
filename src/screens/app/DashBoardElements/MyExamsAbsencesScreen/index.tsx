import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Easing } from "react-native";
import { isDarkMode, useTheme } from "store";
import dynamicStyles from "./styles";
import { getRandomColor, profils, showCustomMessage, Theme } from "utils";
import { FlatList } from "react-native";
import moment from "moment";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Checkbox, Searchbar } from "react-native-paper";
import { Animated } from "react-native";
import useSWRMutation from "swr/mutation";
import { getData, LOCAL_URL, postData } from "apis";
import AttendanceItem from "./Components/AttendenceItem";
import { RefreshControl } from "react-native";


function MyExamsAbsencesScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom, exams } = route.params
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const [updatingUser, setUpdatingUser] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const styles = dynamicStyles(theme)
    const [dataAttend, setDataAttend] = useState<any[]>([]);
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [attendanceList, setAttendanceList] = useState<any[]>([])
    const [refresh, setRefresh] = useState(false);

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
    }, [filteredData]);


    moment.locale("en");
    // const { trigger: getTeacherSubjectInClassRoome } = useSWRMutation(`${LOCAL_URL}/api/attendances/session/room/24/59`, getData)
    const { trigger: getTeacherSubjectInClassRoome } = useSWRMutation(`${LOCAL_URL}/api/attendees/exam/${exams?.id}/${classRoom?.id}`, getData)
    const { trigger: setAttendencesForStudent } = useSWRMutation(`${LOCAL_URL}/api/change-attendee/student/exam/${exams?.id}`, postData)


    const postAttendencesForStudent = async (value: any, student: any, onccesPostAttendences?: () => void,) => {

        setUpdatingUser(true)
        const data = {
            status: value,
            student_id: student?.id,
        }
        try {
            const assigma = await setAttendencesForStudent(data)
            if (!assigma?.success) {
                console.log(assigma);

                showCustomMessage("Information", assigma?.message, "warning", "bottom")
                return;
            }
            showCustomMessage(student?.name, "State updated to " + value, "success", "top")

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
    }, [refresh])







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
                {/* <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => {
                        console.log('Filter clicked');
                    }}
                >
                    <MaterialCommunityIcons name="filter" size={30} color="black" />
                </TouchableOpacity> */}
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
                        setSelectedStudent={onPressAddElement}
                        postAttendencesForStudent={postAttendencesForStudent}
                        item={item}

                    />

                }
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={renderEmptyElement}
            />
        </View>

    </View>;


}

export default MyExamsAbsencesScreen;