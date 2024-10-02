import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { isDarkMode, useTheme } from "store";
import dynamicStyles from "./style";
import { getRandomColor, groupTasksByDate, Theme } from "utils";
import { HeaderDashBoad } from "./Components";
import { getData, LOCAL_URL } from "apis";
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
import HorizontalScrollWithAddButton from "./Components/HorizontalScrollWithAddButton";
import DocumentScanner, { ResponseType } from 'react-native-document-scanner-plugin'
import { PermissionsAndroid } from "react-native";
import DocumentPicker from 'react-native-document-picker';


function AddAssignmentScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { children } = route.params
    const [files, setFiles] = useState<any>([]);
    const theme = useTheme()
    const [assignment, setAssignment] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [selectedDate, setSelectedDate] = useState<any>(null)
    const [showModal, setShowModal] = useState(false)
    const [isScan, setIsScan] = useState<any>(null)
    const [visibleImage, setVisibleImage] = useState(false)
    const [selectedValue, setSelectedValue] = useState<any>();
    const [description, setDescription] = useState("");


    const styles = dynamicStyles(theme)
    const { trigger: getStudentCoursesID } = useSWRMutation(`${LOCAL_URL}/api/op.admission/search?domain=[('student_id','=',${children?.id})]`, getData)
    const [student, setStudent] = useState<any[]>([
        { id: 1, name: "Methemetique" },
        { id: 2, name: "Informatque", },
    ])


    console.log("files", files);

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
    const startChossingDocumment = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.images, DocumentPicker.types.xls, DocumentPicker.types.plainText, DocumentPicker.types.docx, DocumentPicker.types.doc],
                copyTo: "cachesDirectory"
            });
            // console.log(
            //     result
            // );
            const nouvelleListe: any[] = files;
            const listeFusionnee: any[] = nouvelleListe ? nouvelleListe.concat(result) : result;
            if (result) {
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
        }
    }

    const startScanningDocumment = async () => {
        if (await permmition()) {
            const { scannedImages } = await DocumentScanner.scanDocument({})
            const nouvelleListe = files;
            const listeCorrect = scannedImages ? scannedImages.map((element: any) => {
                return {
                    "fileCopyUri": element, "name": (element?.toString())?.split("/")[((element?.toString())?.split("/"))?.length - 1], "size": 50693, "type": "image/jpeg", "uri": element
                }
            }) : []
            let listeFusionnee = nouvelleListe ? nouvelleListe.concat(listeCorrect) : listeCorrect;

            if (scannedImages && scannedImages.length > 0) {
                setFiles(listeFusionnee)
            }
        }
    }
    const onPressAddButton = () => {
        if (isScan != null) {
            if (isScan === true) {
                startScanningDocumment()
            } else {
                startChossingDocumment()
            }
        } else {
            setShowModal(true)
        }
    }



    const onPress = (scan: boolean) => {
        setShowModal(false)
        if (scan) {
            startScanningDocumment()
        } else {
            startChossingDocumment()
        }

    }
    const onChangeDate = (event: any, selectedDate: any) => {
        setShowDatePicker(false);
        setSelectedDate(selectedDate)
    }
    const renderHeader = () => (<>
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
                itemStyle={{ color: theme.primaryText, ...Theme.fontStyle.montserrat.bold }}
                selectedValue={selectedValue}
                onValueChange={(itemValue) => setSelectedValue(itemValue)}
                style={styles.picker}>
                <Picker.Item
                    style={styles.pickerItemStyle}
                    label={"Choisir le cours"}
                    value={"studentI.id"} />
                {student.map(studentI => <Picker.Item
                    style={styles.pickerItemStyle}
                    key={studentI}
                    label={studentI.name}
                    value={studentI} />)}
            </Picker>
        </View>
    </>
    );


    return <SafeAreaView style={styles.container}>
        <HeaderDashBoad navigation={navigation} children={children} theme={theme} />
        <ScrollView style={styles.content}>

            <Text style={{ textAlign: "center", ...Theme.fontStyle.montserrat.bold, color: theme.primary, paddingVertical: 15, fontSize: 18, }}>
                {"Creer un nouveau devoir pour la classe "}
            </Text>
            {renderHeader()}

            <TextInput
                placeholder="Titre du devoir"
                value={description}
                onChangeText={(text) => setDescription(text)}
                style={styles.input}
                textAlign="left"
                textAlignVertical="top"
                numberOfLines={1}
            />
            <TextInput
                placeholder="Description du devoir (100 à 250 mots)"
                value={description}
                onChangeText={(text) => setDescription(text)}
                style={styles.input}
                textAlign="left"
                textAlignVertical="top"
                numberOfLines={5}
                multiline={true} />



            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
                <MaterialCommunityIcons name="calendar-today" size={20} color={theme.primary} />
                <Text style={styles.dateText}>

                    {selectedDate ? `  ${moment(selectedDate).format("LLLL")}` : "  Choisir la date de fin"}
                </Text>
            </TouchableOpacity>
            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate ? new Date(selectedDate) : new Date()}
                    minimumDate={new Date()}
                    mode={'date'}
                    display="default"
                    onChange={onChangeDate} />
            )}
            <Button
                mode="contained-tonal"
                style={{ marginTop: 20, width: "100%" }}
                onPress={() => setShowModal(true)}
                icon={"file"}>
                Charger les documents
            </Button>
            <HorizontalScrollWithAddButton onPressAddButton={onPressAddButton} files={files} />



            <Button
                mode="contained-tonal"
                style={{ marginTop: 20, marginBottom: 30, width: "100%", backgroundColor: theme.primary }}
                onPress={() => setShowModal(true)}
                icon={"publish"}

                labelStyle={{ color: theme.secondaryText, fontSize: 18 }}
            >
                Publier le devoir
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
                    <View style={styles.contentContainer}>
                        <View style={styles.viewBar} />
                        <Text style={styles.titleBottonSheet}>Telecherger ou scanner les documments liers au devoirs</Text>
                        <Divider style={{ width: "50%" }} />
                        <Button
                            mode="contained-tonal"
                            style={{ flex: 1, marginVertical: 20, width: "100%" }}
                            onPress={() => {
                                setIsScan(true)
                                onPress(true)

                            }}
                            icon={"eye"}>
                            Scanner le devoirs
                        </Button>
                        <Button
                            mode="contained-tonal"
                            style={{ flex: 1, backgroundColor: theme.primary, width: "100%" }}
                            labelStyle={{ color: theme.secondaryText }}
                            onPress={() => {
                                setIsScan(false)
                                onPress(false)
                            }}
                            icon={"file"}>
                            Telecharger depuis mon appariel
                        </Button>
                    </View>
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
        ...Theme.fontStyle.montserrat.semiBold,
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
        ...Theme.fontStyle.montserrat.bold,
        color: theme.primaryText,
    },
    taskText: {
        ...Theme.fontStyle.montserrat.regular,
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
        ...Theme.fontStyle.montserrat.semiBold,
        color: theme.primaryText,
        textAlign: "center",
    },
    statusText1: {
        ...Theme.fontStyle.montserrat.regular,
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
        ...Theme.fontStyle.montserrat.italic,
        color: theme.primaryText,
        textAlign: "right",
        paddingVertical: 10,
    },
    description: {
        ...Theme.fontStyle.montserrat.semiBold,
        color: theme.primaryText,
        textAlign: "left",
        paddingVertical: 10,
    },
})
export default AddAssignmentScreen;

