import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, Easing } from "react-native";
import { isDarkMode, useCurrentUser, useTheme } from "store";
import dynamicStyles from "./styles";
import { showCustomMessage, Theme } from "utils";
import { FlatList } from "react-native";
import moment from "moment";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Divider, RadioButton, Searchbar } from "react-native-paper";
import { Animated } from "react-native";
import Modal from 'react-native-modal';
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";
import useSWRMutation from "swr/mutation";
import { getData, LOCAL_URL, postData } from "apis";
import LinearGradient from 'react-native-linear-gradient';
import { Alert } from "react-native";
import NotesItem from "./components/NotesItem";
import { dataStucture } from "./AddNewOrUpdateExams";
import { hideHeader, showHeader } from "./utils";
import { I18n } from 'i18n';
import { SatisticModal } from "./components/SatisticModal";


function GradeEntryScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom } = route.params
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const [statisticModalVisible, setStatisticModalVisible] = useState(false)
    const [isLoadingSession, setIsLoadingSession] = useState(false)
    const [isLoadingExam, setIsLoadingExam] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [mark, setMark] = useState("")
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const [selectedSession, setSelectedSession] = useState<any>(null)
    const [selectedSubject, setSelectedSubject] = useState<any>(null)
    const [selectedSubExam, setSelectedSubExam] = useState<any>(null)
    const [selectedExam, setSelectedExam] = useState<any>(null)
    const [examTypeList, setExamTypeList] = useState<any>(null)
    const [selectedExamType, setSelectedExamType] = useState<any>(null)
    const styles = dynamicStyles(theme)
    const [filteredData, setFilteredData] = useState<any[]>([])
    const [sessions, setSessions] = useState<any[]>([])
    const [subject, setSubject] = useState<any[]>([])
    const [subExamList, setSubExamList] = useState<any[]>([])
    const [examsList, setExamsList] = useState<any[]>([])
    const [modalVisible, setModalVisible] = useState(false);
    const headerHeight = useRef(new Animated.Value(60)).current;
    const filterHeight = useRef(new Animated.Value(45)).current;
    const GradeEntryText: any = I18n.t("Dashboard.GradeEntry");


    const [examsData, setExamsData] = useState<any>(null)
    const user = useCurrentUser();

    const list = selectedSession ? (dataStucture[sessions.find(item => item.id === selectedSession)?.exam_type?.code as keyof typeof dataStucture] || []) : [];

    const { trigger: getTeacherSubjectInClassRoome, isMutating: isLoadingSubjects } = useSWRMutation(`${LOCAL_URL}/api/subjects/faculty/${user?.id}/${classRoom?.id}`, getData)
    const { trigger: getTeacherExamsSessions } = useSWRMutation(`${LOCAL_URL}/api/exams-sessions/${classRoom?.id}`, getData);
    const { trigger: getStudentWithListNote } = useSWRMutation(`${LOCAL_URL}/api/notes/exam/type/${selectedExam}/${classRoom?.id}/${selectedExamType?.toLowerCase()}`, getData);
    const { trigger: getStudentWithOneSubExam } = useSWRMutation(`${LOCAL_URL}/api/notes/sub-exam/${selectedSubExam?.id}/${classRoom?.id}`, getData);
    const { trigger: setNoteForStudent } = useSWRMutation(`${LOCAL_URL}/api/change-notes/student/exam/${selectedExam}`, postData)
    const { trigger: postNoteForStudentSubExam } = useSWRMutation(`${LOCAL_URL}/api/change-notes/student/sub-exam/${selectedSubExam?.id}`, postData)


    const postNoteForStudent = async () => {
        const data = {
            student_id: selectedStudent?.id,
            marks: parseInt(mark)
        }
        setIsLoading(true)
        try {
            const res = await postNoteForStudentSubExam(data)
            // console.log("..///////", res);
            setIsLoading(false)

            if (!res?.success) {

                showCustomMessage("Information", res.message, "warning", "bottom")
                return;
            }
            getTeacherExamsStudentSync()
            setModalVisible(false);
            showCustomMessage("Success", GradeEntryText.message_success, "success", "center")

        } catch (error: any) {
            setIsLoading(false)

            showCustomMessage("Information", GradeEntryText.message_error + error.message, "warning", "bottom")

        } finally {
            setIsLoading(false)
        }
    };


    useEffect(() => {
        hideHeader(headerHeight)
        getTeacherExamsSession()
    }, []);

    useEffect(() => {
        if (selectedSession) {
            setSelectedExamType(list[0]);
            getTeacherSubjectInClassRoom()
        }
    }, [selectedSession]);

    useEffect(() => {
        if (selectedSubject)
            getTeacherExams()
    }, [selectedSubject]);

    useEffect(() => {
        if (selectedExam) {
            GetStudentWithListNote()
        }
    }, [selectedExam, selectedExamType,]);
    useEffect(() => {
        if (selectedSubExam) {
            GetStudentWithOneSubExam()
        } else if (selectedExam) {
            GetStudentWithListNote()
        }
    }, [selectedSubExam]);
    useEffect(() => {
        if (selectedExam) {
            getCorrectFormatedExams(selectedExamType);
            setSelectedSubExam(null);
        }
    }, [selectedExam, selectedExamType]);

    useEffect(() => {
        onChangeSearch(searchQuery);
    }, [examsData]);


    const getCorrectFormatedExams = (selectedExamType: any) => {
        console.log("////////................................................................");

        const exam = examsList.find(item => item.id === selectedExam);
        if (exam) {
            const list = selectedSession ? (dataStucture[sessions.find(item => item.id === selectedSession)?.exam_type?.code as keyof typeof dataStucture] || []) : [];
            const dataExams = exam ? list.reduce((result, label, index) => {
                const item = exam[label.toLowerCase() as keyof typeof dataStucture];
                if (selectedExamType && selectedExamType?.toLowerCase() === label.toLowerCase()) {
                    setSubExamList(item);
                } else if (!selectedExamType && index === 0) {
                    setSubExamList(item);
                }
                result[label.toLowerCase()] = item
                    ? item
                    : null;
                return result;
            }, {} as Record<string, any | null>) : {};
            const flattenedData = Object.entries(dataExams)

            setExamTypeList(flattenedData)
            return
        } else {
            setExamTypeList([])
        }

    }


    const getTeacherSubjectInClassRoom = async () => {
        try {
            const res = await getTeacherSubjectInClassRoome();
            if (res?.success) {
                const subject: any[] = res?.success ? res?.data : []
                if (classRoom.isSecondary && classRoom?.subjects?.length > 0) {
                    setSubject(classRoom?.subjects);
                } else {
                    setSubject(subject);
                }
                console.log("getTeacherClassRoom------size-------", subject.length);
            } else {
                showCustomMessage("Information", res.message, "warning", "bottom")

            }
        } catch (err: any) {
            showCustomMessage("Information", GradeEntryText.message_error + err.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        }

    };

    const getTeacherExamsSession = async () => {
        try {
            setIsLoadingSession(true);
            const res = await getTeacherExamsSessions();
            if (res?.success) {
                const timetable: any[] = res?.success ? res?.data : []
                setSessions(timetable);
                if (timetable.length > 0) {
                    setSelectedSession(timetable[0].id)
                }
            } else {
                console.log(res);
                showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", GradeEntryText.message_error + err?.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoadingSession(false);
        }
    };

    const getTeacherExams = async () => {

        try {
            setIsLoadingExam(true);
            // const res = await getData(`${LOCAL_URL}/api/exams/session/${selectedSession}`);
            const res = await getData(`${LOCAL_URL}/api/exams/subject/session/${selectedSubject}/${selectedSession}`);
            if (res?.success) {
                const data: any = res?.success ? res?.data : []
                if (data.length > 0) {
                    setSelectedExam(data[0].id)
                    if (list.length > 0) {
                        setSelectedExamType(list[0])
                    }
                }
                setExamsList(data);
            } else {
                showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", GradeEntryText.message_error + err?.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoadingExam(false);
        }

    };
    const GetStudentWithListNote = async () => {
        setExamsData(null)
        try {
            setIsLoading(true);
            const res = await getStudentWithListNote();
            if (res?.success) {
                // console.log(".....", res);
                setExamsData(res?.data);

            } else {
                console.log(".....", res);
                showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", GradeEntryText.message_error + err?.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoading(false);
        }

    };
    const GetStudentWithOneSubExam = async () => {
        setExamsData(null)
        try {
            setIsLoading(true);
            const res = await getStudentWithOneSubExam();
            if (res?.success) {
                // console.log(".....", res?.data);
                setExamsData(res?.data);
            } else {
                console.log(".....", res);
                showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", GradeEntryText.message_error + err?.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoading(false);
        }

    };
    const getTeacherExamsStudentSync = async () => {
        try {
            setIsLoading(true);
            const res = await getStudentWithOneSubExam();
            if (res?.success) {
                // console.log(".....", res?.data);
                setExamsData(res?.data);
            } else {
                console.log(".....", res);
                showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", GradeEntryText.message_error + err?.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoading(false);
        }

    };
    const getStudentWithListNoteSyn = async () => {
        try {
            setIsLoading(true);
            const res = await getStudentWithListNote();
            if (res?.success) {
                // console.log(".....", res?.data);
                setExamsData(res?.data);
            } else {
                console.log(".....", res);
                // showCustomMessage("Information", res?.message, "warning", "bottom")
            }
        } catch (err: any) {
            // showCustomMessage("Information", 'Une erreur s\'est produite :' + err?.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoading(false);
        }

    };


    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = examsData?.filter((item: any) =>
            item?.name.toLowerCase().includes(query.toLowerCase())
        );
        let sortedData = filtered;
        if (selectedSubExam) {
            sortedData = filtered?.sort((a: any, b: any) => {
                if (a.exam_marks?.is_exist) return 1;
                if (b.exam_marks?.is_exist) return -1;
                return 0;
            });
        } else {
            sortedData?.sort((a: any, b: any) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

        }
        setFilteredData(sortedData);
    };


    function getExamStats(students: any[]) {
        let total = 0;
        let withMarks = 0;
        let withoutMarks = 0;
        let passed = 0;
        let failed = 0;
        if (!students) {
            return {
                total,
                withMarks,
                withoutMarks,
                passed,
                failed
            };
        }
        total = students.length;
        students.forEach(student => {
            if (student.exam_marks?.is_exist) {
                withMarks++;
                if (student.exam_marks?.marks !== undefined) {
                    if (student.exam_marks.marks >= 10) {
                        passed++;
                    } else {
                        failed++;
                    }
                }
                if (student.exam_marks?.total_weight_marks !== undefined) {
                    if (student.exam_marks.total_weight_marks >= 10) {
                        passed++;
                    } else {
                        failed++;
                    }
                }
            } else {
                withoutMarks++;
            }
        });

        return {
            total,
            withMarks,
            withoutMarks,
            passed,
            failed
        };
    }
    const renderEmptyElement = () => (
        <View style={styles.emptyData}>
            {isLoading &&
                <ActivityIndicator color={theme.primary} size={25} />}
            {!isLoading &&
                <Text style={styles.emptyDataText}>{GradeEntryText.notstudentFound}</Text>}
        </View>
    );

    const renderHeader = (data: any, selectedValue: any, setSelectedValue: any, text: any, isLoading: boolean, showAdd: boolean, takeObject: boolean) =>
    (<View style={{
        flexDirection: "row", justifyContent: showAdd ? "space-between" : "center",
        width: "100%",
        alignItems: "center",
        alignContent: "center",
        paddingHorizontal: 10,

    }}>
        <View style={[styles.headers, { flex: 1, }]}>
            <View style={styles.profil}>
                {isLoading &&
                    <ActivityIndicator color={"green"} size={25} />
                }
                {!isLoading &&
                    <MaterialCommunityIcons name={"chart-line"} size={25} color={theme.primaryText} />
                }
            </View>
            <Picker
                itemStyle={{ color: theme.primaryText, ...Theme.fontStyle.inter.bold }}
                selectedValue={selectedValue}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
                onFocus={() => selectedExamType && getCorrectFormatedExams(selectedExamType)}
                onTouchStart={() => selectedExamType && getCorrectFormatedExams(selectedExamType)}
                style={[styles.picker]}>
                <Picker.Item
                    style={[styles.pickerItemStyle, { fontSize: 10, }]}
                    label={text}
                    value={null} />
                {data && data?.map((studentI: any) => <Picker.Item
                    style={styles.pickerItemStyle}
                    key={studentI}
                    label={studentI.name}
                    value={takeObject ? studentI : studentI?.id} />)}
            </Picker>
        </View>
        {showAdd && <TouchableOpacity
            onPress={() => {
                navigation.navigate(
                    "AddNewOrUpdateExams",
                    {
                        classRoom,
                        subject: subject.find(item => item.id === selectedSubject),
                        exam: examsList.find((item: any) => item.id === selectedExam),
                        session: sessions.find(item => item.id === selectedSession)
                    })
            }}
            style={[styles.item, { backgroundColor: theme.primary, marginLeft: 5, flexDirection: "row", paddingHorizontal: 7, paddingVertical: 7, justifyContent: "center" }]}>
            <MaterialCommunityIcons name='plus' size={15} color={theme.secondaryText} />
            <Text style={{ fontSize: 10, ...Theme.fontStyle.inter.semiBold, color: theme.secondaryText }}>{"Add"}</Text>
        </TouchableOpacity>}
    </View >
    );

    let position = classRoom.name;
    if (selectedSession) {
        position = position + " > " + sessions.find(item => item.id === selectedSession)?.name;
    }
    if (selectedSubject) {
        position = position + " > " + subject.find(item => item.id === selectedSubject)?.name;
    }
    if (selectedExam) {
        position = position + " > " + examsList?.find((item: any) => item.id === selectedExam)?.name?.split("/")[0];
    }
    if (selectedExam && selectedExamType) {
        position = position + " > " + selectedExamType;
    }
    return <View style={styles.container}>
        <LinearGradient
            colors={[theme.gray, '#434343', theme.gray]}
            start={{ x: 1, y: 1 }}
            end={{ x: 0, y: 0 }}
            style={styles.headerContainer}
        >
            <View style={styles.titleContainer}>
                <Text style={styles.text}>
                    {GradeEntryText?.header_title} ({filteredData?.length})
                </Text>
                <View style={{ flexDirection: "row", gap: 18 }}>
                    <TouchableOpacity
                        style={{ padding: 5, backgroundColor: theme.primary, borderRadius: 30 }}
                        onPress={() => {
                            setStatisticModalVisible(true)
                        }}>
                        <MaterialCommunityIcons name="chart-bar" size={20} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{ marginRight: 7, padding: 5, backgroundColor: theme.primary, borderRadius: 30 }}
                        onPress={() => {
                            showHeader(headerHeight)
                        }}>
                        <MaterialCommunityIcons name='account-search' size={20} color={theme.secondaryText} />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.containerWrap}>
                <View style={styles.item}>
                    <Text style={{ color: theme.secondaryText, ...Theme.fontStyle.inter.semiBold, fontSize: 15, backgroundColor: theme.primaryText, paddingVertical: 5, paddingHorizontal: 3, }}>{position} </Text>
                </View>
                {(selectedSession || selectedExam) && <TouchableOpacity style={[styles.item, { padding: 3, backgroundColor: theme.secondaryText, }]}
                    onPress={() => {
                        setFilteredData([])
                        if (selectedSubExam) {
                            setSelectedSubExam(null)
                            return
                        }
                        if (selectedExam) {
                            setSelectedExam(null)
                            return
                        }
                        if (selectedSubject) {
                            setSelectedSubject(null)
                            return
                        }
                        if (selectedSession) {

                            setSelectedSession(null)
                            return
                        }
                    }}
                >
                    <MaterialCommunityIcons name='close' size={15} color={'red'} />
                </TouchableOpacity>}
            </View>
            {!selectedSession && renderHeader(sessions, selectedSession, setSelectedSession, GradeEntryText.choose_session, isLoadingSession, false, false)}
            {(!selectedSubject && selectedSession) && renderHeader(subject, selectedSubject, setSelectedSubject, GradeEntryText.choose_course, isLoadingSubjects, false, false)}
            {(!selectedExam && selectedSubject) && renderHeader(examsList, selectedExam, setSelectedExam, GradeEntryText.choose_exam, isLoadingExam, true, false)}
            <View style={{ backgroundColor: "white", marginHorizontal: 10, }}>
                {(selectedExam && selectedSubject) && <ScrollView horizontal={true}>
                    <RadioButton.Group onValueChange={newValue => setSelectedExamType(newValue)} value={selectedExamType ?? list?.[0]} >
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                            {list.map((item: any, index: number) => {
                                return (
                                    <View key={index} style={{ flexDirection: "row", alignItems: "center" }}>
                                        <RadioButton value={item} />
                                        <Text style={{ ...Theme.fontStyle.inter.semiBold, color: theme.primaryText }}>{item}</Text>
                                    </View>
                                )
                            })}
                        </View>
                    </RadioButton.Group>

                </ScrollView>}

                {(!selectedSubExam && selectedExam) && renderHeader(subExamList, selectedSubExam, setSelectedSubExam, GradeEntryText.choose_partial, isLoadingExam, true, true)}
            </View>
            {selectedSubExam && <View style={{ padding: 10, marginHorizontal: 10, alignItems: "center", gap: 7, backgroundColor: theme.secondaryText }}>
                <MyCustomerTextAndValue theme={theme} text={GradeEntryText.evaluation} value={selectedSubExam?.name} />
                <View style={{ flexDirection: "row", justifyContent: "space-around", width: "100%" }}>
                    <MyCustomerTextAndValue theme={theme} text={GradeEntryText.weight} value={selectedSubExam?.weight?.toString().slice(0, 4) + " %"} />
                    <MyCustomerTextAndValue theme={theme} text={GradeEntryText.note} value={selectedSubExam?.total_marks ?? "/20"} />
                </View>
            </View>}
        </LinearGradient>

        <Animated.View style={[styles.header, { height: headerHeight }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}>
                <Searchbar
                    placeholder={GradeEntryText.search_placeholder}
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    right={() =>
                        <TouchableOpacity
                            style={{ marginRight: 10 }}
                            onPress={() => {
                                hideHeader(headerHeight)
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
                renderItem={({ item, index }) => <>
                    <NotesItem showbutton={selectedSubExam ? true : false} item={item} onPress={() => {
                        setModalVisible(true)
                        setIsLoading(false)
                        setSelectedStudent(item)
                        setMark(item?.exam_marks ? item?.exam_marks?.marks : "0.0")
                    }}
                        onPressShowMore={() => {
                            setSelectedStudent(item)
                        }}
                        onSuccesUpdateNote={() => {
                            getStudentWithListNoteSyn();
                        }}
                        selectedStudent={selectedStudent ?? item}
                    />
                </>
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
                        <Text style={styles.titleBottonSheet}>{GradeEntryText.header_title}</Text>
                        <Divider style={{ width: "50%" }} />
                        <Text style={styles.modalcontainerText}>{selectedStudent?.name}</Text>
                        <Text style={styles.modalcontainerText1}>
                            {/* {examsList?.name} */}
                            {selectedSubExam?.name} & {"  "}
                            {examsList?.find((item: any) => item.id === selectedExam)?.subject_id?.name}</Text>
                        <View style={styles.InputContainers} >
                            <TextInput
                                placeholder={GradeEntryText.note1}
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
                            <Text style={styles.noteTitle}>/{examsList?.find((item: any) => item.id === selectedExam)?.total_marks} </Text>
                        </View>
                        <Button
                            mode="contained-tonal"
                            disabled={isLoading}
                            style={{ flex: 1, backgroundColor: isLoading ? theme.gray : theme.primary, paddingHorizontal: 30, marginTop: 40 }}
                            labelStyle={{ color: theme.secondaryText }}
                            onPress={async () => {
                                if (parseFloat(mark) > examsData?.total_marks) {
                                    Alert.alert("Information", GradeEntryText.correct_note_alert);
                                    return;
                                }
                                await postNoteForStudent()
                            }}
                            icon={isLoading ? undefined : "check-underline"}>
                            {isLoading ?
                                <ActivityIndicator color={theme.secondaryText} />
                                : GradeEntryText.validate_button
                            }

                        </Button>
                    </View>
                </ScrollView>
            </View>
        </Modal>
        <SatisticModal isVisible={statisticModalVisible} onDismiss={setStatisticModalVisible} data={getExamStats(examsData)} />

    </View>


}

type TextValue = {
    text: string;
    value: string;
    theme: any;
    showClose?: boolean;
}
const MyCustomerTextAndValue = ({ theme, text, value }: TextValue) => {
    return (<Text style={{ color: theme.primaryText, fontSize: 16, ...Theme.fontStyle.inter.bold, }}>
        {text}
        <Text style={{ color: theme.primary, fontSize: 16, marginLeft: 10, ...Theme.fontStyle.inter.semiBold }}>
            {' '}  {value}
        </Text>
    </Text>
    )
}

export default GradeEntryScreen;