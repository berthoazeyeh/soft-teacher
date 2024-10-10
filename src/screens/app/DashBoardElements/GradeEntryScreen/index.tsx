import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Easing } from "react-native";
import { isDarkMode, useTheme } from "store";
import dynamicStyles from "./styles";
import { getRandomColor, profils, showCustomMessage, Theme } from "utils";
import { FlatList } from "react-native";
import moment from "moment";
import { Image } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Checkbox, Divider, Searchbar } from "react-native-paper";
import { Animated } from "react-native";
import Modal from 'react-native-modal';
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import useSWRMutation from "swr/mutation";
import { getData, LOCAL_URL, postData } from "apis";
import LinearGradient from 'react-native-linear-gradient';
import { Alert } from "react-native";


function GradeEntryScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom } = route.params
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingSession, setIsLoadingSession] = useState(false)
    const [isLoadingExam, setIsLoadingExam] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [mark, setMark] = useState("")
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const [selectedSession, setSelectedSession] = useState<any>(null)
    const [selectedExam, setSelectedExam] = useState<any>(null)
    const styles = dynamicStyles(theme)
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [examsData, setExamsData] = useState<any>(null)
    const [sessions, setSessions] = useState<any[]>([])
    const [oneSession, setOneSession] = useState<any>(null)


    const { trigger: getTeacherExamsSessions } = useSWRMutation(`${LOCAL_URL}/api/exams-sessions/${classRoom?.id}`, getData);
    const { trigger: setNoteForStudent } = useSWRMutation(`${LOCAL_URL}/api/change-marks/student/exam/${examsData?.id}`, postData)

    const postNoteForStudent = async () => {
        const data = {
            student_id: selectedStudent?.id,
            marks: parseInt(mark)
        }
        setIsLoading(true)
        try {
            const assigma = await setNoteForStudent(data)
            console.log(assigma);
            setIsLoading(false)

            if (!assigma?.success) {
                showCustomMessage("Information", assigma.message, "warning", "bottom")
                return;
            }
            setModalVisible(false);
            getTeacherExamsSession()
            showCustomMessage("Success", "Note Atribuer avec success", "success", "center")

        } catch (error: any) {
            setIsLoading(false)

            showCustomMessage("Information", 'Une erreur s\'est produite :' + error.message, "warning", "bottom")

        } finally {
            setIsLoading(false)
        }
    };


    useEffect(() => {
        hideHeader()
        getTeacherExamsSession()
    }, []);

    useEffect(() => {
        if (selectedSession)
            getTeacherExams()
    }, [selectedSession]);

    useEffect(() => {
        if (selectedExam)
            getTeacherExamsStudent()
    }, [selectedExam]);

    useEffect(() => {
        if (examsData)
            onChangeSearch(searchQuery);
    }, [examsData]);


    const getTeacherExamsSession = async () => {
        try {
            setIsLoadingSession(true);
            const res = await getTeacherExamsSessions();
            if (res?.success) {
                const timetable: any[] = res?.success ? res?.data : []
                setSessions(timetable);
            } else {
                console.log(res);
                showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err?.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoadingSession(false);
        }

    };
    const getTeacherExams = async () => {

        try {
            setIsLoadingExam(true);
            const res = await getData(`${LOCAL_URL}/api/exam-session/${selectedSession}`);
            if (res?.success) {
                const timetable: any[] = res?.success ? res?.data : []
                setOneSession(timetable);
            } else {
                console.log(res);
                showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err?.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoadingExam(false);
        }

    };
    const getTeacherExamsStudent = async () => {
        try {
            setIsLoading(true);
            const res = await getData(`${LOCAL_URL}/api/exam/${selectedExam}`);
            if (res?.success) {
                const timetable: any = res?.success ? res?.data : null
                setExamsData(timetable);
                console.log("getTeacherExams------size-------", timetable);
            } else {
                console.log(res);
                showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err?.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoading(false);
        }

    };
    const [modalVisible, setModalVisible] = useState(false);

    const headerHeight = useRef(new Animated.Value(60)).current;

    const showHeader = () => {
        Animated.timing(headerHeight, {
            toValue: 60,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    };

    const hideHeader = () => {
        Animated.timing(headerHeight, {
            toValue: 0,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    };




    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = examsData?.students.filter((item: any) =>
            item?.student_id?.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filtered);
    };


    const renderEmptyElement = () => (
        <View style={styles.emptyData}>
            {isLoading &&
                <ActivityIndicator color={theme.primary} size={25} />}
            {!isLoading &&
                <Text style={styles.emptyDataText}>{"Aucun élève n'a particité cet examen."}</Text>}
        </View>
    );

    const renderHeader = (data: any, selectedValue: any, setSelectedValue: any, text: any, isLoading: boolean) => (<>
        <View style={styles.headers}>
            <View style={styles.profil}>
                {isLoading &&
                    <ActivityIndicator color={"green"} size={25} />
                }
                {!isLoading &&
                    <MaterialCommunityIcons name={"chart-line"} size={25} color={theme.primaryText} />
                }
            </View>
            <Picker
                itemStyle={{ color: theme.primaryText, ...Theme.fontStyle.montserrat.bold }}
                selectedValue={selectedValue}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
                style={styles.picker}>
                <Picker.Item
                    style={styles.pickerItemStyle}
                    label={text}
                    value={"studentI.id"} />
                {data && data?.map((studentI: any) => <Picker.Item
                    style={styles.pickerItemStyle}
                    key={studentI}
                    label={studentI.name}
                    value={studentI?.id} />)}
            </Picker>
        </View>
    </>
    );


    return <View style={styles.container}>

        <LinearGradient
            colors={[theme.gray, '#434343', theme.gray]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.headerContainer}
        >
            <View style={styles.titleContainer}>

                <Text style={styles.text}>
                    Saisie des notes
                </Text>
                <TouchableOpacity
                    style={{ marginRight: 10, padding: 7, backgroundColor: theme.primary, borderRadius: 30 }}
                    onPress={() => {
                        showHeader()
                    }}
                >
                    <MaterialCommunityIcons name='account-search' size={20} color={theme.secondaryText} />
                </TouchableOpacity>
            </View>

            {renderHeader(sessions, selectedSession, setSelectedSession, "Choisissez la session d'examan", isLoadingSession)}
            {renderHeader(oneSession?.exam_ids, selectedExam, setSelectedExam, "Choisissez l'examan", isLoadingExam)}
        </LinearGradient>

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
                <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => {
                        console.log('Filter clicked');
                    }}
                >
                    <MaterialCommunityIcons name="filter" size={30} color="black" />
                </TouchableOpacity>
            </View>
        </Animated.View>


        <View style={styles.content}>
            <FlatList
                data={filteredData}
                renderItem={({ item, index }) =>
                    <View

                        style={{ flexDirection: "row", marginBottom: 10, gap: 20, paddingHorizontal: 0, borderBottomWidth: 1, borderBottomColor: theme.gray, paddingBottom: 10, }}>


                        <View style={{ justifyContent: "space-between", flex: 1, gap: 5, alignContent: "center", }}>
                            <Text selectable={true} style={{ ...Theme.fontStyle.montserrat.semiBold, fontSize: 18, color: theme.primaryText }}>{item?.student_id?.name}</Text>

                            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                {
                                    item.status === "present" &&
                                    <View
                                        style={{ borderWidth: 1, borderColor: theme.gray, paddingHorizontal: 5, paddingVertical: 3, alignItems: "center", borderRadius: 5, backgroundColor: theme.primary }}
                                    >
                                        <Text style={{ color: theme.secondaryText, fontSize: 16 }}>{"Present"}</Text>
                                    </View>

                                }
                                {
                                    item.status === "absent" &&
                                    <View
                                        style={{ borderWidth: 1, borderColor: theme.gray, paddingHorizontal: 5, paddingVertical: 3, alignItems: "center", borderRadius: 5, backgroundColor: "red" }}
                                    >
                                        <Text style={{ color: theme.secondaryText, fontSize: 16 }}>{"Absent"}</Text>
                                    </View>

                                }
                                {
                                    item.note &&
                                    <View
                                        style={{ borderWidth: 1, borderColor: "red", paddingHorizontal: 5, paddingVertical: 3, alignItems: "center", borderRadius: 5, }}
                                    >
                                        <Text style={{ color: theme.primaryText, fontSize: 16 }}>{item?.note}</Text>
                                    </View>

                                }
                            </View>

                        </View>
                        <View >
                            <View style={{ flexDirection: "row" }}>
                                <TouchableOpacity style={{
                                    borderColor: theme.primary,
                                    borderWidth: 1,
                                    padding: 3,
                                    paddingHorizontal: 10,
                                    borderRadius: 20,
                                    alignItems: "center",
                                    alignContent: "center",
                                }}
                                    onPress={() => {
                                        setModalVisible(true)
                                        setIsLoading(false)
                                        setSelectedStudent(item)
                                        setMark(item.marks?.toString() + ".0")
                                    }}
                                >
                                    <Text style={styles.value}>{item?.marks}.0</Text>
                                </TouchableOpacity>
                                <MaterialCommunityIcons name={"dots-vertical"} size={25} color={theme.primaryText} />
                            </View>
                        </View>
                    </View>
                }
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={renderEmptyElement}
            />
        </View>
        <Modal
            onBackButtonPress={() => setModalVisible(false)}
            onBackdropPress={() => setModalVisible(false)}
            onSwipeCancel={() => setModalVisible(false)}
            swipeDirection={'down'}
            isVisible={modalVisible}
            style={styles.modalContent}
            backdropColor={isDarkMode() ? theme.underlayColor : 'black'}>
            <View style={styles.modalView}>
                <ScrollView>
                    <View style={styles.contentContainer}>
                        <View style={styles.viewBar} />
                        <Text style={styles.titleBottonSheet}>Saisie de note</Text>
                        <Divider style={{ width: "50%" }} />
                        <Text style={styles.modalcontainerText}>{selectedStudent?.student_id?.name}</Text>
                        <Text style={styles.modalcontainerText1}>{examsData?.session_id?.name} & {examsData?.subject_id.name}</Text>
                        <View style={styles.InputContainers} >
                            <TextInput
                                placeholder="Note"
                                value={mark}
                                verticalAlign="middle"
                                onChangeText={(text) => setMark(text)}
                                style={styles.input}
                                textAlign="right"
                                textAlignVertical="top"
                                keyboardType="numeric"
                                numberOfLines={1}
                                maxLength={4}
                            />
                            <Text style={styles.noteTitle}>/{examsData?.total_marks} </Text>
                        </View>
                        {/* <View style={styles.InputContainers} >

                            <TextInput
                                placeholder="Ajouter un commentaire"
                                value={mark}
                                verticalAlign="middle"
                                onChangeText={(text) => setMark(text)}
                                style={[styles.input, { fontSize: 15 }]}
                                textAlign="left"
                                textAlignVertical="top"
                                keyboardType="default"
                                numberOfLines={1}
                                maxLength={200}
                            />
                        </View> */}
                        <Button
                            mode="contained-tonal"
                            disabled={isLoading}
                            style={{ flex: 1, backgroundColor: isLoading ? theme.gray : theme.primary, paddingHorizontal: 30, marginTop: 40 }}
                            labelStyle={{ color: theme.secondaryText }}
                            onPress={async () => {
                                if (parseFloat(mark) > examsData?.total_marks) {
                                    Alert.alert("Information", "Veuillez saisir une note correcte.");
                                    return;
                                }
                                await postNoteForStudent()
                            }}
                            icon={isLoading ? undefined : "check-underline"}>
                            {isLoading ?
                                <ActivityIndicator color={theme.secondaryText} />
                                : "Valider"
                            }

                        </Button>
                    </View>
                </ScrollView>
            </View>
        </Modal>

    </View>


}


export default GradeEntryScreen;