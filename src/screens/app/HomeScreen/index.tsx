import { useEffect, useState, } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { I18n } from 'i18n';
import { Header, VehicleItem } from './components';
import { clearUserStored, selectLanguageValue, useCurrentUser, useTheme } from 'store';
import dynamicStyles from './style';
import { Image } from 'react-native';
import { ImageE1, Theme } from 'utils';
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
    const [student, setStudent] = useState<any[]>([
        { id: 1, name: "Terminal D1", cours: ["Methemetique", "Informatque"], },
        { id: 2, name: "3 eme M2", cours: ["Informatque"], },
    ])
    const [allStudent, setAllStudent] = useState<Eleve[]>([])
    const [studentAttendence, setStudentAttendence] = useState<any[]>([])
    const [studentNote, setStudentNote] = useState<any[]>([])
    const [submitedAssignment, setSubmitedAssignment] = useState<any[]>([])
    const [vehicles, setVehicles] = useState<ArrayLike<any>>([])
    const [selectedStudent, setSelectedStudent] = useState<Eleve>()
    const [refresh, setRefresh] = useState(false)
    const [isLoadingVehicule, setIsLoadingVehicule] = useState(true)
    const [isLoadingSubmitedAssignment, setIsLoadingSubmitedAssignment] = useState(true)
    const [isLoadingExam, setIsLoadingExam] = useState(true)
    const [isLoadingAssignment, setIsLoadingAssignment] = useState(true)
    const [isLoadingTimetable, setIsLoadingTimetable] = useState(true)
    const [isLoadingAttendances, setIsLoadingAttendances] = useState(true)
    const [isLoadingNote, setIsLoadingNote] = useState(true)
    const [isPrimaryDevice, setIsPrimaryDevice] = useState(false)
    const [visible, setVisible] = useState(false)
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const language = useSelector(selectLanguageValue);





    const onMenuPressed = (val: boolean) => {
        setVisible(val)
    }
    const { data, error, isLoading } = useSWR(`${LOCAL_URL}/api/parent-search/${user?.id}`,
        getData,
        {
            refreshInterval: 1000000,
            refreshWhenHidden: true,
        },
    );
    const { trigger: getStudentTimeTable } = useSWRMutation(`${LOCAL_URL}/api/admission/student/timelines/${selectedStudent?.id}`, getData)
    const { trigger: getParentStudent } = useSWRMutation(`${LOCAL_URL}/api/parent-search/${user?.id}`, getData)
    const { trigger: getStudentCoursesID } = useSWRMutation(`${LOCAL_URL}/api/op.admission/search?domain=[('student_id','=',${selectedStudent?.id})]`, getData)
    const { trigger: getStudentLastNote } = useSWRMutation(`${LOCAL_URL}/api/op.result.line/search?domain=[('student_id','=',${selectedStudent?.id})]`, getData)
    const { trigger: getStudentAttendences } = useSWRMutation(`${LOCAL_URL}/api/attendance-sheets`, getData)
    const { trigger: getStudentAttendencesOne } = useSWRMutation(`${LOCAL_URL}/api/attendance-sheets/by-student?student-id=${selectedStudent?.id}`, getData)


    moment.locale(language);

    useEffect(() => {

        setTimeout(() => {
            setRefresh(false);
        }, 3000);
    }, [selectedStudent, refresh])


    const renderHeader = () => (
        <View
            style={styles.logo}>
            <Image
                source={ImageE1}
                style={{
                    resizeMode: "cover", flex: 1, width: "100%", height: 200
                }} />
            <TouchableOpacity
                onPress={() => {
                    const list = allStudent.map(student => student.id)

                    navigation.navigate("AddChildrenScreen", { listId: list })
                }}
                style={styles.TitleContainer}>
                <Text style={styles.fieldText}>{"Mes salle de classe "}</Text>
            </TouchableOpacity>
            <Divider />
        </View>
    );

    const handleNavigationPressed = (screen: string) => {
        navigation.navigate('DashboadElementStacks', {
            screen: screen,
            params: {
                children: selectedStudent,
            },
        });
    }
    const renderWorkHeader = (text: string, screen: string) => (
        <View
            style={styles.logo}>
            <TouchableOpacity style={styles.TitleContainer}
                onPress={() => handleNavigationPressed(screen)}>
                <Text style={styles.fieldText}>{text}</Text>
            </TouchableOpacity>
            <Divider />
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






    const renderAttendances = () => (
        <View style={styles.logo}>
            <FlatList
                data={studentAttendence}
                keyExtractor={(item, index) => index.toString()}
                renderItem={
                    ({ item, index }) =>
                        <View style={{ paddingHorizontal: 10, paddingVertical: 10, gap: 5 }}>
                            <Text style={{ alignItems: "center", alignContent: "center", ...Theme.fontStyle.montserrat.bold, color: theme.gray4 }}>
                                <MaterialCommunityIcons name='chair-school' size={30} color={item.isPresent ? theme.gray4 : "red"} />
                                {item.isPresent ? I18n.t('Home.attendanceJustifiedAbsence') : I18n.t('Home.attendanceUnjustifiedAbsence')}
                            </Text >
                            <Text style={{ ...Theme.fontStyle.montserrat.regular, color: item.isPresent ? theme.primaryText : "red" }}>{item.date}</Text>
                        </View>
                }
                scrollEnabled={false}
                nestedScrollEnabled={false}
                style={{ backgroundColor: theme.primaryBackground, marginHorizontal: 10, borderWidth: 1, borderColor: theme.gray3, elevation: 2, paddingBottom: 10 }}
                ListHeaderComponent={() => renderWorkHeader("Emploi du temps", "AttendanceScreen")}
                ListEmptyComponent={() => renderEmptyVehiclesElement(I18n.t('Home.renderEmptyAttendance'), isLoadingAttendances)} />
            <TouchableOpacity
                style={{ position: "absolute", right: 5, top: -10, backgroundColor: theme.gray4, borderRadius: 20, padding: 5 }}
                onPress={() => handleNavigationPressed("AttendanceScreen")}>
                <MaterialCommunityIcons name='arrow-top-right' size={20} color={"white"} />
            </TouchableOpacity>
            {studentAttendence.length >= 2 && renderSeeMoreSub("AttendanceScreen")}
        </View>
    );
    const renderGardeBook = () => (
        <View style={styles.logo}>
            <FlatList
                data={studentNote}
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
                ListHeaderComponent={() => renderWorkHeader("Mes Absences", "GradeBookScreen")}
                ListEmptyComponent={() => renderEmptyVehiclesElement(I18n.t('Home.renderEmptyGradeBook'), isLoadingNote)} />
            <TouchableOpacity
                style={{ position: "absolute", right: 5, top: -10, backgroundColor: theme.gray4, borderRadius: 20, padding: 5 }}
                onPress={() => handleNavigationPressed("GradeBookScreen")}>
                <MaterialCommunityIcons name='arrow-top-right' size={20} color={"white"} />
            </TouchableOpacity>
            {studentNote.length >= 2 && renderSeeMoreSub("GradeBookScreen")}

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
            {studentNote.length >= 2 && renderSeeMoreSub("AssignmentsScreen")}
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
    const renderEmptyVehiclesElement = (message: any, isLoading: boolean) => (
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
    const renderSeeMoreSub = (sreen: string) => {
        return <View style={{}}>
            <TouchableOpacity
                style={{ padding: 10, borderRadius: 10, marginBottom: 10 }}
                onPress={() => {
                    handleNavigationPressed(sreen)
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
                // onScroll={handleScroll}
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
                    data={student}
                    renderItem={({ item, index }) => <VehicleItem
                        item={item}
                        index={index}
                        I18n={I18n}
                        handlePresseLiveTrakingButton={() => handlePresseLiveTrakingButton(item)}
                        navigation={navigation}
                        isSelected={item?.id === selectedStudent?.id}
                        setSelectedStudent={setSelectedStudent}
                    />}
                    keyExtractor={item => (item.id).toString()}
                    ListFooterComponent={() => student.length >= 2 ? renderSeeMore("StudentListScreen") : null}
                    ListEmptyComponent={renderEmptyStudentElement}
                />

                <MyDivider theme={theme} />
                {renderAttendances()}
                <MyDivider theme={theme} />
                {renderGardeBook()}
                <MyDivider theme={theme} />
                {renderAssignmentNote()}
                <MyDivider theme={theme} />
                {renderMoreLink()}
            </ScrollView>
        </View>
    );



}

const MyDivider = ({ theme }: any) => {
    return <Divider style={{ backgroundColor: theme.gray4, marginVertical: 10, }} />
}

export default HomeScreen