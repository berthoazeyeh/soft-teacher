import { useCallback, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { isDarkMode, useCurrentUser, useTheme } from "store";
import dynamicStyles from "./style";
import { getRandomColor, groupTasksByDate, showCustomMessage, Theme } from "utils";
import { AnimatedFAB, Button, Dialog, Divider, FAB, IconButton, MD3Colors, Portal } from "react-native-paper";
import { FlatList } from "react-native";
import moment from "moment";
import { AssignmentFiles, ChoseFileScreen, HeaderDashBoad, ScanFileScreen } from "./Components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getData, LOCAL_URL } from "apis";
import useSWRMutation from "swr/mutation";
import { I18n } from 'i18n';
import ImageView from "react-native-image-viewing";
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CustomerLoader } from "components";
import { SafeAreaView } from "react-native";
import { RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";


function MyAssignmentScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom } = route.params
    const theme = useTheme()
    const user = useCurrentUser();
    const [assignment, setAssignment] = useState<any[]>([])
    const [document, setDocument] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisibleB, setModalVisibleB] = useState(false)
    const [visibleImage, setVisibleImage] = useState(false)
    const [curentScanText, setCurentScanText] = useState<any>();
    const [isExtended, setIsExtended] = useState(true);
    const [refresh, setRefresh] = useState(true);

    const [curentImagesView, setCurentImagesView] = useState([{
        uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
    },
    {
        uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34",
    },
    {
        uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
    },]);
    const [visible, setVisible] = useState(false)
    const styles = dynamicStyles(theme)
    const { trigger: getStudentCoursesID } = useSWRMutation(`${LOCAL_URL}/api/op.admission/search?domain=[('student_id','=',${classRoom?.id})]`, getData)
    const { trigger: checkIfStudentHasSubmitAssigment } = useSWRMutation(`${LOCAL_URL}/api/op.admission/search?domain=[('student_id','=',${classRoom?.id})]`, getData)


    const hideDialog = (v: boolean, doc?: any) => {
        if (doc) {
            setDocument([doc])
        }
        setVisible(v);
    };


    const renderDoc = async (v: boolean, item: any) => {
        setCurentScanText(item)
        setShowModal(v);
    }

    const searchSubmitedAssignment = async (setLoading: (arg0: boolean) => void, item: any) => {
        setLoading(true);
        const response = await getData(`${LOCAL_URL}/api/op.assignment.sub.line/search?domain=[('student_id','=',${classRoom?.id}),('assignment_id','=',${item?.id})]`);
        setLoading(false);
        if (response?.success) {
            return response;
        } else {
            return response;

        }

    }
    const items = [
        { id: '1', type: 'image', uri: 'https://soft.metuaa.com/web/content/1049', name: 'Image 1' },
        { id: '2', type: 'image', uri: 'https://static.fnac-static.com/multimedia/Images/FR/NR/f8/8a/cb/13339384/1541-1/tsp20211119084117/Livres-d-exercices-mathematiques-terminale-specialite-et-maths-expertes.jpg', name: 'Image 1' },
        { id: '6', type: 'file', name: 'Document 1.pdf', uri: 'https://simo.education/pdf2/MTD.pdf' },
        { id: '7', type: 'image', uri: 'https://img.freepik.com/photos-premium/vue-panoramique-plage-contre-ciel_1048944-16126290.jpg?ga=GA1.1.1593920591.1714745952', name: 'Image 2' },
    ];

    const onScroll = ({ nativeEvent }: any) => {
        const currentScrollPosition = Math.floor(nativeEvent.contentOffset.y);
        setIsExtended(currentScrollPosition <= 0);
    };

    const handleButtonPress = (val: boolean, index: number) => {
        if (index === 0) {
            setModalVisible(!modalVisible)
        } else {
            setModalVisibleB(!modalVisibleB)
        }

    }
    useEffect(() => {
        const interval = setInterval(() => {
            setIsExtended(prevState => !prevState);
        }, 3000);

        return () => clearInterval(interval);
    }, [])

    useEffect(() => {
        getStudentAssigment()
    }, [refresh])
    useFocusEffect(
        useCallback(() => {
            setRefresh(true);
            return () => {
            };
        }, [])
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

    const getStudentAssigment = async () => {
        setIsLoading(true)

        try {
            const assigma = await getData(`${LOCAL_URL}/api/assignments/faculty/${user?.id}/${classRoom?.id}`)
            if (!assigma?.success) {
                showCustomMessage("Information", assigma.message, "warning", "bottom")
                return;
            }
            let assigmCorrect: any[] = [];
            const assigms: any[] = assigma?.success ? assigma?.data : []
            assigms?.forEach((item) => {
                console.log(item);
                assigmCorrect.push({
                    id: item.id,
                    tache: item?.name,
                    date: item?.submission_date,
                    name: item?.subject_id.name,
                    lieuRemise: item.room_id.name,
                    description: item?.description,
                    document: item?.document
                })
            })
            const sections1 = Object.entries(groupTasksByDate(assigmCorrect));
            setAssignment(sections1);
            console.log("getStudentAssigment----", assigmCorrect.length);

        } catch (error: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + error.message, "warning", "bottom")

        } finally {
            setIsLoading(false)
            setRefresh(false)
        }
    };
    const handleViewImages = (url: string) => {
        setCurentImagesView([{
            uri: url,
        },])
        setVisibleImage(true)
    }
    return <SafeAreaView style={styles.container}>
        <HeaderDashBoad navigation={navigation} children={classRoom} theme={theme} />
        <Text style={{ textAlign: "center", ...Theme.fontStyle.montserrat.bold, color: theme.primary, paddingVertical: 5 }}>
            {I18n.t("Home.renderWorkHeader")}
        </Text>
        <View style={{ flex: 1, padding: 10, }}>
            <FlatList
                onScroll={onScroll}
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => {
                            setRefresh(true)
                        }}
                    />}
                scrollEventThrottle={16}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 12 }}
                data={assignment}
                renderItem={({ item }) => <TaskItem theme={theme} item={item} hideDialog={hideDialog} children={classRoom} visible={visible} renderDoc={renderDoc} searchSubmitedAssignment={searchSubmitedAssignment} navigation={navigation} />}
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={() => renderEmptyVehiclesElement(I18n.t("Home.renderEmptyAssignment"), isLoading)}
            />
        </View>

        <Portal>
            <Dialog
                visible={visible}
                onDismiss={() => hideDialog(false)}
                style={{ borderRadius: 0, backgroundColor: theme.primaryBackground, height: "97%", width: "90%" }} >
                <Dialog.Content>
                    <TouchableOpacity
                        onPress={() => hideDialog(false)}
                        style={{
                            width: 30, height: 30, alignSelf: "flex-end",
                            alignItems: "center",
                            justifyContent: "center",
                            borderRadius: 30,
                            position: "absolute", top: -15, right: 10, backgroundColor: theme.primaryText,
                            ...Theme.fontStyle.montserrat.bold
                        }} >
                        <MaterialCommunityIcons name="close-circle-outline" size={20} color={theme.secondaryText} />
                    </TouchableOpacity>
                    <AssignmentFiles items={document} handleViewImages={handleViewImages} />
                    <View style={{ flex: 1 }}>
                    </View>
                </Dialog.Content>
            </Dialog>
        </Portal>
        <ImageView
            images={curentImagesView}
            imageIndex={0}
            visible={visibleImage}
            onRequestClose={() => setVisibleImage(false)}
        />
        <AnimatedFAB
            icon="plus"
            label="Ajouter un devoir"
            extended={isExtended}
            onPress={() => navigation.navigate("AddAssignmentScreen", { classRoom })}
            visible={true}
            animateFrom="right"
            iconMode="dynamic"
            color={theme.secondaryText}
            style={styles.fabStyle}

        />

    </SafeAreaView>

}

