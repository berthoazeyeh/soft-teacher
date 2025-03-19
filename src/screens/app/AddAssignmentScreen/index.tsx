import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { isDarkMode, useCurrentUser, useTheme } from "store";
import dynamicStyles from "./style";
import { getRandomColor, groupTasksByDate, showCustomMessage, Theme } from "utils";
import { HeaderDashBoad, HorizontalScrollWithAddButton } from "./Components";
import { getData, LOCAL_URL, postData, postDataDoc, RechargeMobileWalletEnd } from "apis";
import useSWRMutation from "swr/mutation";
import { I18n } from 'i18n';
import { SafeAreaView } from "react-native";
import { Picker } from "@react-native-picker/picker";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button, Divider, TextInput } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";
import { ScrollView } from "react-native";
import Modal from "react-native-modal";
import DocumentScanner, { ResponseType } from 'react-native-document-scanner-plugin'
import { PermissionsAndroid } from "react-native";
import DocumentPicker from 'react-native-document-picker';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React from "react";
import { createAssignment, getAssignmentTypes } from "services/AssignmentsServices";
import { db } from "apis/database";
import { Assignment, AssignmentType } from "services/CommonServices";


const schema = z.object({
    type: z.number({ required_error: I18n.t('AddAssignmentScreen.error_type.required') })
        .min(0, I18n.t('AddAssignmentScreen.error_type.min')),
    subject: z.number({ required_error: I18n.t('AddAssignmentScreen.error_subject.required') })
        .min(0, I18n.t('AddAssignmentScreen.error_subject.min')),
    title: z.string({ required_error: I18n.t('AddAssignmentScreen.error_title.required') })
        .min(5, I18n.t('AddAssignmentScreen.error_title.min')),
    description: z.string({ required_error: I18n.t('AddAssignmentScreen.error_description.required') })
        .min(5, I18n.t('AddAssignmentScreen.error_description.min')),
    date: z.date({ required_error: I18n.t('AddAssignmentScreen.error_date.required') }),

    document: z.array(z.any()).optional(),

    // document: z.array(z.any({ required_error: I18n.t('AddAssignmentScreen.error_document.required') }), { required_error: I18n.t('AddAssignmentScreen.error_document.required') }).nonempty(I18n.t('AddAssignmentScreen.error_document.nonempty')),
});


function AddAssignmentScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom } = route.params
    const [files, setFiles] = useState<any>([]);
    const theme = useTheme()
    const user = useCurrentUser()
    const [isLoadingType, setIsLoadingType] = useState(true)
    const [isLoadingSubject, setIsLoadingSubject] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [isScan, setIsScan] = useState<any>(null)
    const [subjectList, setSubjectList] = useState<any>(classRoom?.subjects ?? [])
    const [assignmentType, setAssignmentType] = useState<any>([])

    const form = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });
    const { trigger: createNewAssignment } = useSWRMutation(`${LOCAL_URL}/api/crud/assignment`, postDataDoc)

    const styles = dynamicStyles(theme)
    // const { trigger: getAssignmentTypes } = useSWRMutation(`${LOCAL_URL}/api/grading.assignment.type/search`, getData)
    const { trigger: getTeacherSubjectInClassRoome } = useSWRMutation(`${LOCAL_URL}/api/subjects/faculty/${user?.id}/${classRoom?.id}`, getData)
    // console.log(classRoom);


    useEffect(() => {
        // getTeacherSubjectInClassRoom();
        getAssignmentType()
    }, [])
    const getTeacherSubjectInClassRoom = async () => {
        try {
            setIsLoadingSubject(true);
            const subject = await getTeacherSubjectInClassRoome();
            if (subject?.success) {
                const data: any[] = subject?.success ? subject?.data : []
                if (classRoom.isSecondary && classRoom?.subjects?.length > 0) {
                    setSubjectList(classRoom?.subjects);
                } else {
                    setSubjectList(data ?? []);

                }
            } else {
                // showCustomMessage(I18n.t('AddAssignmentScreen.info'), subject.message, "warning", "bottom")
            }
        } catch (err: any) {
            // showCustomMessage(I18n.t('AddAssignmentScreen.info'), I18n.t('AddAssignmentScreen.loadingError') + err.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoadingSubject(false);
        }
    };
    const getAssignmentType = async () => {
        try {
            setIsLoadingType(true);
            const subject = await getAssignmentTypes(db);
            if (subject?.success) {
                const data: AssignmentType[] = subject?.data ? subject?.data : []
                // console.log(data);
                setAssignmentType(data);
            } else {
                showCustomMessage(I18n.t('AddAssignmentScreen.info'), I18n.t('AddAssignmentScreen.loadingError') + " " + subject.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage(I18n.t('AddAssignmentScreen.info'), I18n.t('AddAssignmentScreen.loadingError') + err.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoadingType(false);
        }

    };


    const handleSubmittedFormuler = async (data: any) => {
        console.log(data);

        setIsLoading(true);


        const subject = subjectList.find((item: any) => item.id === data.subject)
        const type = assignmentType.find((item: any) => item.id === data.type)
        const newAssignmentData: Assignment = {
            id: 0,
            is_local: true,
            name: data.title,
            description: data.description,
            reviewer: "",
            course_id: { id: classRoom?.course?.id, name: classRoom?.course?.name },
            subject_id: subject ?? { id: 1, name: "" },
            submission_date: moment(data.date).format("YYYY-MM-DD HH:mm:ss"),
            issued_date: moment(data.date).format("YYYY-MM-DD HH:mm:ss"),
            assignment_type: type ?? data.type,
            document: data.document?.[0] ?? '',
            batch_id: 0,
            active: true,
            state: "draft",
            marks: 0,
            submissions: [],
            room_id: [{ id: classRoom?.id, name: classRoom?.name }],
        }


        const assignmentData = {
            'name': data.title,
            'faculty_id': user.id,
            'room_id': classRoom.id,
            'subject_id': data.subject,
            'description': data.description,
            'submission_date': moment(data.date).format("YYYY-MM-DD HH:mm:ss"),
            'assignment_type': data.type,
            'document': data.document?.[0],

        }
        try {
            const response = await createAssignment(db, newAssignmentData);
            showCustomMessage("Succes", response, 'success', "center");
            navigation.goBack();
            // const response = await createNewAssignment(assignmentData);
            // console.log(response);

            // if (response?.success) {
            //     showCustomMessage("Succes", response.message, 'success', "center");
            //     const data = response.data;
            //     navigation.goBack();
            // } else {
            //     showCustomMessage(I18n.t('AddAssignmentScreen.info'), response?.message, "warning", "bottom")
            // }

        } catch (err: any) {
            showCustomMessage(I18n.t('AddAssignmentScreen.info'), I18n.t('AddAssignmentScreen.loadingError') + err.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoading(false);
        }
    }


    const permmition = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'Enable Location Services',
                message:
                    'Our app needs access to your camera ' +
                    'so you can take awesome rides.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true
        } else {
            return false

        }
    }
    const startChossingDocumment = async (onchange: (val: any) => void) => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.images, DocumentPicker.types.xls, DocumentPicker.types.plainText, DocumentPicker.types.docx, DocumentPicker.types.doc],
                copyTo: "cachesDirectory"
            });
            const nouvelleListe: any[] = files;
            const listeFusionnee: any[] = nouvelleListe ? nouvelleListe.concat(result) : result;
            if (result) {
                onchange(listeFusionnee)
                setFiles(listeFusionnee)
            }

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log(
                    "selection annuler"
                );
            } else {
                console.log(
                    err
                );
                throw err;
            }
        } finally {
            setIsScan(null)

        }
    }

    const startScanningDocumment = async (onchange: (val: any) => void) => {
        if (await permmition()) {
            try {
                const { scannedImages } = await DocumentScanner.scanDocument({})
                const nouvelleListe = files;
                const listeCorrect = scannedImages ? scannedImages.map((element: any) => {
                    return {
                        "fileCopyUri": element, "name": (element?.toString())?.split("/")[((element?.toString())?.split("/"))?.length - 1], "size": 50693, "type": "image/jpeg", "uri": element
                    }
                }) : []
                let listeFusionnee = nouvelleListe ? nouvelleListe.concat(listeCorrect) : listeCorrect;
                if (scannedImages && scannedImages.length > 0) {
                    onchange(listeFusionnee)
                    setFiles(listeFusionnee)
                }
            } catch (error: any) {
                console.log(error);
                showCustomMessage(I18n.t('AddAssignmentScreen.info'), error?.message, "warning", "bottom")
                setIsScan(null)
            }
        }
    }
    const onPressAddButton = (onchange: (val: any) => void) => {
        if (isScan != null) {
            if (isScan === true) {
                startScanningDocumment(onchange)
            } else {
                startChossingDocumment(onchange)
            }
        } else {
            setShowModal(true)
        }
    }



    const onPress = (scan: boolean, onChange: (...event: any[]) => void) => {
        setShowModal(false)
        if (scan) {
            startScanningDocumment(onChange)
        } else {
            startChossingDocumment(onChange)
        }

    }

    const onDeleteItem = (item: any, onchange: (val: any) => void) => {
        const updatedList = files.filter((file: any) => file.name !== item.name);
        onchange(updatedList);
        setFiles(updatedList);
    }

    const renderHeader = (data: any[], selectedValue: any, setSelectedValue: any, text: any, isLoading: boolean) => (<>
        <View style={styles.header}>
            <View style={styles.profil}>
                {isLoading &&
                    <ActivityIndicator color={"green"} size={25} />
                }
                {!isLoading &&
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
                    label={text}
                    value={"studentI.id"} />
                {data?.map(studentI => <Picker.Item
                    style={styles.pickerItemStyle}
                    key={studentI}
                    label={studentI.name}
                    value={studentI?.id} />)}
            </Picker>
        </View>
    </>
    );


    return <SafeAreaView style={styles.container}>
        <HeaderDashBoad navigation={navigation} children={classRoom} theme={theme} />
        <ScrollView style={styles.content}>

            <Text style={{ textAlign: "center", ...Theme.fontStyle.inter.bold, color: theme.primary, paddingVertical: 15, fontSize: 18, }}>
                {I18n.t('AddAssignmentScreen.createNewAssignment')}
            </Text>
            <Controller
                control={form.control}
                name="subject"
                render={({ field, fieldState }) => {
                    return <View >
                        <Text style={{ ...Theme.fontStyle.inter.regular, color: theme.primaryText, paddingBottom: 5, fontSize: 14, }}>
                            {I18n.t('AddAssignmentScreen.chooseCourse')}
                        </Text>
                        {renderHeader(subjectList, field.value, field.onChange, I18n.t('AddAssignmentScreen.chooseCourse'), isLoadingSubject)}
                        {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                    </View>
                }} />
            <Controller
                control={form.control}
                name="type"
                render={({ field, fieldState }) => {
                    return <View >
                        <Text style={{ ...Theme.fontStyle.inter.regular, color: theme.primaryText, paddingBottom: 5, fontSize: 14, }}>
                            {I18n.t('AddAssignmentScreen.chooseExerciseType')}
                        </Text>
                        {renderHeader(assignmentType, field.value, field.onChange, I18n.t('AddAssignmentScreen.chooseExerciseType'), isLoadingType)}
                        {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                    </View>
                }} />


            <Controller
                control={form.control}
                name="title"
                render={({ field, fieldState }) => {
                    return <View >
                        <Text style={{ ...Theme.fontStyle.inter.regular, color: theme.primaryText, paddingBottom: 0, fontSize: 14, }}>
                            {I18n.t('AddAssignmentScreen.assignmentTitle')}
                        </Text>
                        <TextInput
                            placeholder={I18n.t('AddAssignmentScreen.assignmentTitle')}
                            value={field.value || ''}
                            onChangeText={field.onChange}
                            onChange={() => (form.formState.isValid)}
                            style={styles.input}
                            textAlign="left"
                            textAlignVertical="top"
                            numberOfLines={1}
                        />
                        {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                    </View>
                }} />

            <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => {
                    return <View >
                        <Text style={{ ...Theme.fontStyle.inter.regular, color: theme.primaryText, paddingBottom: 0, fontSize: 14, }}>
                            {I18n.t('AddAssignmentScreen.assignmentDescription')}
                        </Text>
                        <TextInput
                            placeholder={I18n.t('AddAssignmentScreen.assignmentDescription')}
                            value={field.value || ''}
                            onChangeText={field.onChange}
                            onChange={() => (form.formState.isValid)}
                            style={styles.input}
                            textAlign="left"
                            textAlignVertical="top"
                            numberOfLines={5}
                            multiline={true} />
                        {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                    </View>
                }} />




            <Controller
                control={form.control}
                name="date"
                render={({ field, fieldState }) => {
                    return <View >
                        <Text style={{ ...Theme.fontStyle.inter.regular, color: theme.primaryText, paddingBottom: 0, fontSize: 14, }}>
                            {I18n.t('AddAssignmentScreen.chooseEndDate')}
                        </Text>
                        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                            <MaterialCommunityIcons name="calendar-today" size={20} color={theme.primary} />
                            <Text style={styles.dateText}>

                                {field.value ? `  ${moment(field.value).format("LLLL")}` : "  " + I18n.t('AddAssignmentScreen.chooseEndDate')}
                            </Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={field.value ? new Date(field.value) : new Date()}
                                minimumDate={new Date()}
                                mode={'date'}
                                display="default"
                                onChange={(event: any, selectedDate: any) => {
                                    field.onChange(selectedDate)
                                    setShowDatePicker(false)
                                }} />
                        )}
                        {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                    </View>
                }} />



            <Controller
                control={form.control}
                name="document"
                render={({ field, fieldState }) => {
                    return <View >
                        <Button
                            mode="contained-tonal"
                            style={{ marginTop: 20, width: "100%" }}
                            onPress={() => setShowModal(true)}
                            icon={"file"}>
                            {I18n.t('AddAssignmentScreen.uploadDocuments')}
                        </Button>
                        {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                        <HorizontalScrollWithAddButton onPressAddButton={onPressAddButton} files={files} onDeleteItem={onDeleteItem} onchange={field.onChange} />

                    </View>
                }} />

            <Button
                mode="contained-tonal"
                style={{ marginTop: 20, marginBottom: 30, width: "100%", backgroundColor: theme.primary }}
                onPress={() => {
                    if (!form.formState.isValid) {
                        console.log("----------------------", form.formState.isValid);
                        showCustomMessage(I18n.t('AddAssignmentScreen.info'), I18n.t('AddAssignmentScreen.allFieldsRequired'), "warning", "bottom")
                        form.handleSubmit(handleSubmittedFormuler)();

                        return;
                    }
                    form.handleSubmit(handleSubmittedFormuler)();
                }
                }

                labelStyle={{ color: theme.secondaryText, fontSize: 18 }}

                icon={isLoading ? undefined : "publish"}>
                {isLoading ?
                    <ActivityIndicator color={theme.secondaryText} />
                    : I18n.t('AddAssignmentScreen.publishAssignment')
                }

            </Button>
        </ScrollView>

        <Modal
            onBackButtonPress={() => setShowModal(false)}
            onBackdropPress={() => setShowModal(false)}
            swipeDirection={'down'}
            isVisible={showModal}
            style={styles.modalContent}
            backdropColor={isDarkMode() ? theme.underlayColor : 'black'}>
            <View style={styles.modalView}>
                <ScrollView>
                    <Controller
                        control={form.control}
                        name="document"
                        render={({ field, fieldState }) => {
                            return <View style={styles.contentContainer}>
                                <View style={styles.viewBar} />
                                <Text style={styles.titleBottonSheet}>{I18n.t('AddAssignmentScreen.uploadOrScanDocs')}</Text>
                                <Divider style={{ width: "50%" }} />
                                <Button
                                    mode="contained-tonal"
                                    style={{ flex: 1, marginVertical: 20, width: "100%" }}
                                    onPress={() => {
                                        setIsScan(true)
                                        onPress(true, field.onChange)

                                    }}
                                    icon={"eye"}>
                                    {I18n.t('AddAssignmentScreen.scanAssignment')}
                                </Button>
                                <Button
                                    mode="contained-tonal"
                                    style={{ flex: 1, backgroundColor: theme.primary, width: "100%" }}
                                    labelStyle={{ color: theme.secondaryText }}
                                    onPress={() => {
                                        setIsScan(false)
                                        onPress(false, field.onChange)
                                    }}
                                    icon={"file"}>
                                    {I18n.t('AddAssignmentScreen.uploadFromDevice')}
                                </Button>
                            </View>
                        }} />
                </ScrollView>
            </View>
        </Modal>
    </SafeAreaView>

}








const createStyles = (theme: any) => StyleSheet.create({
    container: {
        justifyContent: "center",
        paddingHorizontal: 5
    },
    dateContainer: {
        backgroundColor: theme.gray3,
        padding: 10,
        // borderRadius: 10,
        marginVertical: 10,
    },
    dateText: {
        ...Theme.fontStyle.inter.semiBold,
        color: "black",
    },
    taskContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingTop: 5,
    },
    colorIndicator: {
        backgroundColor: getRandomColor(),
        width: 7,
        height: "100%",
        borderRadius: 5,
        position: "absolute",
    },
    taskDetailsContainer: {
        marginLeft: 17,
        justifyContent: "space-between",
        gap: 5,
        width: "80%"
    },

    subjectText: {
        ...Theme.fontStyle.inter.bold,
        color: theme.primaryText,
    },
    taskText: {
        ...Theme.fontStyle.inter.regular,
        color: theme.primaryText,
    },
    statusContainer: {
        alignSelf: "flex-end",
        backgroundColor: theme.gray3,
        alignContent: "center",
        justifyContent: "center",
        padding: 5,
        borderRadius: 10,
        paddingHorizontal: 15,

    },
    statusText: {
        ...Theme.fontStyle.inter.semiBold,
        color: theme.primaryText,
        textAlign: "center",
    },
    statusText1: {
        ...Theme.fontStyle.inter.regular,
        color: theme.primary,
        textAlign: "center",
    },
    itemContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: theme.gray3,
        alignItems: "center",
        padding: 10,
        marginVertical: 10,
        gap: 10,
        borderRadius: 10
    },
    iconText: {
        padding: 10,
    },

    itemText: {
        padding: 10,
        fontSize: 16,
    },
    dueText: {
        ...Theme.fontStyle.inter.italic,
        color: theme.primaryText,
        textAlign: "right",
        paddingVertical: 10,
    },
    description: {
        ...Theme.fontStyle.inter.semiBold,
        color: theme.primaryText,
        textAlign: "left",
        paddingVertical: 10,
    },
})
export default AddAssignmentScreen;

