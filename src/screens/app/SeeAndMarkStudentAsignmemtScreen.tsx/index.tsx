import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Alert } from "react-native";
import { isDarkMode, useTheme } from "store";
import dynamicStyles from "./styles";
import { getRandomColor, groupTasksByDate, showCustomMessage, Theme } from "utils";
import { AnimatedFAB, Button, Divider } from "react-native-paper";
import { HeaderDashBoad } from "./Components";
import { getData, LOCAL_URL, postData } from "apis";
import useSWRMutation from "swr/mutation";
import { I18n } from 'i18n';
import { SafeAreaView } from "react-native";
import { ScrollView } from "react-native";
import Modal from 'react-native-modal';
import { AssignmentFiles, CustomerLoader } from "components";
import { Linking } from "react-native";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ZodAny } from "zod";
import moment from "moment";
import React from "react";


function SeeAndMarkStudentAsignmemtScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom, student, assignment } = route.params
    const theme = useTheme()
    const [isExtended, setIsExtended] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [assignmenSub, setAssignmentsSub] = useState<any>(null);
    const [loading, setLoading] = useState(true)
    const [note, setNote] = useState("0.0");
    const styles = dynamicStyles(theme)
    const { trigger: setNoteForStudent } = useSWRMutation(`${LOCAL_URL}/api/note/sub-assignment/${assignmenSub?.id}/${parseFloat(note)}`, postData)

    // console.log("=====", assignmenSub);
    const handleViewImages = (url: any) => {

    }


    useEffect(() => {
        const interval = setInterval(() => {
            setIsExtended(prevState => !prevState);
        }, 3000);

        return () => clearInterval(interval);
    }, [])
    useEffect(() => {
        getAssigmentSubmitByStudent()

    }, [refresh])

    const postNoteForStudent = async () => {
        setLoading(true)
        try {
            const assigma = await setNoteForStudent({})
            if (!assigma?.success) {
                showCustomMessage("Information", assigma.message, "warning", "bottom")
                return;
            }
            setShowModal(false);
            getAssigmentSubmitByStudent()
            showCustomMessage("Success", "Note Atribuer avec success", "success", "center")

        } catch (error: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + error.message, "warning", "bottom")

        } finally {
            setLoading(false)
            setRefresh(false)
        }
    };
    const getAssigmentSubmitByStudent = async () => {
        setLoading(true)
        try {
            const assigma = await getData(`${LOCAL_URL}/api/sub-assignment/student/${assignment.id}/${student?.student?.id}`)
            if (!assigma?.success) {
                showCustomMessage("Information", assigma.message, "warning", "bottom")
                return;
            }
            const assigms: any = assigma?.success ? assigma?.data : []
            if (assigms) {
                setAssignmentsSub(assigms[0])

                setNote(assigms[0].marks?.toString())
            }

        } catch (error: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + error.message, "warning", "bottom")

        } finally {
            setLoading(false)
            setRefresh(false)
        }
    };
    const handlePressUrl = async (url: string) => {
        try {


            const supported = await Linking.canOpenURL(url);
            await Linking.openURL(url);
        } catch (error: any) {
            Alert.alert(
                "Avertissement",
                error?.message,
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
            console.log(error);
        }


    };
    const renderItem = (item: any, index: any) => {

        if (item.mimetype === 'image/jpeg') {
            return (<>
                <TouchableOpacity style={styles.item} onPress={() => handleViewImages(item.url)}>
                    <Image source={{ uri: item.url }} style={styles.image} />
                </TouchableOpacity>
                <View style={{ position: "absolute", right: 0, top: 5, justifyContent: "center", alignContent: "center", alignSelf: "center", alignItems: "center", backgroundColor: "blue", borderRadius: 20, paddingHorizontal: 5 }}>
                    <Text style={{ ...Theme.fontStyle.inter.bold, color: theme.secondaryText }}>{index + 1}</Text>
                </View>
            </>
            );
        } else {
            return (
                <>
                    <TouchableOpacity
                        key={item.code}
                        style={styles.itemContainer}
                        onPress={() => {
                            handlePressUrl(item?.url)
                        }}>
                        <Text style={styles.iconText}><MaterialCommunityIcons name="file-pdf-box" size={54} color="#007aff" /></Text>
                        <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                    <View style={{ position: "absolute", right: 0, top: 5, justifyContent: "center", alignContent: "center", alignSelf: "center", alignItems: "center", backgroundColor: "blue", borderRadius: 20, paddingHorizontal: 5 }}>
                        <Text style={{ ...Theme.fontStyle.inter.bold, color: theme.secondaryText }}>{index + 1}</Text>
                    </View>
                </>
            );

        }
    };
    return <SafeAreaView style={styles.container}>
        <HeaderDashBoad navigation={navigation} children={student} theme={theme} />
        <ScrollView style={styles.content}>

            <View style={styles.headerContainer}>
                <View style={styles.headerContents}>
                    <View style={styles.headerBar} />
                    <View style={styles.headerContent}>
                        <Text style={styles.subjectName}>{assignment?.name}</Text>
                        <Text style={styles.classeName}>{classRoom.name}</Text>
                    </View>
                </View>
                <View>
                    <Text style={{ ...Theme.fontStyle.inter.regular, fontSize: 14, color: theme.primaryText }}>{I18n.t("SeeAndMarkStudentAsignmemtScreen.submittedOn")} <Text style={{ ...Theme.fontStyle.inter.semiBold }}> {assignmenSub && moment(assignmenSub?.submission_date).format("LLLL")}</Text></Text>

                    <View style={{ flexDirection: "row", justifyContent: "space-evenly", paddingVertical: 5, alignItems: "center", gap: 10, }}>
                        <TouchableOpacity style={{ borderColor: theme.primary, borderWidth: 1, flex: 1, alignItems: "center", padding: 5, borderRadius: 5 }}>
                            <Text style={styles.textLab}>{I18n.t("SeeAndMarkStudentAsignmemtScreen.note")}</Text>
                            <Text style={styles.textVal}>{assignmenSub?.marks} /20</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ borderColor: theme.primary, borderWidth: 1, flex: 1, alignItems: "center", padding: 5, borderRadius: 5 }}>
                            <Text style={styles.textLab}>{I18n.t("SeeAndMarkStudentAsignmemtScreen.status")}</Text>
                            <Text style={styles.textVal}>{assignmenSub?.state}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View >
                <Text style={styles.itemTitle}>{I18n.t("SeeAndMarkStudentAsignmemtScreen.assignmentDescription")}</Text>
                <Divider />
            </View>
            <View style={styles.taskContainer}>
                <Text style={styles.taskContainerText}>{assignmenSub?.description}</Text>
            </View>
            <View >
                <Text style={styles.itemTitle}>{I18n.t("SeeAndMarkStudentAsignmemtScreen.attachedDocuments")}</Text>
                <Divider />
            </View>
            <View style={styles.docContainer}>

                {assignmenSub && renderItem(assignmenSub?.document, 0)}
            </View>
        </ScrollView>



        <Modal
            onBackButtonPress={() => setShowModal(false)}
            onBackdropPress={() => setShowModal(false)}
            onSwipeCancel={() => setShowModal(false)}
            swipeDirection={'down'}
            isVisible={showModal}
            style={styles.modalContent}
            backdropColor={isDarkMode() ? theme.underlayColor : 'black'}>
            <View style={styles.modalView}>
                <ScrollView>
                    <View style={styles.contentContainer}>
                        <View style={styles.viewBar} />
                        <Text style={styles.titleBottonSheet}>{I18n.t("SeeAndMarkStudentAsignmemtScreen.enterGrade")}</Text>
                        <Divider style={{ width: "50%" }} />
                        <Text style={styles.modalcontainerText}>{I18n.t("SeeAndMarkStudentAsignmemtScreen.gradingConfirmation")}</Text>
                        <View style={styles.InputContainers} >
                            <TextInput
                                placeholder={I18n.t("SeeAndMarkStudentAsignmemtScreen.placeholderNote")}
                                value={note}
                                verticalAlign="middle"
                                onChangeText={(text) => setNote(text)}
                                style={styles.input}
                                textAlign="right"
                                textAlignVertical="top"
                                keyboardType="numeric"
                                numberOfLines={1}
                                maxLength={4}
                            />
                            <Text style={styles.noteTitle}>/20</Text>
                        </View>
                        <Button
                            mode="contained-tonal"
                            disabled={loading}
                            style={{ flex: 1, backgroundColor: loading ? theme.gray : theme.primary, paddingHorizontal: 30, marginTop: 40 }}
                            labelStyle={{ color: theme.secondaryText }}
                            onPress={async () => {
                                if (parseFloat(note) > 20) {
                                    Alert.alert("Information", I18n.t("SeeAndMarkStudentAsignmemtScreen.enterValidGrade"));
                                    return;
                                }
                                await postNoteForStudent()
                            }}
                            icon={loading ? undefined : "check-underline"}>
                            {loading ?
                                <ActivityIndicator color={theme.secondaryText} />
                                : I18n.t("SeeAndMarkStudentAsignmemtScreen.validate")
                            }

                        </Button>
                    </View>
                </ScrollView>
            </View>
        </Modal>

        <AnimatedFAB
            icon="file-edit-outline"
            label={I18n.t("SeeAndMarkStudentAsignmemtScreen.assignGrade")}
            extended={isExtended}
            onPress={() => {
                setShowModal(true)
                setNote(assignmenSub.marks?.toString())
            }}
            visible={true}
            animateFrom="right"
            iconMode="dynamic"
            color={theme.secondaryText}
            style={styles.fabStyle}

        />
        <CustomerLoader loading={loading} theme={theme} I18n={I18n} color={theme.primary} />
    </SafeAreaView>

}









export default SeeAndMarkStudentAsignmemtScreen;

