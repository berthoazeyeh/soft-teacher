import { Easing, SafeAreaView } from "react-native";
import { ActivityIndicator, Divider, FAB, Searchbar } from "react-native-paper";
import dynamicStyles from "./style";
import { getData, LOCAL_URL } from "apis";
import useSWR from "swr";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { useCurrentUser, useTheme } from "store";
import Icon from "react-native-vector-icons/MaterialIcons";
import { FlatList } from "react-native";
import { TouchableOpacity } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatName, showCustomMessage, Theme } from "utils";
import { RefreshControl } from "react-native";
import { Image } from "react-native";
import { I18n } from 'i18n';
import React from "react";
import { Animated } from "react-native";
import { Alert } from "react-native";
import { ConfirmModal } from "./components/ConfirmModal";
import { useFocusEffect } from "@react-navigation/native";
export type DataClassType = {
    classRoom: any,
    selectedStudent: any[],
    allStudent: any[],
    isHomeClass: boolean,
}

function InviteStudentForCources(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom, subject } = route.params
    const theme = useTheme()
    const [selectedDataClassList, setSelectedDataClassList] = useState<DataClassType[]>([{ classRoom: classRoom, isHomeClass: true, allStudent: [], selectedStudent: [], }]);
    const [allClasses, setAllClasses] = useState<any[]>([]);
    const [studentList, setStudentList] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [showSearchClass, setShowSearchClass] = useState<boolean>(false);
    const [filteredClasses, setFilteredClasses] = useState<any[]>([]);
    const [selectedClasses, setSelectedClasses] = useState<any | null>(classRoom);
    const [searchQuery, setSearchQuery] = useState<any | null>(null);
    const [searchStudentQuery, setSearchStudentQuery] = useState<any | null>(null);
    const [filteredStudentData, setFilteredStudentData] = useState<any[]>([]);
    const InviteStudentForCoursesLabels: any = I18n.t("InviteStudentForCourses");

    // console.log(InviteStudentForCoursesLabels);

    const handleSelect = (item: any) => {
        setSelectedClasses(item);
    };

    const findClassById = (classId: number) => {
        return selectedDataClassList.find((dataClass) => dataClass.classRoom.id === classId) || null;
    };
    const addStudentListToClass = (student: any[], classRoom: any, isClear: boolean) => {
        setSelectedDataClassList((prevDataClassList) => {
            return prevDataClassList.map((dataClass) => {
                if (dataClass.classRoom.id === classRoom.id) {
                    return {
                        ...dataClass,
                        selectedStudent: isClear ? [] : [...student],
                        allStudent: studentList,
                    };
                }
                return dataClass;
            });
        });
    };
    const addOneStudentToClass = (student: any, classRoom: any) => {
        setSelectedDataClassList((prevDataClassList) => {
            return prevDataClassList.map((dataClass) => {
                if (dataClass.classRoom.id === classRoom.id) {
                    const index = dataClass?.selectedStudent?.findIndex(item => item.id === student.id);
                    if (index !== -1) {
                        let updatedList = [...dataClass?.selectedStudent].filter((_, i) => i !== index);
                        return {
                            ...dataClass,
                            selectedStudent: updatedList,
                            allStudent: studentList,
                        };
                    }
                    return {
                        ...dataClass,
                        selectedStudent: [...dataClass?.selectedStudent, student],
                        allStudent: studentList,
                    };
                }
                return dataClass;
            });
        });
    };


    const showConfirmation = (item: DataClassType) => {
        Alert.alert(
            InviteStudentForCoursesLabels?.confirmation,
            InviteStudentForCoursesLabels?.delete_class_prompt,
            [
                { text: InviteStudentForCoursesLabels.cancel, style: "cancel" },
                { text: InviteStudentForCoursesLabels.delete, onPress: () => handleDelete(item), style: "destructive" }
            ]
        );
    };

    const handleDelete = (data: DataClassType) => {
        if (data.isHomeClass) {
            return;
        }
        let updatedList = selectedDataClassList.filter((item, i) => item.classRoom.id !== data.classRoom.id);
        setSelectedDataClassList(updatedList);
        console.log("Classe supprimée !", 0);
    };


    const user = useCurrentUser();
    const styles = dynamicStyles(theme)



    const markAllAsCheck = () => {
        addStudentListToClass(studentList, selectedClasses, false)
    };
    const markAllAsUnCheck = () => {
        addStudentListToClass([], selectedClasses, true)
    };

    const { data, error, isLoading: loading } = useSWR(`${LOCAL_URL}/api/op.classroom/search?fields=['name','code']`,
        getData,
        {
            refreshInterval: 100000,
            refreshWhenHidden: true,
        },
    );
    useEffect(() => {
        if (data?.success) {
            const updatedList = [...data.data].filter((item, _) => item?.id !== classRoom?.id);
            setAllClasses(updatedList);
        }
    }, [data])
    useEffect(() => {
        const classTmp = findClassById(selectedClasses?.id);
        if (classTmp && classTmp.isHomeClass && classTmp.selectedStudent.length <= 0) {
            addStudentListToClass(studentList, selectedClasses, false);
        }
    }, [studentList])


    useFocusEffect(
        useCallback(() => {
            hideHeader();
            if (selectedClasses) {
                getClassRoomStudent(selectedClasses);
            }
            return () => {
            };
        }, [selectedClasses, refresh, navigation])
    );
    useEffect(() => {
        onChangeSearch('')
    }, [studentList])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: InviteStudentForCoursesLabels?.invite_for_course + ' ' + (subject?.name ?? ""),
            headerTitleStyle: {
                fontSize: 14,
                ...Theme.fontStyle.inter.extraBold,
            },
        },
        );
    }, []);



    const getClassRoomStudent = async (selectedClasses: any) => {
        setIsLoading(true)
        try {
            setStudentList([]);
            const assigma = await getData(`${LOCAL_URL}/api/students/room/${selectedClasses?.id}`)
            // console.log('Une erreur s\'est produite :', assigma);
            if (!assigma?.success) {
                showCustomMessage("Information", assigma?.message, "warning", "bottom")
                return;
            }
            let assigmCorrect: any[] = [];
            const assigms: any[] = assigma?.success ? assigma?.data : []
            assigms?.forEach((item) => {
                let name = ""
                if (item.first_name) name = name + item.first_name + " "
                if (item.middle_name) name = name + item.middle_name + " "
                if (item.last_name) name = name + item.last_name
                assigmCorrect.push({
                    ...item,
                    name: name,
                })
            })
            setStudentList(assigmCorrect);

            console.log("getClassRoomStudent----", assigmCorrect.length);
        } catch (error: any) {
            console.log('Une erreur s\'est produite :', error.message);
            showCustomMessage("Information", InviteStudentForCoursesLabels.error_occurred + " " + error?.message, "warning", "bottom")
        } finally {
            setIsLoading(false)
            setRefresh(false)
        }
    };
    const headerHeight = useRef(new Animated.Value(80)).current;

    const showHeader = () => {
        Animated.timing(headerHeight, {
            toValue: 80, // Full height of the header
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
    const renderEmptyElement = () => (
        <View style={styles.emptyData}>
            {isLoading &&
                <ActivityIndicator color={theme.primary} size={25} />}
            {!isLoading && selectedClasses &&
                <Text style={styles.emptyDataText}>{InviteStudentForCoursesLabels?.no_students_found}</Text>}
            {!isLoading && !selectedClasses &&
                <Text style={styles.emptyDataText}>{InviteStudentForCoursesLabels?.select_class_prompt}</Text>}
        </View>
    );
    const renderWorkHeader = (text: string) => {
        const data = findClassById(selectedClasses.id);

        return <View style={{ marginVertical: 10, backgroundColor: theme.gray }}>
            <Divider />
            <View style={{ flexDirection: "row", padding: 10, justifyContent: "space-between" }}>
                <Text style={[styles.classRoomText, {
                    ...Theme.fontStyle.inter.bold,
                    fontSize: 16
                }]}>{text}:  <Text style={[styles.classRoomText, {
                    ...Theme.fontStyle.inter.regular,
                    fontSize: 12
                }]}> {data?.selectedStudent.length ?? 0}/{studentList.length} {InviteStudentForCoursesLabels?.selected}</Text>
                </Text>
                <TouchableOpacity
                    onPress={() => showHeader()}                    >
                    <Icon name="search" size={25} color="gray" />
                </TouchableOpacity>
            </View>
            {
                studentList.length > 0 &&
                <View style={{ flexDirection: "row", gap: 5, justifyContent: "space-around", alignItems: "center", paddingBottom: 5, }}>
                    <TouchableOpacity
                        onPress={() => markAllAsCheck()}
                        style={{ flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center" }}>
                        <MaterialCommunityIcons name="checkbox-blank-outline" size={23} color="black" />
                        <Text style={styles.classRoomText}>{InviteStudentForCoursesLabels?.select_all}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => markAllAsUnCheck()}
                        style={{ flexDirection: "row", gap: 5, justifyContent: "center", alignItems: "center" }}>
                        <MaterialCommunityIcons name="checkbox-blank-outline" size={23} color="black" />
                        <Text style={styles.classRoomText}>{InviteStudentForCoursesLabels?.deselect_all}</Text>
                    </TouchableOpacity>
                </View>
            }
            <Divider />
        </View >
    }
    const onChangeSearch = (query: string) => {
        setSearchStudentQuery(query);
        const filtered = studentList.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredStudentData(filtered);
    };
    const handleFilter = (query: string) => {
        setSearchQuery(query);
        if (query && query.length > 0) {
            const filtered = allClasses.filter((item) =>
                item.code.toLowerCase().includes(query.toLowerCase()) ||
                item.name.toLowerCase().includes(query.toLowerCase()));
            setFilteredClasses(filtered);
        } else {
            setFilteredClasses([]);
        }
    };
    return <View style={styles.container}>
        <View>
            <View style={{ height: 35 }}>
                <FlatList
                    data={selectedDataClassList}
                    horizontal
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.item,
                                selectedClasses?.id === item.classRoom?.id && styles.selectedItem
                            ]}
                            onLongPress={() => showConfirmation(item)}
                            onPress={() => handleSelect(item.classRoom)}>
                            <Text style={[styles.text, selectedClasses?.id === item.classRoom?.id && { color: theme.secondaryText }]}>{item.classRoom?.name}</Text>
                        </TouchableOpacity>
                    )}
                    ListFooterComponent={() => (
                        <TouchableOpacity
                            style={[styles.item, { flexDirection: "row", gap: 1 }]}
                            onPress={() => {
                                setShowSearchClass(true);
                            }}>
                            <MaterialCommunityIcons name="plus" size={20} color="green" />
                            <Text style={styles.text}>{InviteStudentForCoursesLabels?.choose_another_class}</Text>
                        </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            {showSearchClass && <View style={{ marginVertical: 10, }}>
                <Text style={styles.title}> {InviteStudentForCoursesLabels?.search_class_prompt}</Text>
                <Searchbar
                    loading={loading}
                    icon={() => <Icon name="search" size={25} color="gray" />}
                    style={styles.search}
                    inputStyle={styles.searchInput}
                    placeholder={InviteStudentForCoursesLabels.search_class_placeholder}
                    onChangeText={handleFilter}
                    numberOfLines={1}
                    value={searchQuery}
                    right={() => <TouchableOpacity
                        onPress={() => {
                            setFilteredClasses([])
                            setShowSearchClass(false);
                        }}
                        style={{ marginRight: 10, }}>
                        <Icon name="close" size={25} color="gray" />
                    </TouchableOpacity>}
                />
            </View>}
            <FlatList
                data={filteredClasses}
                keyExtractor={(item: any, index) => index.toString()}
                scrollEnabled={false}
                nestedScrollEnabled={false}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item1}
                        onPress={() => {
                            setSelectedDataClassList([...selectedDataClassList, { classRoom: item, selectedStudent: [], allStudent: [], isHomeClass: false }])
                            setSelectedClasses(item);
                            setSearchQuery('')
                            setShowSearchClass(false)
                            setFilteredClasses([]);
                        }}>
                        <Text style={styles.title}> {item?.name}</Text>
                        {/* <Text style={styles.subtitle}>{item.age}</Text> */}
                    </TouchableOpacity>
                )}
            />

            {renderWorkHeader(InviteStudentForCoursesLabels.student_list)}
            <Animated.View style={[styles.header, { height: headerHeight }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5 }}>
                    <Searchbar
                        placeholder={InviteStudentForCoursesLabels.student_search_placeholder}
                        onChangeText={onChangeSearch}
                        value={searchStudentQuery}
                        right={() =>
                            <TouchableOpacity
                                style={{ marginRight: 10 }}
                                onPress={() => {
                                    hideHeader()
                                    onChangeSearch('');
                                }}>
                                <MaterialCommunityIcons name="close-circle" size={25} color="black" />
                            </TouchableOpacity>
                        }
                        style={{
                            height: 50,
                            borderRadius: 15,
                            flex: 1,
                            backgroundColor: '#f0f0f0',
                        }} />
                </View>
            </Animated.View>
        </View>
        <View style={{ flex: 1 }}>
            <FlatList
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => {
                            setRefresh(true)
                        }}
                    />}
                data={filteredStudentData}

                renderItem={({ item, index }) => {
                    const data = findClassById(selectedClasses.id);
                    const index1 = data?.selectedStudent.findIndex((itemN: any) => itemN.id === item?.id) ?? -1;
                    return <TouchableOpacity
                        onPress={() => {
                            addOneStudentToClass(item, selectedClasses)
                        }}
                        style={{ flexDirection: "row", marginBottom: 15, gap: 10, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: theme.gray, paddingBottom: 10, alignItems: "center" }}>
                        {index1 !== -1 &&
                            <MaterialCommunityIcons name="checkbox-outline" size={23} color="green" />
                        }
                        {index1 <= -1 &&
                            <MaterialCommunityIcons name="checkbox-blank-outline" size={23} color="black" />
                        }
                        <View style={{ width: 35, height: 35, borderRadius: 60, backgroundColor: theme.gray, padding: 2, borderColor: theme.gray4, borderWidth: 1 }}>
                            <Image source={{ uri: item?.avatar }} style={{ width: "100%", height: "100%", borderRadius: 50, }} />
                        </View >
                        <View style={{ justifyContent: "space-between", flex: 1, gap: 5, alignContent: "center", }}>
                            <Text style={{ ...Theme.fontStyle.inter.semiBold, fontSize: 14, color: theme.primaryText }}>{formatName(item.name)}</Text>
                        </View>
                    </TouchableOpacity>
                }
                }
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={renderEmptyElement}
            />
        </View>

        <FAB
            label={InviteStudentForCoursesLabels?.verify}
            onPress={() => {
                setModalVisible(true);
            }}
            visible={true}
            color={theme.secondaryText}
            style={{
                padding: 0,
                bottom: 10,
                alignSelf: "center",
                backgroundColor: theme.primary,
                position: 'absolute',
            }}

        />
        <ConfirmModal
            visible={modalVisible}
            subject={subject}
            classroom={classRoom}
            setModalVisible={setModalVisible}
            onSuccessAll={() => {
                navigation.navigate('DashboadElementStacks', {
                    screen: "StudentListScreen",
                    params: {
                        classRoom: classRoom,
                    },
                });
                // navigation.navigate('DashboadElementStacks', {
                //     screen: item.screen,
                //     params: {
                //         children: selectedValue,
                //     },
                // });
            }}
            dataList={selectedDataClassList} />
    </View>


}

export default InviteStudentForCources;