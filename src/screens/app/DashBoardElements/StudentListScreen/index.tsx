import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Animated, Image } from "react-native";
import { useTheme } from "store";
import dynamicStyles from "./styles";
import { TouchableOpacity } from "react-native";
import { Button, Divider, Searchbar } from "react-native-paper";
import { formatName, profils, showCustomMessage, Theme } from "utils";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator } from "react-native";
import { Easing } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { getData, LOCAL_URL } from "apis";
import { RefreshControl } from "react-native";
import { getStudentsByFilter, syncAllStudents, upsertStudent } from "services/StudentsServices";
import { db } from "apis/database";
import { Classroom, Student } from "services/CommonServices";
import { I18n } from 'i18n';
import { ChoseSubjectModal } from "screens/app/InviteStudentForCources/components/ChoseSubjectModal";
import { useFocusEffect } from "@react-navigation/native";


function StudentListScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom }: { classRoom: Classroom } = route.params
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const [showPickSubject, setShowPickSubject] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [subjectIndex, setSubjectIndex] = useState(0)
    const [refresh, setRefresh] = useState(false)
    const styles = dynamicStyles(theme)
    const [studentList, setStudentList] = useState<Student[]>([])
    const [allStudentList, setAllStudentList] = useState<Student[]>([])
    const [filteredData, setFilteredData] = useState<Student[]>([])
    const [selectedKey, setSelectedKey] = useState<string | null>(null)
    const [groupedStudentData, setGroupedStudentData] = useState<{ [key: string]: Student[] }>({})
    // console.log("groupedStudentData", groupedStudentData);
    const groupStudentsByHomeClass = (students: Student[]): { [key: string]: Student[] } => {
        return students.reduce((acc: { [key: string]: any[] }, student) => {
            const className = student.home_class?.name || "Unknown"; // Si pas de home_class, mettre "Unknown"
            if (!acc[className]) {
                acc[className] = [];
            }
            acc[className].push(student);
            return acc;
        }, {});
    };
    useEffect(() => {
        getClassRoomStudent()
        onChangeSearch("");
    }, [refresh])
    // useFocusEffect(
    //     useCallback(() => {
    //         getClassRoomStudent()
    //         onChangeSearch("");
    //         return () => {
    //         };
    //     }, [refresh])
    // );
    useEffect(() => {
        if (selectedKey) {
            setStudentList(groupedStudentData[selectedKey] ?? [])
        } else {
            setStudentList(allStudentList)
        }
    }, [allStudentList, selectedKey])


    useEffect(() => {
        hideHeader();
        hideFilter();
    }, [refresh])

    useEffect(() => {
        onChangeSearch("");
    }, [studentList])

    const getClassRoomStudent = async () => {
        setIsLoading(true)
        try {
            // const assigma = await getData(`${LOCAL_URL}/api/students/room/${classRoom?.id}`)
            // if (!assigma?.success) {
            //     showCustomMessage("Information", assigma?.message, "warning", "bottom")
            //     return;
            // }
            // let assigmCorrect: any[] = [];
            // const assigms: any[] = assigma?.success ? assigma?.data : []
            // assigms?.forEach((item) => {
            //     let name = ""
            //     if (item.first_name) name = name + item.first_name + " "
            //     if (item.middle_name) name = name + item.middle_name + " "
            //     if (item.last_name) name = name + item.last_name
            //     assigmCorrect.push({
            //         ...item,
            //         name: name,
            //     })
            // })
            // setStudentList(assigmCorrect);
            // console.log("getClassRoomStudent----", assigmCorrect.length, tmp1.data?.length);
            // const tmp1 = await getStudentsByClassroom(db, classRoom?.id);
            console.log(classRoom.subjects?.[subjectIndex]?.id);

            const tmp1 = await getStudentsByFilter(db, classRoom?.id, classRoom.subjects?.[subjectIndex]?.id);

            console.log("getClassRoomStudent----", tmp1.data?.length);
            if (tmp1.success && tmp1.data) {
                setAllStudentList(tmp1.data);
                const data = groupStudentsByHomeClass(tmp1.data);
                setGroupedStudentData(data);
            } else {
                showCustomMessage("Information", tmp1.error, "warning", "bottom")
            }

        } catch (error: any) {
            console.log('Une erreur s\'est produite :', error.message);
            showCustomMessage("Information", 'Une erreur s\'est produite :' + error?.message, "warning", "bottom")
        } finally {
            setIsLoading(false)
            setRefresh(false)
        }
    };

    const headerHeight = useRef(new Animated.Value(60)).current;
    const filterHeight = useRef(new Animated.Value(45)).current;
    const hideFilter = () => {
        Animated.timing(filterHeight, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    };
    const showFilter = () => {
        Animated.timing(filterHeight, {
            toValue: 45,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    };

    const showHeader = () => {
        Animated.timing(headerHeight, {
            toValue: 60, // Full height of the header
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false, // height doesn't support native driver
        }).start();
    };


    const hideHeader = () => {
        Animated.timing(headerHeight, {
            toValue: 0, // Hide the header by reducing its height
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    };
    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = studentList.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filtered);
    };

    useEffect(() => {
        onChangeSearch("")
    }, []);
    const renderEmptyElement = () => (
        <View style={styles.emptyData}>
            {isLoading &&
                <ActivityIndicator color={theme.primary} size={25} />}
            {!isLoading &&
                <Text style={styles.emptyDataText}>{"Aucun cours present."}</Text>}
        </View>
    );
    const incrementClassRoom = () => {
        if (subjectIndex >= classRoom?.subjects.length - 1) {
            return
        }
        setSubjectIndex((prevDate: any) => subjectIndex + 1);
    };

    const decrementClassRoom = () => {
        if (subjectIndex <= 0) {
            return
        }
        setSubjectIndex((prevDate: any) => subjectIndex - 1);
    };

    return <View style={styles.container}>
        <View style={{ paddingHorizontal: 10, paddingVertical: 10, flexDirection: "row", gap: 30, alignItems: "center", justifyContent: "space-between" }}
        >
            <TouchableOpacity
                onPress={() => {
                    navigation.goBack()
                }}
                style={{ flexDirection: "row", gap: 10, }}>

                <MaterialCommunityIcons name='arrow-left' size={25} color={theme.primaryText} />
                <Text style={{ ...Theme.fontStyle.inter.semiBold, fontSize: 20, color: theme.primary }}>{I18n.t("Dashboard.my_student")} ({allStudentList.length})</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 20, }}>
                <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => {
                        hideHeader();
                        showFilter();
                    }}
                >
                    <MaterialCommunityIcons name="filter" size={25} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={{ marginRight: 20 }}
                    onPress={() => {
                        showHeader()
                    }}>
                    <MaterialCommunityIcons name='account-search' size={25} color={theme.primaryText} />
                </TouchableOpacity>
            </View>
        </View>
        <Divider />


        {classRoom.subjects.length > 0 &&
            <View style={styles.headerTimeConatiner}>
                <TouchableOpacity disabled={subjectIndex <= 0} onPress={decrementClassRoom}>
                    <MaterialCommunityIcons name='chevron-left-circle' size={25} color={subjectIndex <= 0 ? theme.gray : theme.primaryText} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.classRoomContainer}
                    onPress={() => {
                        setShowPickSubject(true)
                    }}>
                    <Text style={styles.classRoomText}>{classRoom.subjects[subjectIndex]?.name}</Text>
                    <MaterialCommunityIcons name='chevron-down' size={25} color={theme.primary} />
                </TouchableOpacity>

                <TouchableOpacity disabled={subjectIndex >= classRoom?.subjects.length - 1} onPress={incrementClassRoom}>
                    <MaterialCommunityIcons name='chevron-right-circle' size={25} color={subjectIndex >= classRoom?.subjects.length - 1 ? theme.gray : theme.primaryText} />
                </TouchableOpacity>
            </View>

        }
        <View>
            <Animated.View style={[styles.header,
            { height: filterHeight, alignItems: "flex-start", justifyContent: "flex-start", alignContent: "center" }]}>
                <FlatList
                    data={["All", ...Object.keys(groupedStudentData)]}
                    horizontal
                    contentContainerStyle={{ alignItems: "center" }}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item, index }) => {
                        const count: number = index === 0 ? allStudentList.length : (groupedStudentData[item] ?? []).length;

                        return (
                            <TouchableOpacity
                                style={[
                                    styles.item,
                                    (selectedKey === item || (index === 0 && !selectedKey)) && styles.selectedItem
                                ]}
                                onPress={() => {
                                    if (index === 0) {
                                        setSelectedKey(null)
                                        return;
                                    }
                                    setSelectedKey(item)
                                }}
                            >
                                <Text style={[styles.text,
                                (selectedKey === item || (index === 0 && !selectedKey)) && { color: theme.secondaryText }
                                ]}>
                                    {item}
                                    <Text style={[styles.text,
                                    { fontSize: 10, },
                                    (selectedKey === item || (index === 0 && !selectedKey)) && { color: theme.secondaryText }
                                    ]}> ({count}) </Text>
                                </Text>
                            </TouchableOpacity>
                        )
                    }}
                    ListFooterComponent={() => (
                        <TouchableOpacity
                            style={[styles.item, { flexDirection: "row", gap: 1 }]}
                            onPress={() => {
                                setSelectedKey(null)
                                hideFilter();
                            }}>
                            <MaterialCommunityIcons name="close" size={20} color="green" />
                        </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            </Animated.View>
        </View>

        <Animated.View style={[styles.header, { height: headerHeight }]}>
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

            </View>
        </Animated.View>
        <View style={styles.content}>
            <FlatList
                data={filteredData}
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => {
                            setRefresh(true)
                        }}
                    />}
                renderItem={({ item, index }) =>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("StudentDetailsScreen", { classRoom: classRoom, student: item })
                        }}
                        style={{ flexDirection: "row", marginBottom: 15, gap: 20, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: theme.gray, paddingBottom: 10 }}>
                        <View style={{ width: 40, height: 40, borderRadius: 5, backgroundColor: theme.gray, padding: 2, borderColor: theme.gray4, borderWidth: 1 }}>
                            <Image source={{ uri: item?.avatar }} style={{ width: "100%", height: "100%", borderRadius: 5, }} />
                        </View >
                        <View style={{ justifyContent: "space-between", flex: 1, gap: 5, alignContent: "center", }}>
                            <Text style={{ ...Theme.fontStyle.inter.semiBold, fontSize: 16, color: theme.primaryText }}>{formatName(item.name)}</Text>
                            {item.is_invited && <Text style={{ ...Theme.fontStyle.inter.regular, fontSize: 12, color: theme.primaryText }}>
                                {I18n.t("Dashboard.home_class")}:
                                <Text style={{ ...Theme.fontStyle.inter.semiBold, fontSize: 12, color: theme.primaryText }}>
                                    {' '}  {item?.home_class?.name}
                                </Text>
                            </Text>
                            }
                        </View>
                    </TouchableOpacity>

                }
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={renderEmptyElement}
            />
        </View>
        <ChoseSubjectModal visible={showPickSubject} subjects={classRoom?.subjects ?? []} onSelectSubject={(e) => {
            const index = classRoom?.subjects.indexOf(e);
            if (index > -1) {
                setSubjectIndex(index);

            }
            setShowPickSubject(false)
        }} />
        <Animated.View style={[styles.header,
        { height: filterHeight, alignItems: "center", justifyContent: "center", alignContent: "center" }]}>
            <Button
                mode="contained-tonal"
                style={{ backgroundColor: theme.primary, paddingHorizontal: 10, marginHorizontal: 10, }}
                labelStyle={{ color: theme.secondaryText }}
                onPress={async () => {
                    navigation.navigate("InviteStudentForCources", { classRoom, subject: classRoom.subjects?.[subjectIndex] })
                }}
                icon={"plus"}>
                {I18n.t("Dashboard.invitDescription")}
            </Button>
        </Animated.View>
    </View>

}

export default StudentListScreen;