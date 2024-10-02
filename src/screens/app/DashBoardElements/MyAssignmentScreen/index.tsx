import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from "react-native";
import { isDarkMode, useTheme } from "store";
import dynamicStyles from "./style";
import { getRandomColor, groupTasksByDate, Theme } from "utils";
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


function MyAssignmentScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { children } = route.params
    const theme = useTheme()
    const [assignment, setAssignment] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalVisibleB, setModalVisibleB] = useState(false)
    const [visibleImage, setVisibleImage] = useState(false)
    const [curentScanText, setCurentScanText] = useState<any>();
    const [isExtended, setIsExtended] = useState(true);

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
    const { trigger: getStudentCoursesID } = useSWRMutation(`${LOCAL_URL}/api/op.admission/search?domain=[('student_id','=',${children?.id})]`, getData)
    const { trigger: checkIfStudentHasSubmitAssigment } = useSWRMutation(`${LOCAL_URL}/api/op.admission/search?domain=[('student_id','=',${children?.id})]`, getData)
    const hideDialog = (v: boolean) => setVisible(v);
    const renderDoc = async (v: boolean, item: any) => {
        setCurentScanText(item)
        setShowModal(v);
    }

    const searchSubmitedAssignment = async (setLoading: (arg0: boolean) => void, item: any) => {
        setLoading(true);
        const response = await getData(`${LOCAL_URL}/api/op.assignment.sub.line/search?domain=[('student_id','=',${children?.id}),('assignment_id','=',${item?.id})]`);
        setLoading(false);
        if (response?.success) {
            return response;
        } else {
            return response;

        }

    }
    const items = [
        { id: '1', type: 'image', uri: 'https://www.fomesoutra.com/joomlatools-files/docman-images/generated/0ea6f098a59fcf2462afc50d130ff034.jpg', name: 'Image 1' },
        { id: '2', type: 'image', uri: 'https://static.fnac-static.com/multimedia/Images/FR/NR/f8/8a/cb/13339384/1541-1/tsp20211119084117/Livres-d-exercices-mathematiques-terminale-specialite-et-maths-expertes.jpg', name: 'Image 1' },
        { id: '6', type: 'file', name: 'Document 1.pdf', uri: 'https://simo.education/pdf2/MTD.pdf' },
        { id: '7', type: 'image', uri: 'https://img.freepik.com/photos-premium/vue-panoramique-plage-contre-ciel_1048944-16126290.jpg?ga=GA1.1.1593920591.1714745952', name: 'Image 2' },
    ];

    const onScroll = ({ nativeEvent }: any) => {
        const currentScrollPosition = Math.floor(nativeEvent.contentOffset.y);
        setIsExtended(currentScrollPosition <= 0); // Show FAB when at the top
    };

    const handleButtonPress = (val: boolean, index: number) => {
        if (index === 0) {
            setModalVisible(!modalVisible)
        } else {
            setModalVisibleB(!modalVisibleB)
        }

    }
    useEffect(() => {
        getStudentAssigment()
        const interval = setInterval(() => {
            setIsExtended(prevState => !prevState);
        }, 3000);

        return () => clearInterval(interval);
    }, [])
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

        const assigma = await getData(`${LOCAL_URL}/api/op.assignment/search`)
        console.log("assigma-----", assigma);

        let assigmCorrect: any[] = [];
        const assigms: any[] = assigma?.success ? assigma?.data : []
        assigms?.forEach((item) => {

            assigmCorrect.push({
                id: item.id,
                name: "Chimie",
                date: item?.submission_date,
                tache: "item?.name",
                status: true,
                lieuRemise: "Salle de cours",
                description: item?.description
            })
        })
        const sections1 = Object.entries(groupTasksByDate(assigmCorrect));
        setAssignment(sections1);
        console.log("getStudentAssigment----", assigmCorrect.length);
        setIsLoading(false)
        // } else {
        //     setIsLoading(false)
        // }
    };
    const handleViewImages = (url: string) => {
        setCurentImagesView([{
            uri: url,
        },])
        setVisibleImage(true)
    }
    return <SafeAreaView style={styles.container}>
        <HeaderDashBoad navigation={navigation} children={children} theme={theme} />
        <Text style={{ textAlign: "center", ...Theme.fontStyle.montserrat.bold, color: theme.primary, paddingVertical: 5 }}>
            {I18n.t("Home.renderWorkHeader")}
        </Text>
        <FlatList
            onScroll={onScroll}
            scrollEventThrottle={16}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={assignment}
            renderItem={({ item }) => <TaskItem theme={theme} item={item} hideDialog={hideDialog} children={children} visible={visible} renderDoc={renderDoc} searchSubmitedAssignment={searchSubmitedAssignment} navigation={navigation} />}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={() => renderEmptyVehiclesElement(I18n.t("Home.renderEmptyAssignment"), isLoading)}
        />

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
                    <AssignmentFiles items={items} handleViewImages={handleViewImages} />
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
                        <Text style={styles.titleBottonSheet}>Rendre le devoir de mon enfant</Text>
                        <Divider style={{ width: "50%" }} />
                        <Button
                            mode="contained-tonal"
                            style={{ flex: 1, marginVertical: 20, width: "100%" }}
                            onPress={() => handleButtonPress && handleButtonPress(!visible, 1)}
                            icon={"eye"}>
                            Scanner le devoirs
                        </Button>
                        <Button
                            mode="contained-tonal"
                            style={{ flex: 1, backgroundColor: theme.primary, width: "100%" }}
                            labelStyle={{ color: theme.secondaryText }}
                            onPress={() => handleButtonPress && handleButtonPress(!visible, 0)}
                            icon={"file"}>
                            Telecharger depuis mon appariel
                        </Button>
                    </View>
                </ScrollView>
            </View>
        </Modal>
        <Modal
            //@ts-ignore 
            animationType="slide" // Animation pour afficher la modal
            transparent={false} // Rend la modal transparente
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
            style={styles.modalContent}>
            {/* //@ts-ignore */}
            <TouchableOpacity onPress={() => setModalVisible(false)} //@ts-ignore 
                style={styles.closeButtons}>
                <Icon name="times" size={20} color="black" />
            </TouchableOpacity>
            <ChoseFileScreen
                name={curentScanText}
                setLoading={setIsLoading}
                loading={isLoading}
                closeModal={() => setModalVisible(false)}
                children={children}
            />

        </Modal>
        <Modal
            //@ts-ignore 
            animationType="slide" // Animation pour afficher la modal
            transparent={false} // Rend la modal transparente
            visible={modalVisibleB}
            onRequestClose={() => setModalVisibleB(false)}
            style={styles.modalContent}>
            {/* //@ts-ignore */}
            <TouchableOpacity onPress={() => setModalVisibleB(false)} //@ts-ignore 
                style={styles.closeButtons}>
                <Icon name="times" size={20} color="black" />
            </TouchableOpacity>
            <ScanFileScreen
                name={curentScanText}
                setLoading={setIsLoading}
                closeModal={() => setModalVisibleB(false)}
            />
        </Modal>
        {/* <CustomerLoader loading={isLoading} I18n={I18n} theme={theme} color='red' /> */}

        <AnimatedFAB
            icon="plus"
            label="Ajouter un devoir"
            extended={isExtended}
            onPress={() => navigation.navigate("AddAssignmentScreen", { children })}
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
    hideDialog?: (b: boolean) => void,
    renderDoc?: (b: boolean, item: any) => void,
    handleButtonPress?: (b: boolean, index: number) => void,
    searchSubmitedAssignment?: (setLoading: any, item: any) => any,
    visible?: boolean
    navigation: any
    children: any
}
export const TaskItem = ({ theme, item: [date, tasks], hideDialog, visible, renderDoc, handleButtonPress, searchSubmitedAssignment, navigation, children }: createStylesProps) => {

    const [assignmentSubmit, setAssignmentSubmit] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [visibleSubmited, setVisibleSubmited] = useState<boolean>(false)
    const styles = createStyles(theme);

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
                    renderItem={({ item }) => <>
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
                                <Text style={styles.statusText1}>
                                    {"13 Personnes"}
                                </Text>
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

                                            onPress={() => hideDialog && hideDialog(!visible)}
                                            icon={"eye"}>
                                            {"Voir les Devoirs"}
                                        </Button>
                                        <Button
                                            mode="text"
                                            style={{ flex: 1, }}
                                            labelStyle={{ color: theme.secondary }}
                                            onPress={async () => {
                                                // const res = searchSubmitedAssignment && await searchSubmitedAssignment(setLoading, item)
                                                // if (res?.success && res?.data.length > 0) {
                                                //     setAssignmentSubmit(res?.data)
                                                //     setVisibleSubmited(true)
                                                // } else {
                                                //     renderDoc && renderDoc(!visible, item)
                                                // }
                                                navigation.navigate("AddAssignmentScreen", { children })

                                            }}
                                            icon={loading ? undefined : "eye"}>
                                            {loading ?
                                                <ActivityIndicator color={theme.secondary} />
                                                : "Voir les Devoirs rendus par les eleves"
                                            }


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

                        <Divider />
                    </>
                    }
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </View>
    );
};





export const TaskItemTimeTable = ({ theme, item: [date, tasks] }: createStylesProps) => {
    const styles = createStyles(theme);
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
                    renderItem={({ item }) => <>
                        <View style={[styles.taskContainer, { marginBottom: 10 }]}>
                            <View style={{ flex: 1 }}>
                                <View style={styles.colorIndicator} />
                                <View style={styles.taskDetailsContainer}>
                                    <Text style={styles.subjectText}>{item?.subject?.name}</Text>
                                    <Text style={styles.taskText}>Mr. {item.tache ? item.tache : "  ..."}</Text>
                                </View>
                            </View>
                            {/* subject */}
                            <View style={[styles.statusContainer, { backgroundColor: theme.gray3, gap: 5, alignItems: "center" }]}>
                                <Text style={
                                    styles.statusText}>
                                    {moment(item.start_datetime).format('HH : mm')}
                                </Text>
                                <MaterialCommunityIcons name="arrow-up-down" size={10} />
                                <Text style={
                                    styles.statusText}>
                                    {moment(item.end_datetime).format('HH : mm')}
                                </Text>
                            </View>
                        </View>
                        <Divider />
                    </>
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