interface createStylesProps {
    theme: any,
    item: any
    hideDialog?: (b: boolean, doc?: any) => void,
    renderDoc?: (b: boolean, item: any) => void,
    handleButtonPress?: (b: boolean, index: number) => void,
    searchSubmitedAssignment?: (setLoading: any, item: any) => any,
    visible?: boolean
    navigation: any
    children: any
}
export const TaskItem = ({ theme, item: [date, tasks], hideDialog, visible, renderDoc, handleButtonPress, searchSubmitedAssignment, navigation, children }: createStylesProps) => {

    const [assignmentSubmit, setAssignmentSubmit] = useState<any[]>([])
    const [visibleSubmited, setVisibleSubmited] = useState<boolean>(false)
    const [submitNumber, setSubmitNumber] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(true)
    const styles = createStyles(theme);
    const getAssigmentById = async () => {
        setLoading(true)
        try {
            const assigma = await getData(`${LOCAL_URL}/api/assignment/${tasks[0]?.id}`)
            if (!assigma?.success) {
                showCustomMessage("Information", assigma.message, "warning", "bottom")
                return;
            }
            const assigms: any = assigma?.success ? assigma?.data : []
            if (assigms?.id) {
                setSubmitNumber(assigms?.submissions?.length)
            }
            console.log("getAssigmentById----", assigms?.submissions?.length);

        } catch (error: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + error.message, "warning", "bottom")

        } finally {
            setLoading(false)
        }
    };
    useEffect(() => {
        getAssigmentById();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.dateContainer}>
                <Text style={styles.dateText}>{I18n.t("Dashboard.AssignmentsScreen.for_the")}  {moment(date).format('dddd D MMMM YYYY')} </Text>
            </View>
            <View>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={tasks}
                    renderItem={({ item }) => {
                        return <>
                            <View style={styles.taskContainer}>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.colorIndicator} />
                                    <View style={styles.taskDetailsContainer}>
                                        <Text style={styles.subjectText}>{item?.name}</Text>
                                        <Text style={styles.taskText}>{item.tache}</Text>
                                    </View>
                                </View>
                                <View style={styles.statusContainer}>
                                    <Text style={styles.statusText}>
                                        {"Rendu par"}
                                    </Text>
                                    {loading && < ActivityIndicator color={theme.secondary} />}
                                    {
                                        !loading &&
                                        <Text style={styles.statusText1}>
                                            {submitNumber + ""}{" Personnes"}
                                        </Text>
                                    }
                                </View>
                            </View>
                            {item.description &&
                                <Text style={styles.description}>{I18n.t("Dashboard.AssignmentsScreen.descriptionLabel")} <Text style={{ ...Theme.fontStyle.montserrat.regular }}> {item.description}</Text></Text>}
                            {item.description &&
                                <>
                                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                                        <View style={{ flexDirection: "row" }}>
                                        </View>
                                        <Text style={styles.dueText}>  {I18n.t("Dashboard.AssignmentsScreen.dueDateLabel")} {item.lieuRemise}</Text>
                                    </View>
                                    {!visibleSubmited &&
                                        <View style={{ flexDirection: "column", flex: 1, gap: 9 }}>
                                            <Button
                                                mode="text"
                                                style={{ flex: 1 }}
                                                labelStyle={{ color: theme.secondary }}

                                                onPress={() => {
                                                    hideDialog && hideDialog(!visible, item?.document);
                                                }}
                                                icon={"eye"}>
                                                {"Voir les documents du devoirs"}
                                            </Button>
                                            <Button
                                                mode="text"
                                                style={{ flex: 1, }}
                                                labelStyle={{ color: theme.secondary }}
                                                onPress={async () => {

                                                    navigation.navigate("AssignmemtRenderStudentListScreen", { classRoom: children, assignment: item })

                                                }}
                                                icon={"eye"}>
                                                {"Voir les Devoirs rendus par les eleves"}



                                            </Button>
                                        </View>}
                                    {visibleSubmited &&
                                        <FlatList
                                            data={assignmentSubmit}
                                            scrollEnabled={false}
                                            nestedScrollEnabled={false}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item }) => <View>

                                                {item?.document?.map((items: any, index: any) => {
                                                    return <TouchableOpacity
                                                        key={items.id}
                                                        style={styles.itemContainer}
                                                        onPress={() => {
                                                            // navigation.navigate('DocViewer', { file: item.document[0] });
                                                        }}>
                                                        <Text style={styles.iconText}><Icon name="file-pdf-o" size={24} color="#007aff" /></Text>
                                                        <Text style={styles.itemText}>{items.name}</Text>
                                                    </TouchableOpacity>
                                                })}
                                                <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 10 }}>
                                                    <Text style={{
                                                        ...Theme.fontStyle.montserrat.bold
                                                    }}>
                                                        {I18n.t("Dashboard.AssignmentsScreen.statusLabel")}  <Text style={{
                                                            color: item?.state === 'accept' ? theme.primary : theme.primaryText
                                                        }}>
                                                            {item?.state}</Text>
                                                    </Text>
                                                    <Text style={{
                                                        ...Theme.fontStyle.montserrat.semiBold,
                                                        color: theme.primaryText
                                                    }}>{I18n.t("Dashboard.AssignmentsScreen.noteLabel")}  <Text style={{
                                                        color: item?.marks >= 10 ? theme.primary : "red",

                                                    }}>{item?.marks}/20</Text></Text>
                                                </View>

                                            </View>
                                            }
                                            ListHeaderComponent={() =>
                                                <View>
                                                    <Text style={{ color: theme.primary, ...Theme.fontStyle.montserrat.semiBold }}>
                                                        {I18n.t("Dashboard.AssignmentsScreen.alreadySubmittedHeader")}
                                                    </Text>
                                                </View>
                                            }
                                        />}
                                </>
                            }
                            <Text style={styles.dueText}></Text>

                            <Divider style={{ borderColor: "red" }} />
                        </>
                    }
                    }
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    );
};





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
export default MyAssignmentScreen;

