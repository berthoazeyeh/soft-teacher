import { useEffect, useState, } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { clearUserStored, updateSyncing, useCurrentUser, useTheme } from 'store';
import dynamicStyles from './style';
import { Header } from './components';
import { I18n } from 'i18n';
import { useDispatch } from 'react-redux';
import { Picker } from '@react-native-picker/picker';
import { FlatList } from 'react-native';
import { Divider } from 'react-native-paper';
import { showCustomMessage, Theme } from 'utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Eleve } from 'models';
import { getData, LOCAL_URL } from 'apis';
import useSWR from 'swr';
import { useIsFocused } from '@react-navigation/native';
import { RefreshControl } from 'react-native';
import useSWRMutation from 'swr/mutation';
import React from 'react';
import { getClassrooms, syncAllClassrooms } from 'services';
import { clearCustomTables, db } from 'apis/database';




function DashBoardScreen(props: any): React.JSX.Element {
    const { navigation, route } = props;
    const theme = useTheme()
    const styles = dynamicStyles(theme)
    const [visible, setVisible] = useState(false)
    const dispatch = useDispatch()
    const [page, setPage] = useState(1);
    const itemsPerPage = 6;
    const [selectedValue, setSelectedValue] = useState<Eleve | null>(null);
    const [data, setData] = useState<Item[]>([]);
    const user = useCurrentUser();
    const [classRoom, setClassRoom] = useState<any[]>([])
    const [refresh, setRefresh] = useState(false)
    const [isLocalLoading, setIsLocalLoading] = useState(false)
    const isFocused = useIsFocused();
    const [secondaryClassRoom, setSecondaryClassRoom] = useState<any[]>([])
    let ElementList = I18n.t("Dashboard.ElementList");
    // const { data: rooms, error, isLoading } = useSWR(`${LOCAL_URL}/api/rooms/faculty/${user?.id}`,
    //     getData,
    //     {
    //         refreshInterval: 100000,
    //         refreshWhenHidden: true,
    //     },
    // );

    const { trigger: getTeacherClassRoome } = useSWRMutation(`${LOCAL_URL}/api/rooms/faculty/${user?.id}`, getData)
    useEffect(() => {

        fetchClassrooms()
    }, [refresh])

    const HandleGetStudent = async () => {
        try {

            if (user?.id) {
                const classr = await getTeacherClassRoome();
                if (classr?.success && classr.data) {
                    const second: any[] = classr?.data?.diffuser_rooms;
                    const second1 = second.map(room => {
                        return { ...room, isSecondary: true }
                    });
                    setClassRoom([...classr?.data?.rooms, ...second1]);
                    setSecondaryClassRoom(classr?.data?.diffuser_rooms)
                }
                setRefresh(false);
            }
        } catch (error) {

        }
    }
    async function fetchClassrooms() {
        try {
            setIsLocalLoading(true)
            const response = await getClassrooms(db, false, user?.id);
            const response1 = await getClassrooms(db, true, user?.id);

            if (response.success) {
                if (response.data) {
                    setClassRoom([...response.data, ...(response1?.data ?? [])]);

                }
            } else {
                console.error("Erreur :", response.error);
            }
            if (response1.success) {
                if (response1.data) {
                    setSecondaryClassRoom(response1.data);
                }
            } else {
                console.error("Erreur :", response1.error);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération :", error);
        } finally {
            setIsLocalLoading(false)
            setRefresh(false);

        }
    }
    // function syncClassrooms() {
    //     if (rooms?.success)
    //         if (rooms && rooms.data) {
    //             syncAllClassrooms(rooms?.data?.rooms ?? [], db, false, user?.id)
    //                 .then(result => {
    //                     console.log("Sync successful:------rooms", result);
    //                     fetchClassrooms();
    //                 })
    //                 .catch(error => console.error("Sync failed:", error));
    //             syncAllClassrooms(rooms?.data?.diffuser_rooms ?? [], db, true, user?.id)
    //                 .then(result => {
    //                     console.log("Sync successful:-----diffuser_rooms.", result);
    //                     fetchClassrooms();
    //                 })
    //                 .catch(error => console.error("Sync failed:", error));
    //         }
    // }

    useEffect(() => {
        if (route.params && route.params?.clasRoom) {
            setSelectedValue(route.params.clasRoom?.id)
        }
    }, [navigation, route.params?.clasRoom?.id])

    useEffect(() => {
        if (isFocused) {
            // fetchClassrooms();
            // syncClassrooms();
            // fetchClassrooms();
            // if (rooms?.success)
            //     if (rooms && rooms.data) {
            //         const second: any[] = rooms?.data?.diffuser_rooms;
            //         const second1 = second.map(room => {
            //             return { ...room, isSecondary: true }
            //         });
            //         setClassRoom([...rooms?.data?.rooms, ...second1]);
            //         setSecondaryClassRoom(rooms?.data?.diffuser_rooms)
            //     }
        }
    }, [isFocused]);


    const onMenuPressed = (val: boolean) => {
        setVisible(val)
    }
    const onLogoutPressed = async (isSetting: boolean) => {
        setVisible(false)
        if (isSetting) {
            navigation.navigate("SettingsScreenStacks")
        } else {
            dispatch(clearUserStored(null))
            // await clearCustomTables(["assignment_types", "assignment_types", "assignments", "assignment_rooms", "attendanceLine", "students", "sessions", "classrooms"]);

            navigation.reset({
                index: 0,
                routes: [{ name: 'AuthStacks' }],
            });
            dispatch(updateSyncing(true))
            console.log("log out");
        }
    }
    const renderHeader = () => (<>
        <View style={styles.header}>
            <View style={styles.profil}>
                {(isLocalLoading) &&
                    <ActivityIndicator color={"green"} size={25} />
                }
                {(!isLocalLoading) &&
                    <MaterialCommunityIcons name={"school"} size={20} color={theme.primaryText} />
                }
            </View>
            <Picker
                itemStyle={{ color: theme.primaryText, ...Theme.fontStyle.inter.bold }}
                selectedValue={selectedValue}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
                style={styles.picker}>
                <Picker.Item
                    style={styles.pickerItemStyle}
                    label={"Choisir une salle de classe"}
                    value={"studentI.id"} />
                {classRoom && classRoom?.map(studentI => <Picker.Item
                    style={studentI.isSecondary ? styles.pickerItemStyle1 : styles.pickerItemStyle}
                    key={studentI}
                    label={studentI.name}
                    value={studentI?.id} />)}
            </Picker>
        </View>
        <Divider />
    </>
    );

    interface Item {
        id: number;
        name: string;
        color: string;
        icon: string;
        screen: string;
        haveBadge: boolean;
    }
    useEffect(() => {
        loadPage(page);
    }, [page]);
    const loadPage = (pageNum: number) => {
        const startIndex = (pageNum - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        setData(data1.slice(startIndex, endIndex));
    };
    const data1: Item[] = [
        { id: 1, color: "green", haveBadge: false, name: I18n.t("Dashboard.Elems.studentList"), icon: 'account-group', screen: "StudentListScreen" },
        { id: 2, color: theme.primaryText, haveBadge: true, name: I18n.t("Dashboard.Elems.myCourses"), icon: 'school', screen: 'MyCourcesScreen' },
        { id: 3, color: theme.primaryText, haveBadge: true, name: I18n.t("Dashboard.Elems.timeTable"), icon: 'calendar', screen: 'MyTimeTableScreen' },
        { id: 4, color: "green", haveBadge: true, name: I18n.t("Dashboard.Elems.assignments"), icon: 'checkbox-marked-outline', screen: 'MyAssignmentScreen' },
        { id: 5, color: 'green', haveBadge: true, name: I18n.t("Dashboard.Elems.attendanceTracking"), icon: 'clipboard-list', screen: 'CourcesListeScreen' },
        { id: 6, color: theme.primaryText, haveBadge: false, name: I18n.t("Dashboard.Elems.gradeEntry"), icon: 'book-open-variant', screen: 'GradeEntryScreen' },
        { id: 7, color: theme.primaryText, haveBadge: true, name: I18n.t("Dashboard.Elems.examsAndAttendance"), icon: 'library', screen: 'ExamsListeScreen' },
        // { id: 8, color: "green", haveBadge: true, name: I18n.t("Dashboard.Elems.notebook"), icon: 'pencil', screen: 'NotebookScreen' },
        // { id: 9, color: "green", haveBadge: true, name: I18n.t("Dashboard.Elems.pastReportCards"), icon: 'library', screen: 'PastReportCardsScreen' }
    ];

    const handlePagePress = (pageNum: number) => {
        setPage(pageNum);
    };
    const totalPages = Math.ceil(data1.length / itemsPerPage);




    const renderItem = ({ item }: { item: Item }) => (
        <TouchableOpacity
            onPress={() => {
                console.log(selectedValue);

                if (selectedValue) {


                    if (item.screen === "CourcesListeScreen") {

                        navigation.navigate('DashboadElementStacks', {
                            screen: "CourcesListeScreen",
                            params: {
                                classRoom: classRoom.find((item: any) => item.id === selectedValue),
                                nexScreen: "MyAbsencesScreen"
                            },
                        });
                    }
                    else {

                        navigation.navigate('DashboadElementStacks', {
                            screen: item.screen,
                            params: {
                                classRoom: classRoom.find((item: any) => item.id === selectedValue),
                            },
                        });
                    }
                } else {
                    showCustomMessage("Information", I18n.t("Dashboard.NoChildSelectedMessage"), "warning", "bottom")
                }
            }}
            style={[styles.item, { backgroundColor: item.color }]}>
            {/* {item.haveBadge &&
                <View style={{ alignSelf: "flex-end", backgroundColor: theme.primaryText, height: 20, borderRadius: 5 }}>
                    <Text style={styles.itemTextlabels}>{0}</Text>
                </View>
            } */}
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <MaterialCommunityIcons name={item.icon} size={40} color="white" />
                <Text style={styles.itemText}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderFooter = () => {
        return (
            <View style={styles.paginationContainer}>
                <TouchableOpacity
                    onPress={() => handlePagePress(page - 1)}
                    style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}
                >
                    {page > 1 && <>
                        <MaterialCommunityIcons name={"chevron-left"} size={20} color={theme.primaryText} />
                        <Text style={page > 1 ? styles.selectedPageText : styles.pageText}>
                            {"Prev."}
                        </Text>
                    </>
                    }

                </TouchableOpacity >
                <View style={styles.paginationContent}>
                    {[...Array(totalPages)].map((_, index) => {
                        const pageNum = index + 1;
                        return (
                            <TouchableOpacity
                                key={pageNum}
                                style={[
                                    styles.pageButton,
                                    pageNum === page ? styles.selectedPageButton : null,
                                ]}
                                onPress={() => handlePagePress(pageNum)}
                            >
                                <Text style={pageNum === page ? styles.selectedPageText : styles.pageText}>
                                    {pageNum}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <TouchableOpacity
                    style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}
                    onPress={() => handlePagePress(page + 1)}
                >
                    {page < 3 &&
                        <>
                            <Text style={styles.selectedPageText}>
                                {"Next."}
                            </Text>
                            <MaterialCommunityIcons name={"chevron-right"} size={20} color={theme.primaryText} />

                        </>
                    }
                </TouchableOpacity >
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Header title={I18n.t("Dashboard.title")} visible={visible} theme={theme} onLogoutPressed={onLogoutPressed} setVisible={onMenuPressed} />
            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                ListHeaderComponent={renderHeader}
                columnWrapperStyle={styles.column}
                contentContainerStyle={{ justifyContent: "space-between" }}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => {
                            setRefresh(true)
                        }}
                    />} />
        </View >
    )

}

export default DashBoardScreen
