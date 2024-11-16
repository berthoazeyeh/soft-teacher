import { useEffect, useState, } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { I18n } from 'i18n';
import { Header, TaskItemTimeTable, VehicleItem } from './components';
import { clearUserStored, selectLanguageValue, useCurrentUser, useTheme } from 'store';
import dynamicStyles from './style';
import { Image } from 'react-native';
import { groupByDay, ImageE1, showCustomMessage, Theme } from 'utils';
import { Divider, ProgressBar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getData, LOCAL_URL } from 'apis';
import useSWR from 'swr';
import { Eleve } from 'models';
import moment from 'moment';
import useSWRMutation from 'swr/mutation';
import 'moment/locale/fr';

interface Evaluation {
    date: string,
    matiere: string,
    pointEs: string[]
}


function HomeScreen(props: any): React.JSX.Element {
    const { navigation } = props;
    const theme = useTheme()
    const styles = dynamicStyles(theme)
    const user = useCurrentUser();
    const dispatch = useDispatch()
    const [classRoom, setClassRoom] = useState<any[]>([
    ])
    const [teacherExams, setTeacherExams] = useState<any[]>([])
    const [timeTables, setTimeTables] = useState<any[]>([])
    const [attendance, setAttendance] = useState<any[]>([])
    const [submitedAssignment, setSubmitedAssignment] = useState<any[]>([])
    const [selectedClasse, setSelectedClasse] = useState<Eleve>()
    const [refresh, setRefresh] = useState(false)
    const [isLoadingSubmitedAssignment, setIsLoadingSubmitedAssignment] = useState(true)
    const [isLoadingTimetable, setIsLoadingTimetable] = useState(true)
    const [isLoadingAttendances, setIsLoadingAttendances] = useState(true)
    const [isLoadingExams, setIsLoadingExams] = useState(true)
    const [visible, setVisible] = useState(false)
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [classRoomIndex, setClassRoomIndex] = useState(1);
    const language = useSelector(selectLanguageValue);





    const onMenuPressed = (val: boolean) => {
        setVisible(val)
    }
    const { data, error, isLoading } = useSWR(`${LOCAL_URL}/api/rooms/faculty/${user?.id}`,
        getData,
        {
            refreshInterval: 100000,
            refreshWhenHidden: true,
        },
    );
    const days: any = {
        1: 'monday', 2: 'tuesday', 3: 'wednesday', 4: 'thursday', 5: 'friday', 6: 'saturday', 0: 'sunday'
    };
    const { trigger: getTeacherClassRoome } = useSWRMutation(`${LOCAL_URL}/api/rooms/faculty/${user?.id}`, getData)
    const { trigger: getTeacherTimeTable } = useSWRMutation(`${LOCAL_URL}/api/timesheet/faculty/${user?.id}/${classRoom.length > 0 && classRoom[classRoomIndex].id}`, getData)
    const { trigger: getTeacherSubjectInClassRoome } = useSWRMutation(`${LOCAL_URL}/api/timesheet/faculty/${user?.id}/${classRoom.length > 0 && classRoom[classRoomIndex].id}/${days[moment().format("d")]}`, getData)
    const { trigger: getTeacherExamsInClassRoome } = useSWRMutation(`${LOCAL_URL}/api/op.exam/search`, getData)
    const { trigger: getTeacherExamsInClassRooms } = useSWRMutation(`${LOCAL_URL}/api/exams/from_date/${classRoom.length > 0 && classRoom[classRoomIndex].id}?date_exam=${moment().format("YYYY/MM/DD").toString()}`, getData)

    const incrementClassRoom = () => {
        if (classRoomIndex >= classRoom?.length - 1) {
            return
        }
        setClassRoomIndex((prevDate: any) => classRoomIndex + 1);
    };

    const decrementClassRoom = () => {
        if (classRoomIndex <= 0) {
            return
        }
        setClassRoomIndex((prevDate: any) => classRoomIndex - 1);
    };

    moment.locale(language);

    const getTeacherClassRoom = async () => {
        const classe = await getTeacherClassRoome();
        if (classe?.success) {
            const assigms: any[] = classe?.success ? classe?.data : []
            setClassRoom(assigms);
            console.log("getTeacherClassRoom------size-------", assigms.length);
            setClassRoomIndex(0);
        } else {
        }
    };
    const getTeacherTimeTables = async () => {
        if (classRoom.length <= 0) {
            setIsLoadingTimetable(false);
            return;
        }
        setTimeTables([]);
        try {
            setIsLoadingTimetable(true);
            const res = await getTeacherTimeTable();
            if (res?.success) {
                const timetable: any[] = res?.success ? res?.data : []
                const timeTablesFormated = Object.entries(groupByDay(timetable));
                setTimeTables(timeTablesFormated);
                console.log("getTeacherTimeTables------size-------", timeTablesFormated.length);
            } else {
                showCustomMessage("Information", res.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoadingTimetable(false);
            setRefresh(false);
        }

    };

    const getTeacherTimeTablesAttendence = async () => {
        if (classRoom.length <= 0) {
            setIsLoadingAttendances(false);
            return;
        }
        setAttendance([]);
        try {
            setIsLoadingAttendances(true);
            const res = await getTeacherSubjectInClassRoome();
            if (res?.success) {
                const timetable: any[] = res?.success ? res?.data : []
                const fogot: any[] = timetable.filter(item => !item.attendance_sheet)
                const finalData = fogot.map((item) => ({ ...item, isExams: false }))
                setAttendance(finalData);
            } else {
                showCustomMessage("Information", res.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoadingAttendances(false);
        }

    };
    const getTeacherExamsInClassRoom = async () => {
        if (classRoom.length <= 0) {
            setIsLoadingAttendances(false);
            return;
        }
        try {
            setIsLoadingAttendances(true);
            const res = await getTeacherExamsInClassRoome();
            if (res?.success) {
                const timetable: any[] = res?.success ? res?.data : []
                const fogot: any[] = timetable.filter(item => !item.attendance_sheet)
                const finalData = fogot.map((item) => ({ ...item, isExams: true }))
                // console.log(finalData[0]);
                setAttendance((prevState) => [...prevState, ...finalData]);
            } else {
                console.log('Une erreur s\'est produite :', res);
                showCustomMessage("Information", res.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoadingAttendances(false);
        }

    };
    const getTeacherExamsInClassRoomBydate = async () => {
        if (classRoom.length <= 0) {
            setIsLoadingExams(false);
            return;
        }
        try {
            setIsLoadingExams(true);
            const res = await getTeacherExamsInClassRooms();
            if (res?.success) {
                const exam: any[] = res?.success ? res?.data : []
                const fogot: any[] = exam.filter(item => !item.attendance_sheet)
                const finalData = fogot.map((item) => ({ ...item, isExams: true }))
                // console.log(res);
                setTeacherExams(finalData);
            } else {
                showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err?.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoadingExams(false);
        }

    };
    useEffect(() => {
        getTeacherClassRoom();
        setTimeout(() => {
            setRefresh(false);
        }, 3000);
    }, [selectedClasse, refresh])


    useEffect(() => {
        setAttendance([])
        getTeacherTimeTables();
        getTeacherTimeTablesAttendence();
        getTeacherExamsInClassRoom();
        getTeacherExamsInClassRoomBydate()
    }, [classRoomIndex, refresh])


    useEffect(() => {
        if (data?.success) {
            setClassRoom(data?.data);
        }
    }, [data])


    const renderHeader = () => (
        <View
            style={styles.logo}>
            <Image
                source={ImageE1}
                style={{
                    resizeMode: "cover", flex: 1, width: "100%", height: 200
                }} />
            <TouchableOpacity

                style={styles.TitleContainer}>
                <Text style={styles.fieldText}>{I18n.t('Home.myClassrooms')} ({classRoom?.length})</Text>
            </TouchableOpacity>
            <Divider />
        </View>
    );

    const handleNavigationPressed = (screen: string, other?: any) => {

        if (other) {
            navigation.navigate('DashboadElementStacks', {
                screen: screen,
                params: {
                    classRoom: classRoom[classRoomIndex],
                    ...other,
                },
            });
            return;
        }
        navigation.navigate('DashboadElementStacks', {
            screen: screen,
            params: {
                classRoom: classRoom[classRoomIndex],
            },
        });
    }
    const renderWorkHeader = (text: string, screen: string, other?: any) => (
        <View
            style={styles.logo}>
            <TouchableOpacity style={styles.TitleContainer}
                onPress={() => handleNavigationPressed(screen, other)}>
                <Text style={styles.fieldText}>{text}</Text>
            </TouchableOpacity>
            <Divider />
            <View style={styles.headerTimeConatiner}>
                <TouchableOpacity disabled={classRoomIndex <= 0} onPress={decrementClassRoom}>
                    <MaterialCommunityIcons name='chevron-left-circle' size={25} color={classRoomIndex <= 0 ? theme.gray : theme.primaryText} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.classRoomContainer}
                    onPress={() => handleNavigationPressed(screen, other)}>
                    <Text style={styles.classRoomText}>{classRoom && classRoom.length > 0 && classRoom[classRoomIndex].name}</Text>
                    <MaterialCommunityIcons name='chevron-down' size={25} color={theme.primary} />
                </TouchableOpacity>

                <TouchableOpacity disabled={classRoomIndex >= classRoom?.length - 1} onPress={incrementClassRoom}>
                    <MaterialCommunityIcons name='chevron-right-circle' size={25} color={classRoomIndex >= classRoom?.length - 1 ? theme.gray : theme.primaryText} />
                </TouchableOpacity>
            </View>
        </View>
    );



    const renderMoreLinkHeader = (text: string) => (
        <View
            style={styles.logo}>
            <TouchableOpacity style={styles.TitleContainer}>
                <Text style={styles.fieldText}>{text}</Text>
            </TouchableOpacity>
            <Divider />
        </View>
    );



    const renderTimeTable = () => (
        <View style={styles.logo}>
            <FlatList
                data={timeTables}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => <TaskItemTimeTable item={item} theme={theme} key={index} />}
                scrollEnabled={false}
                nestedScrollEnabled={false}
                style={{ backgroundColor: theme.primaryBackground, marginHorizontal: 10, borderWidth: 1, borderColor: theme.gray3, elevation: 2, paddingBottom: 10 }}
                ListHeaderComponent={() => renderWorkHeader(I18n.t('Home.renderTimetableHeader') + ` (${(timeTables?.length)})`, "MyTimeTableScreen")}
                ListEmptyComponent={() => renderEmptyVehiclesElement(I18n.t('Home.renderEmptyTimetable'), isLoadingTimetable)} />
            <TouchableOpacity
                style={{ position: "absolute", right: 5, top: -10, backgroundColor: theme.gray4, borderRadius: 20, padding: 5 }}
                onPress={() => handleNavigationPressed("MyTimeTableScreen")}>
                <MaterialCommunityIcons name='arrow-top-right' size={20} color={"white"} />
            </TouchableOpacity>
            {1 >= 2 && renderSeeMoreSub("MyTimeTableScreen")}

        </View>
    );
    const renderFogotAttendences = () => (
        <View style={styles.logo}>
            <FlatList
                data={attendance}
                keyExtractor={(item, index) => index.toString()}
                renderItem={
                    ({ item }) =>
                        <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 10, gap: 5 }}
                            onPress={() => {
                                if (item.isExams) {
                                    navigation.navigate('DashboadElementStacks', {
                                        screen: "MyExamsAbsencesScreen",
                                        params: {
                                            classRoom: classRoom[classRoomIndex],
                                            exams: item
                                        },
                                    });
                                } else {
                                    navigation.navigate('DashboadElementStacks', {
                                        screen: "MyAbsencesScreen",
                                        params: {
                                            classRoom: classRoom[classRoomIndex],
                                            subject: item
                                        },
                                    });
                                }
                            }}>
                            {!item.isExams && <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                                <View style={{ justifyContent: "space-between", flexDirection: "column" }} >
                                    <Text style={{ alignItems: "center", alignContent: "center", ...Theme.fontStyle.montserrat.bold, color: theme.gray4 }}>
                                        {item?.subject_id?.name}
                                    </Text >
                                    <Text style={{ ...Theme.fontStyle.montserrat.regular, color: item.isPresent ? theme.primaryText : "red" }}>
                                        {moment(item?.end_datetime).format("dddd DD  HH:mm")}
                                    </Text>
                                </View>
                                <Text style={{ alignItems: "center", textAlign: "center", alignContent: "center", ...Theme.fontStyle.montserrat.bold, color: theme.secondaryText, backgroundColor: theme.primary, paddingHorizontal: 10, paddingVertical: 5, }}>
                                    {I18n.t('Home.course')}
                                </Text >
                            </View>}
                            {item.isExams && <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                                <View style={{ justifyContent: "space-between", flexDirection: "column" }} >
                                    <Text style={{ alignItems: "center", alignContent: "center", ...Theme.fontStyle.montserrat.bold, color: theme.gray4 }}>
                                        {item?.name}
                                    </Text >
                                    <Text style={{ ...Theme.fontStyle.montserrat.regular, color: item.isPresent ? theme.primaryText : "red" }}>
                                        {moment(item?.end_time).format("dddd DD  HH:mm")}
                                    </Text>

                                </View>
                                <Text style={{ alignItems: "center", textAlign: "center", alignContent: "center", ...Theme.fontStyle.montserrat.bold, color: theme.secondaryText, backgroundColor: theme.primary, paddingHorizontal: 10, paddingVertical: 5, }}>
                                    {"Examen"}
                                </Text >
                            </View>}
                            <Divider />
                        </TouchableOpacity>
                }
                scrollEnabled={false}
                nestedScrollEnabled={false}
                style={{ backgroundColor: theme.primaryBackground, marginHorizontal: 10, borderWidth: 1, borderColor: theme.gray3, elevation: 2, paddingBottom: 10 }}
                ListHeaderComponent={() => renderWorkHeader(I18n.t('Home.unmarkedAttendance') + ` (${(attendance?.length)})`, "CourcesListeScreen", { nexScreen: "MyAbsencesScreen" })}
                ListEmptyComponent={() => renderEmptyVehiclesElement(I18n.t('Home.renderEmptyunmarkedAttendance'), isLoadingAttendances)} />
            <TouchableOpacity
                style={{ position: "absolute", right: 5, top: -10, backgroundColor: theme.gray4, borderRadius: 20, padding: 5 }}
                onPress={() => handleNavigationPressed("CourcesListeScreen", { nexScreen: "MyAbsencesScreen" })}>
                <MaterialCommunityIcons name='arrow-top-right' size={20} color={"white"} />
            </TouchableOpacity>
            {attendance.length >= 2 && renderSeeMoreSub("CourcesListeScreen", { nexScreen: "MyAbsencesScreen" })}

        </View>
    );
    const renderGardeBook = () => (
        <View style={styles.logo}>
            <FlatList
                data={teacherExams}
                keyExtractor={(item, index) => index.toString()}
                renderItem={
                    ({ item }) =>
                        <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 10, gap: 5 }}
                            onPress={() => {
                                navigation.navigate('DashboadElementStacks', {
                                    screen: "GradeEntryScreen",
                                    params: {
                                        classRoom: classRoom[classRoomIndex],
                                        exams: item
                                    },
                                });
                            }}
                        >
                            <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                                <Text style={{ alignItems: "center", alignContent: "center", ...Theme.fontStyle.montserrat.bold, color: theme.gray4 }}>
                                    {item.name}
                                </Text >
                                <Text style={{ alignItems: "center", alignContent: "center", ...Theme.fontStyle.montserrat.bold, color: theme.gray4 }}>

                                </Text >
                            </View>
                            <View style={{ justifyContent: "space-between", flexDirection: "row" }} >
                                <Text style={{ ...Theme.fontStyle.montserrat.regular, color: item.isPresent ? theme.primaryText : "red" }}>
                                    {moment(item?.end_time).format("dddd DD HH:mm")} - {item?.subject_id?.name}

                                </Text>

                            </View>
                        </TouchableOpacity>
                }
                scrollEnabled={false}
                nestedScrollEnabled={false}
                style={{ backgroundColor: theme.primaryBackground, marginHorizontal: 10, borderWidth: 1, borderColor: theme.gray3, elevation: 2, paddingBottom: 10 }}
                ListHeaderComponent={() => renderWorkHeader(I18n.t('Home.gradeEntry'), "GradeEntryScreen")}
                ListEmptyComponent={() => renderEmptyVehiclesElement(I18n.t('Home.renderEmptyGradeBook'), isLoadingExams)} />
            <TouchableOpacity
                style={{ position: "absolute", right: 5, top: -10, backgroundColor: theme.gray4, borderRadius: 20, padding: 5 }}
                onPress={() => handleNavigationPressed("GradeEntryScreen")}>
                <MaterialCommunityIcons name='arrow-top-right' size={20} color={"white"} />
            </TouchableOpacity>
            {/* {studentNote.length >= 2 && renderSeeMoreSub("GradeBookScreen")} */}

        </View>
    );



    const renderAssignmentNote = () => (
        <View style={styles.logo}>
            <FlatList
                data={submitedAssignment}
                keyExtractor={(item, index) => index.toString()}
                renderItem={
                    ({ item }) =>
                        <View style={{ paddingHorizontal: 10, paddingVertical: 10, gap: 5 }}>
                            <View style={{ justifyContent: "space-between", flexDirection: "row" }}>
                                <Text style={{ alignItems: "center", alignContent: "center", ...Theme.fontStyle.montserrat.bold, color: theme.gray4 }}>
                                    {item.name}
                                </Text >
                                <Text style={{ alignItems: "center", alignContent: "center", ...Theme.fontStyle.montserrat.bold, color: theme.gray4 }}>
                                    {item.marks}/20
                                </Text >
                            </View>
                            <View style={{ justifyContent: "space-between", flexDirection: "row" }} >
                                <Text style={{ ...Theme.fontStyle.montserrat.regular, color: item.isPresent ? theme.primaryText : "red" }}>{item.date}</Text>
                                <Text style={{ alignItems: "center", alignContent: "center", ...Theme.fontStyle.montserrat.bold, color: theme.gray4 }}>
                                    {item.status}
                                </Text >
                            </View>
                        </View>
                }
                scrollEnabled={false}
                nestedScrollEnabled={false}
                style={{ backgroundColor: theme.primaryBackground, marginHorizontal: 10, borderWidth: 1, borderColor: theme.gray3, elevation: 2, paddingBottom: 10 }}
                ListHeaderComponent={() => renderWorkHeader("Mes travaux à réaliser", "AssignmentsScreen")}
                ListEmptyComponent={() => renderEmptyVehiclesElement(I18n.t('Home.renderEmptyAssignmentNote'), isLoadingSubmitedAssignment)} />
            <TouchableOpacity
                style={{ position: "absolute", right: 5, top: -10, backgroundColor: theme.gray4, borderRadius: 20, padding: 5 }}
                onPress={() => handleNavigationPressed("AssignmentsScreen")}>
                <MaterialCommunityIcons name='arrow-top-right' size={20} color={"white"} />
            </TouchableOpacity>
            {submitedAssignment.length >= 2 && renderSeeMoreSub("AssignmentsScreen")}
        </View>
    );


    const renderMoreLink = () => (
        <View style={styles.logo}>
            <FlatList
                data={[
                ]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={
                    ({ item, index }: any) => <View>
                        <TouchableOpacity
                            style={{ padding: 10, backgroundColor: theme.gray3, borderRadius: 10, marginBottom: 10, marginHorizontal: 10 }}
                            onPress={() => handleNavigationPressed(item.screen)}>
                            <Text style={{ color: "blue", ...Theme.fontStyle.montserrat.bold }}>{item.name}</Text>
                        </TouchableOpacity>
                    </View>
                }
                scrollEnabled={false}
                nestedScrollEnabled={false}
                style={{ backgroundColor: theme.primaryBackground, marginHorizontal: 10, borderWidth: 1, borderColor: theme.gray3, elevation: 2, paddingBottom: 10 }}
                ListHeaderComponent={() => renderMoreLinkHeader("Agenda")}
            />
        </View>
    );


    const renderEmptyStudentElement = () => (
        <View style={styles.emptyData}>
            {isLoading &&
                <ActivityIndicator color={theme.primary} size={25} />}
            {error &&
                <Text style={styles.emptyDataText}>{error.message}</Text>}
            {!error &&
                <Text style={styles.emptyDataText}>{I18n.t("Home.notstudentFound")}</Text>}
        </View>
    );
    const renderEmptyVehiclesElement: any = (message: any, isLoading: boolean) => (
        <View style={styles.emptyData}>
            {isLoading && <>
                <ActivityIndicator color={theme.primary} size={25} />
                <Text style={styles.emptyDataText}>{I18n.t("Home.loading")}</Text>
            </>
            }
            {!isLoading &&
                <Text style={styles.emptyDataText}>{message ? message : I18n.t("Home.notVehicleFound")}</Text>}
        </View>
    );
    const handlePresseLiveTrakingButton = (item: any) => {

        navigation.navigate('StudentActivitieScreen', {
            children: item
        })

    }


    const renderSeeMore = (sreen: string) => {
        return <View style={{}}>
            <TouchableOpacity
                style={{ padding: 10, borderRadius: 10, marginBottom: 10 }}
                onPress={() => {
                    navigation.navigate(sreen)
                }}
            >
                <Text style={{ color: "blue", textAlign: "center", fontSize: 18, fontWeight: "bold" }}>
                    {I18n.t('more_link')}
                    <MaterialCommunityIcons name='arrow-top-right' size={20} color={"blue"} />
                </Text>
            </TouchableOpacity>
        </View>
    }
    const renderSeeMoreSub = (sreen: string, other?: any) => {
        return <View style={{}}>
            <TouchableOpacity
                style={{ padding: 10, borderRadius: 10, marginBottom: 10 }}
                onPress={() => {
                    handleNavigationPressed(sreen, other)
                }}
            >
                <Text style={{ color: "blue", textAlign: "center", fontSize: 18, fontWeight: "bold" }}>
                    {I18n.t('more_link')}
                    <MaterialCommunityIcons name='arrow-top-right' size={20} color={"blue"} />
                </Text>
            </TouchableOpacity>
        </View>
    }


    return (
        <View style={styles.container}>
            <Header navigation={navigation} title={I18n.t("Home.title")} visible={visible} theme={theme} onLogoutPressed={() => {
                dispatch(clearUserStored(null))
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'AuthStacks' }],
                })
                console.log("log out");
            }} setVisible={onMenuPressed} />
            <ProgressBar progress={scrollPercentage} color={theme.primary} />
            <ScrollView
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => {
                            setRefresh(true)
                        }}
                    />}
            >
                <FlatList
                    scrollEnabled={false}
                    nestedScrollEnabled={false}
                    ListHeaderComponent={renderHeader}
                    data={classRoom}
                    renderItem={({ item, index }) => <VehicleItem
                        item={item}
                        index={index}
                        I18n={I18n}
                        handlePresseLiveTrakingButton={() => handlePresseLiveTrakingButton(item)}
                        navigation={navigation}
                        isSelected={item?.id === selectedClasse?.id}
                        setSelectedStudent={selectedClasse}
                    />}
                    keyExtractor={item => (item.id).toString()}
                    // ListFooterComponent={() => classRoom.length >= 2 ? renderSeeMore("StudentListScreen") : null}
                    ListEmptyComponent={renderEmptyStudentElement}
                />

                <MyDivider theme={theme} />
                {renderTimeTable()}
                <MyDivider theme={theme} />
                {renderFogotAttendences()}
                <MyDivider theme={theme} />
                {renderGardeBook()}
                <MyDivider theme={theme} />
                {/* {renderAssignmentNote()}
                <MyDivider theme={theme} />
                {renderMoreLink()} */}
            </ScrollView>
        </View>
    );



}

const MyDivider = ({ theme }: any) => {
    return <Divider style={{ backgroundColor: theme.gray4, marginVertical: 10, }} />
}

export default HomeScreen