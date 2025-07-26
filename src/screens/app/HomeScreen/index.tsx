import { useEffect, useState, } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { I18n } from 'i18n';
import { Header, TaskItemTimeTable, VehicleItem } from './components';
import { clearUserStored, selectLanguageValue, updateBannerMessageIndex, updateSyncing, useCurrentBannerMessageIndex, useCurrentUser, useMustSuncFirtTime, useTheme } from 'store';
import dynamicStyles from './style';
import { Image } from 'react-native';
import { displayScheduledNotification, groupByDay, ImageE1, showCustomMessage, Theme } from 'utils';
import { Divider, ProgressBar, Searchbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getData, LOCAL_URL } from 'apis';
import useSWR from 'swr';
import { Eleve } from 'models';
import moment from 'moment';
import useSWRMutation from 'swr/mutation';
import 'moment/locale/fr';
import React from 'react';
import { getClassrooms, syncAllClassrooms } from 'services';
import { clearCustomTables, db } from 'apis/database';
import { getSessionsFilter, syncAllSessions } from 'services/SessionsServices';
import { clearManyToManyRelations, syncAllStudentsNew } from 'services/StudentsServices';
import { SyncingModal } from './components/SyncingModal';
import { UnSyncModal } from './components/UnSyncModal';
import { insertOrUpdateAssignments, insertOrUpdateAssignmentTypes } from 'services/AssignmentsServices';
import { insertOrUpdateSubjectsList } from 'services/SubjectsServices';
import { syncOnlineAttendanceLines } from 'services/AttendanceLineServices';
import { FacultyAttendance } from 'services/CommonServices';
import { syncOnlineFacultyAttendances } from 'services/FacultyAttendanceServices';

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
    const currentBannerMessageIndex = useCurrentBannerMessageIndex();
    const mustSuncFirtTime = useMustSuncFirtTime();
    const dispatch = useDispatch()
    const [classRoom, setClassRoom] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [secondaryClassRoom, setSecondaryClassRoom] = useState<any[]>([])
    const [teacherExams, setTeacherExams] = useState<any[]>([])
    const [timeTables, setTimeTables] = useState<any[]>([])
    const [attendance, setAttendance] = useState<any[]>([])
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [selectedClasse, setSelectedClasse] = useState<Eleve>()
    const [refresh, setRefresh] = useState(false)
    const [isLoadingTimetable, setIsLoadingTimetable] = useState(true)
    const [isLoadingAttendances, setIsLoadingAttendances] = useState(true)
    const [isLoadingExams, setIsLoadingExams] = useState(true)
    const [visible, setVisible] = useState(false)
    const [isLocalLoading, setIsLocalLoading] = useState(false)
    const [isSyncing, setIsSyncing] = useState(false)

    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [classRoomIndex, setClassRoomIndex] = useState(-1);
    const [showSearch, setShowSearch] = useState(false);
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

    const { trigger: getTeacherClassRoome } = useSWRMutation(`${LOCAL_URL}/api/rooms/faculty/${user?.id}`, getData)
    const { trigger: getAllTeachersClassRoomStudent } = useSWRMutation(`${LOCAL_URL}/api/teacher/classes/${user?.id}`, getData)
    const { trigger: getAllTeachersAttendencesStudent } = useSWRMutation(`${LOCAL_URL}/api/attendance-lines/${user?.id}`, getData)
    const { trigger: getAllTeacherAttendancesLine } = useSWRMutation(`${LOCAL_URL}/api/attendances/faculty/${user?.id}`, getData)
    // const { trigger: getAllTeachersClassRoomStudent } = useSWRMutation(`${LOCAL_URL}/api/students/rooms/faculty/${user?.id}`, getData)
    const { trigger: getAllTeacherTimeTable } = useSWRMutation(`${LOCAL_URL}/api/timesheet/faculty/${user?.id}`, getData)
    const { trigger: getAssignmentTypes } = useSWRMutation(`${LOCAL_URL}/api/grading.assignment.type/search`, getData)
    const { trigger: getAllSubjects } = useSWRMutation(`${LOCAL_URL}/api/op.subject/search?fields=['name','code', 'type', 'subject_type']`, getData)

    const { trigger: getTeacherTimeTable } = useSWRMutation(`${LOCAL_URL}/api/timesheet/faculty/${user?.id}/${classRoom.length > 0 && classRoom[classRoomIndex]?.id}?day=${moment().format("YYYY-MM-DD")}`, getData)
    const { trigger: getTeacherSubjectInClassRoome } = useSWRMutation(`${LOCAL_URL}/api/timesheet/faculty/${user?.id}/${classRoom.length > 0 && classRoom[classRoomIndex]?.id}?day=${moment().format("YYYY-MM-DD")}`, getData)
    const { trigger: getTeacherExamsInClassRoome } = useSWRMutation(`${LOCAL_URL}/api/op.exam/search`, getData)
    const { trigger: getTeacherExamsInClassRooms } = useSWRMutation(`${LOCAL_URL}/api/exams/from_date/${classRoom.length > 0 && classRoom[classRoomIndex]?.id}?date_exam=${moment().format("YYYY/MM/DD").toString()}`, getData)



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
            const assigms: any = classe?.success ? classe?.data : {}
            setClassRoom(assigms?.rooms);
            setSecondaryClassRoom(assigms?.diffuser_rooms)
            // console.log("getTeacherClassRoom------size-------", assigms);
            if (classRoomIndex < 0) {
                setClassRoomIndex(0);
            }

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
                console.log("getTeacherTimeTables------size-------", timetable);
                setTimeTables(timeTablesFormated.slice(0, 3));
            } else {
                showCustomMessage("Information", res.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
            // console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoadingTimetable(false);
            setRefresh(false);
        }

    };


    async function fetchLocalTeacherTimeTablesData(isSilent?: boolean) {
        if (!user) return;
        try {
            setIsLoadingTimetable(true);
            if (!isSilent) {
                setTimeTables([]);
            }
            // TODO
            const res0 = await getSessionsFilter(
                db,
                user?.id,
                classRoom.length > 0 ? classRoom[classRoomIndex]?.id : undefined,
                moment().format("YYYY-MM-DD")
            );
            if (res0.success && res0.data) {
                console.log(res0.error, res0.data.length);
                const timeTablesFormated = Object.entries(groupByDay(res0.data));
                setTimeTables(timeTablesFormated);
            } else {
                showCustomMessage("Information", res0.error, "warning", "bottom")
            }
        } catch (error) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + error, "warning", "bottom")
        } finally {
            setIsLoadingTimetable(false);
            setRefresh(false);
        }
    }


    const getTeacherTimeTablesAttendence = async () => {
        if (!user) return;

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
                setAttendance(finalData.slice(0, 3));
            } else {
                showCustomMessage("Information", res.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
            // console.error('Une erreur s\'est produite :', err);
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
                setAttendance((prevState) => [...prevState, ...finalData.slice(0, 3)]);
            } else {
                console.log('Une erreur s\'est produite :', res);
                showCustomMessage("Information", res.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
            // console.error('Une erreur s\'est produite :', err);
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
                setTeacherExams(finalData.slice(0, 3));
            } else {
                showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err?.message, "warning", "bottom")
            // console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoadingExams(false);
        }

    };
    useEffect(() => {
        if (!mustSuncFirtTime) {
            fetchClassrooms();
            if (refresh) {
                setTimeout(() => {
                    setRefresh(false);
                }, 3000);
            }
        }
    }, [refresh, mustSuncFirtTime])
    useEffect(() => {

        // {
        //     icon: 'ic_start',
        //     title: '🚀Appuyez signaler le début',
        //     pressAction: { id: 'start+10' },
        // },
        // {
        //     title: '✅ Signaler la fin',
        //     pressAction: { id: 'end' },
        // },
        if (!mustSuncFirtTime && user?.id) {
            setAttendance([])
            fetchLocalTeacherTimeTablesData()
            if (refresh) {
                setTimeout(() => {
                    setRefresh(false);
                }, 3000);
            }
        }
    }, [refresh, classRoomIndex, mustSuncFirtTime])


    useEffect(() => {
        if (user?.id && classRoomIndex >= 0) {
            getTeacherTimeTablesAttendence();
            getTeacherExamsInClassRoom();
            getTeacherExamsInClassRoomBydate()
        }

    }, [classRoomIndex, refresh])

    async function syncClassrooms() {
        try {
            const classe = await getTeacherClassRoome();
            if (classe?.success) {
                const ClassRoom: any = classe?.success ? classe?.data : {}
                if (mustSuncFirtTime) {
                    await clearCustomTables(["classrooms"]);
                }
                const res1 = await syncAllClassrooms(ClassRoom?.rooms ?? [], db, false, user?.id)
                console.log("Sync successful:------rooms", res1);
                const res2 = await syncAllClassrooms(ClassRoom?.diffuser_rooms ?? [], db, true, user?.id)
                console.log("Sync successful:-----diffuser_rooms.", res2);
            } else {
                if (mustSuncFirtTime)
                    showCustomMessage("Information", 'Une erreur s\'est produite :' + (classe?.message ?? ""), "warning", "bottom")
            }
        } catch (error: any) {
            if (mustSuncFirtTime)

                showCustomMessage("Information", 'Une erreur s\'est produite :' + error?.message, "warning", "bottom")
        }
    }
    const syncTimeTable = async () => {
        try {
            const res = await getAllTeacherTimeTable();
            if (res?.success) {
                const timetable: any[] = res?.success ? res?.data : []
                console.log("getTeacherTimeTables------size-------", timetable.length);
                try {
                    const insertRes = await syncAllSessions(timetable, db, user?.id);
                    console.log("getTeacherTimeTables------size-------", timetable.length, "insertRes");
                } catch (error: any) {
                    console.log("getTeacherTimeTables------size-------", error);
                    if (mustSuncFirtTime)
                        showCustomMessage("Information1", error?.message ?? '', "warning", "bottom")
                }
            } else {
                console.log(res);
                if (mustSuncFirtTime)
                    showCustomMessage("Information1", res?.message ?? '', "warning", "bottom")
            }
        } catch (err: any) {
            if (mustSuncFirtTime)
                showCustomMessage("Information", 'Une erreur s\'est produite :' + (err?.message ?? ''), "warning", "bottom")
        }

    };
    const syncTeacherAttendancesLine = async () => {
        try {
            const res = await getAllTeacherAttendancesLine();
            console.log("getAllTeacherAttendancesLine------size-------", res?.data);
            // return;
            if (res?.success) {
                const data: any[] = res?.success ? res?.data : []
                try {
                    console.log(mustSuncFirtTime);

                    // if (mustSuncFirtTime) {
                    // }
                    const insertRes = await syncOnlineFacultyAttendances(db, data, false);
                    console.log("syncTeacherAttendancesLine------size-------", insertRes, "insertRes");
                } catch (error: any) {
                    console.log("syncTeacherAttendancesLine------size-------", error);
                    if (mustSuncFirtTime)
                        showCustomMessage("Information1", error?.message ?? '', "warning", "bottom")
                }
            } else {
                console.log(res);
                if (mustSuncFirtTime)
                    showCustomMessage("Information1", res?.message ?? '', "warning", "bottom")
            }
        } catch (err: any) {
            if (mustSuncFirtTime)
                showCustomMessage("Information", 'Une erreur s\'est produite :' + (err?.message ?? ''), "warning", "bottom")
        }

    };
    const syncStudents = async () => {
        try {
            const resStudent = await getAllTeachersClassRoomStudent();
            if (resStudent?.success) {
                const student: any[] = resStudent?.success ? resStudent?.data : []
                const clear = await clearManyToManyRelations(db);
                console.log(clear);
                console.log("student.length;", student.length);
                for (let index = 0; index < student.length; index++) {
                    const element = student[index];
                    const tmp = await syncAllStudentsNew(element.students, db, element?.id);
                    console.log(tmp);
                }
            } else {
                console.log(resStudent);
                if (mustSuncFirtTime)
                    showCustomMessage("Information1", resStudent?.message ?? '', "warning", "bottom")
            }
        } catch (err: any) {
            if (mustSuncFirtTime)
                showCustomMessage("Information", 'Une erreur s\'est produite :' + (err?.message ?? ''), "warning", "bottom")
            console.log('Une erreur s\'est produite :', err);
        } finally {

        }
    };
    const syncAllAttendenses = async () => {
        try {
            const resStudent = await getAllTeachersAttendencesStudent();
            if (resStudent?.success) {
                const attendanceLine: any[] = resStudent?.success ? resStudent?.data : []
                // console.log("student", attendanceLine);
                console.log("student.length;", attendanceLine.length);
                if (mustSuncFirtTime) {
                    await clearCustomTables(["attendanceLine"]);
                }
                const tmp = await syncOnlineAttendanceLines(db, attendanceLine, false);
                console.log(tmp);
            } else {
                console.log(resStudent);
                if (mustSuncFirtTime)
                    showCustomMessage("Information1", resStudent?.message ?? '', "warning", "bottom")
            }
        } catch (err: any) {
            if (mustSuncFirtTime)
                showCustomMessage("Information", 'Une erreur s\'est produite :' + (err?.message ?? ''), "warning", "bottom")
            console.log('Une erreur s\'est produite :', err);
        } finally {

        }
    };
    const syncAssignments = async () => {
        try {
            const assigma = await getData(`${LOCAL_URL}/api/assignments/faculty/${user?.id}`)
            console.log("syncAssignments------size-------", assigma?.data);
            if (assigma?.success) {
                const assignments: any[] = assigma?.success ? assigma?.data : []
                try {

                    await clearCustomTables(["assignment_rooms"]);
                    const insertRes = await insertOrUpdateAssignments(db, false, assignments);
                    console.log("syncAssignments------size-------", insertRes, "insertRes");
                } catch (error: any) {
                    console.log("syncAssignments------size-------", error);
                    if (mustSuncFirtTime)
                        showCustomMessage("Information1", error?.message ?? '', "warning", "bottom")
                }
            } else {
                console.log(assigma);
                if (mustSuncFirtTime)
                    showCustomMessage("Information1", assigma?.message ?? '', "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + (err?.message ?? ''), "warning", "bottom")
            // console.error('Une erreur s\'est produite :', err);
        } finally {

        }
    };
    const syncAssignmentsTypes = async () => {
        try {
            const assigmType = await getAssignmentTypes();
            const subjects = await getAllSubjects();
            if (subjects?.success) {
                await insertOrUpdateSubjectsList(subjects?.data ?? []);
            }
            if (assigmType?.success) {
                const assignments: any[] = assigmType?.success ? assigmType?.data : []
                try {
                    const insertRes = await insertOrUpdateAssignmentTypes(assignments, db);
                    console.log("getTeacherTimeTables------size-------", insertRes, "insertRes");
                } catch (error: any) {
                    console.log("getTeacherTimeTables------size-------", error);
                    if (mustSuncFirtTime)
                        showCustomMessage("Information1", error?.message ?? '', "warning", "bottom")
                }
            } else {
                console.log(assigmType);
                if (mustSuncFirtTime)
                    showCustomMessage("Information1", assigmType?.message ?? '', "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + (err?.message ?? ''), "warning", "bottom")
            // console.error('Une erreur s\'est produite :', err);
        } finally {

        }
    };
    async function syncAllDataDown() {
        if (isSyncing || !user) return;
        try {
            setIsSyncing(true)
            // dispatch(updateSyncing(true))
            dispatch(updateBannerMessageIndex(0))
            await syncClassrooms();
            await syncAssignmentsTypes();
            await fetchLocalTeacherTimeTablesData(user);

            dispatch(updateBannerMessageIndex(1))
            await syncTimeTable()
            await syncAllAttendenses();
            dispatch(updateBannerMessageIndex(2))
            await syncStudents();
            dispatch(updateBannerMessageIndex(3))
            await syncAssignments();
            await syncTeacherAttendancesLine();
            dispatch(updateBannerMessageIndex(5))
            dispatch(updateSyncing(false))
        }
        catch (err) {
            setIsSyncing(false)
        }
        finally {
            console.log("sync..................................");
            setIsSyncing(false)
        }
    }

    useEffect(() => {
        if (user) {
            if (refresh) {
                setIsSyncing(false)
            }
            syncAllDataDown().then(() => {
                fetchClassrooms();
            });
        }
    }, [refresh])

    async function fetchClassrooms() {
        try {
            setIsLocalLoading(true);
            const response = await getClassrooms(db, false, user?.id);
            // console.log("Données des classes :", response);
            if (response.success) {
                // console.log("Données des classes :", response.data);
                if (response.data) {
                    setClassRoom(response.data);
                    if (response.data?.length) {
                        setClassRoomIndex(0)
                    }
                }
            } else {
                showCustomMessage("Information", response?.error, "warning", "bottom")

                // console.error("Erreur :", response.error);
            }
            const response1 = await getClassrooms(db, true, user?.id);
            if (response1.success) {
                // console.log("Données des classes :", response1.data);
                if (response1.data) {
                    setSecondaryClassRoom(response1.data);
                }
            } else {
                showCustomMessage("Information", response?.error, "warning", "bottom")

                // console.error("Erreur :", response1.error);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération :", error);
        } finally {
            setIsLocalLoading(false);
        }
    }

    useEffect(() => {
        onChangeSearch(searchQuery)
    }, [classRoom])

    const onChangeSearch = (query: string) => {
        const filtered = [...classRoom, ...(secondaryClassRoom.map(room => { return { ...room, isSecondary: true } }))]?.filter((item: any) =>
            item?.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filtered);
        setSearchQuery(query);
    };


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
                <Text style={styles.fieldText}>{I18n.t('Home.myClassrooms')} ({[...classRoom, ...secondaryClassRoom].length})</Text>
                <TouchableOpacity
                    style={{ marginRight: 10, padding: 2, }}
                    onPress={() => {
                        setShowSearch(true);
                    }}>
                    <MaterialCommunityIcons name='toy-brick-search-outline' size={22} color={theme.primary} />
                </TouchableOpacity>
            </TouchableOpacity>
            <Divider />
            {showSearch && <View style={[styles.header, { height: 60 }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}>
                    <Searchbar
                        placeholder="Search"
                        onChangeText={(d) => {
                            onChangeSearch(d)
                        }}
                        value={searchQuery}
                        right={() =>
                            <TouchableOpacity
                                style={{ marginRight: 10 }}
                                onPress={() => {
                                    setShowSearch(false);
                                    onChangeSearch('')
                                }}>
                                <MaterialCommunityIcons name="close-circle" size={25} color="black" />
                            </TouchableOpacity>}
                        style={{
                            height: 50,
                            borderRadius: 15,
                            flex: 1,
                            backgroundColor: '#f0f0f0',
                        }}
                    />
                </View>
            </View>}
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
                    <Text style={styles.classRoomText}>{classRoom && classRoom.length > 0 && classRoom[classRoomIndex]?.name}</Text>
                    <MaterialCommunityIcons name='chevron-down' size={25} color={theme.primary} />
                </TouchableOpacity>

                <TouchableOpacity disabled={classRoomIndex >= classRoom?.length - 1} onPress={incrementClassRoom}>
                    <MaterialCommunityIcons name='chevron-right-circle' size={25} color={classRoomIndex >= classRoom?.length - 1 ? theme.gray : theme.primaryText} />
                </TouchableOpacity>
            </View>
        </View>
    );





    const renderTimeTable = () => (
        <View style={styles.logo}>
            <FlatList
                data={timeTables.slice(0, 6)}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => <TaskItemTimeTable
                    item={item}
                    theme={theme}
                    key={index}
                    classRoom={classRoom.length > 0 ? classRoom[classRoomIndex] : null}
                    onSuccess={() => {
                        fetchLocalTeacherTimeTablesData(true)
                    }} />}
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
                data={attendance.slice(0, 3)}
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
                            {!item.isExams && <View style={{ justifyContent: "space-between", flexDirection: "row", flex: 1, }}>
                                <View style={{ justifyContent: "space-between", flexDirection: "column", flex: 1, }} >
                                    <Text style={{ alignItems: "center", alignContent: "center", ...Theme.fontStyle.inter.bold, color: theme.gray4 }}>
                                        {item?.subject_id?.name}
                                    </Text >
                                    <Text style={{ ...Theme.fontStyle.inter.regular, fontSize: 12, color: item.isPresent ? theme.primaryText : "red" }}>
                                        {moment(item?.end_datetime).format("dddd DD  HH:mm")}
                                    </Text>
                                </View>
                                <Text style={{ height: 30, fontSize: 12, alignItems: "center", textAlign: "center", alignContent: "center", ...Theme.fontStyle.inter.bold, color: theme.secondaryText, backgroundColor: theme.primary, paddingHorizontal: 10, paddingVertical: 5, flex: 1, }}>
                                    {I18n.t('Home.course')}
                                </Text >
                            </View>}
                            {item.isExams && <View style={{ justifyContent: "space-between", flexDirection: "row", flex: 1, }}>
                                <View style={{ justifyContent: "space-between", flexDirection: "column", flex: 1, }} >
                                    <Text style={{ alignItems: "center", alignContent: "center", ...Theme.fontStyle.inter.semiBold, color: theme.gray4 }}>
                                        {item?.name}
                                    </Text >
                                    <Text style={{ ...Theme.fontStyle.inter.regular, fontSize: 12, color: item.isPresent ? theme.primaryText : "red" }}>
                                        {moment(item?.end_date).format("dddd DD")}
                                    </Text>

                                </View>
                                <Text style={{ height: 30, fontSize: 12, alignItems: "center", textAlign: "center", alignContent: "center", ...Theme.fontStyle.inter.semiBold, color: theme.secondaryText, backgroundColor: theme.primary, paddingHorizontal: 10, paddingVertical: 5, }}>
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
                data={teacherExams.slice(0, 3)}
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
                                <Text style={{ alignItems: "center", alignContent: "center", ...Theme.fontStyle.inter.semiBold, color: theme.gray4 }}>
                                    {item.name}
                                </Text >
                                <Text style={{ alignItems: "center", alignContent: "center", ...Theme.fontStyle.inter.semiBold, color: theme.gray4 }}>

                                </Text >
                            </View>
                            <View style={{ justifyContent: "space-between", flexDirection: "row" }} >
                                <Text style={{ ...Theme.fontStyle.inter.regular, color: item.isPresent ? theme.primaryText : "red" }}>
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
            {teacherExams.length >= 2 && renderSeeMoreSub("GradeBookScreen")}

        </View>
    );





    const renderEmptyStudentElement = () => (
        <View style={styles.emptyData}>
            {(isLocalLoading) &&
                <ActivityIndicator color={theme.primary} size={25} />}
            {(!(isLocalLoading) && error) &&
                <Text style={styles.emptyDataText}>{error?.message}</Text>}
            {(!(isLocalLoading) && !error) &&
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



    const renderSeeMoreSub = (sreen: string, other?: any) => {
        return <View style={{}}>
            <TouchableOpacity
                style={{ padding: 10, borderRadius: 10, marginBottom: 10 }}
                onPress={() => {
                    handleNavigationPressed(sreen, other)
                }}
            >
                <Text style={{ color: "blue", ...Theme.fontStyle.inter.italic, textAlign: "center", fontSize: 13, }}>
                    {I18n.t('more_link')}
                    <MaterialCommunityIcons name='arrow-top-right' size={16} color={"blue"} />
                </Text>
            </TouchableOpacity>
        </View>
    }


    return (
        <View style={styles.container}>
            <Header navigation={navigation} title={I18n.t("Home.title")} visible={visible} theme={theme} onLogoutPressed={async () => {
                // await clearCustomTables(["assignment_types", "assignment_types", "assignments", "assignment_rooms", "attendanceLine", "students", "sessions", "classrooms"]);
                dispatch(clearUserStored(null))
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'AuthStacks' }],
                })
                dispatch(updateSyncing(true))

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
                    data={filteredData.slice(0, 3)}
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
                    ListFooterComponent={() => [...classRoom, ...secondaryClassRoom].length >= 2 ? <TouchableOpacity
                        style={[styles.TitleContainer, { alignSelf: "center" }]}>
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate("ClassRoomListScreen")
                            }}>
                            <Text style={[{ color: theme.primary, ...Theme.fontStyle.inter.regular, }]}>
                                {" Tout Voir"} ({[...classRoom, ...secondaryClassRoom].length - [...classRoom, ...secondaryClassRoom].slice(0, 3).length})
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity> : null}
                    ListEmptyComponent={renderEmptyStudentElement}
                />

                <MyDivider theme={theme} />
                {renderTimeTable()}
                <MyDivider theme={theme} />
                {renderFogotAttendences()}
                <MyDivider theme={theme} />
                {renderGardeBook()}
                <MyDivider theme={theme} />

            </ScrollView>
            <SyncingModal visible={mustSuncFirtTime && user} index={currentBannerMessageIndex} />
            <UnSyncModal handlesResync={() => {
                syncAllDataDown();
            }} />

        </View>
    );



}

const MyDivider = ({ theme }: any) => {
    return <Divider style={{ backgroundColor: theme.gray4, marginVertical: 10, }} />
}

export default HomeScreen