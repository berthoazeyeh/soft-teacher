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


function AddAssignmentScreen(props: any): React.JSX.Element {
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
    console.log(children);

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





        <AnimatedFAB
            icon="plus"
            label="Ajouter un devoir"
            extended={isExtended}
            onPress={() => console.log('Pressed')}
            visible={true}
            animateFrom="right"
            iconMode="dynamic"
            color={theme.secondaryText}
            style={styles.fabStyle}

        />
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

