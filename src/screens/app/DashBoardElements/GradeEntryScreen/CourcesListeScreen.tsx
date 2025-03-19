import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { selectLanguageValue, useCurrentUser, useTheme } from "store";
import dynamicStyles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
import { FlatList } from "react-native";
import { getRandomColor, showCustomMessage, Theme } from "utils";
import { CustomDatePickerForm } from "components";
import { Divider } from "react-native-paper";
import useSWRMutation from "swr/mutation";
import { getCorrectDateFormat, getData, LOCAL_URL } from "apis";
import { RefreshControl } from "react-native";
import { useSelector } from "react-redux";


function CourcesListeScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom } = route.params
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [rescan, setRescan] = useState(false);
    const [subjects, setSubject] = useState<any[]>([]);
    const [selectedDate, setSelectedDate] = useState<any>(new Date());
    const styles = dynamicStyles(theme)
    const user = useCurrentUser();
    const language = useSelector(selectLanguageValue);

    moment.locale("en");
    const { trigger: getTeacherSubjectInClassRoome } = useSWRMutation(`${LOCAL_URL}/api/timesheet/faculty/${user?.id}/${classRoom.id}?day=${moment(selectedDate).format("YYYY-MM-DD")}`, getData)
    // moment.locale(language);


    const getTeacherTimeTables = async () => {
        setSubject([]);
        try {
            setIsLoading(true);
            const res = await getTeacherSubjectInClassRoome();
            if (res?.success) {
                const timetable: any[] = res?.success ? res?.data : []
                setSubject(timetable);
                console.log(res);

            } else {
                showCustomMessage("Information", res.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoading(false);
            setRefresh(false);
        }

    };
    useEffect(() => {
        getTeacherTimeTables()
    }, [rescan])




    const renderEmptyElement = () => (
        <View style={styles.emptyData}>
            {isLoading &&
                <ActivityIndicator color={theme.primary} size={25} />}

            {!isLoading &&
                <Text style={styles.emptyDataText}>{"Aucun cours present."}</Text>}
        </View>
    );
    const incrementDate = () => {
        setSelectedDate((prevDate: any) => moment(prevDate).add(1, 'days'));
        setRescan(!rescan)
    };

    const decrementDate = () => {
        setSelectedDate((prevDate: any) => moment(prevDate).subtract(1, 'days'));
        setRescan(!rescan)

    };


    return <View style={styles.container}>
        <TouchableOpacity style={{ paddingHorizontal: 10, flexDirection: "row", gap: 30, alignItems: "center" }}
            onPress={() => {
                navigation.goBack()
            }}
        >
            <MaterialCommunityIcons name='arrow-left' size={25} color={theme.primaryText} />
            <Text style={{ ...Theme.fontStyle.inter.semiBold, fontSize: 28, color: theme.primary }}>{classRoom.name}</Text>
        </TouchableOpacity>
        <Divider />
        <View style={styles.headerTimeConatiner}>
            <TouchableOpacity onPress={decrementDate}>
                <MaterialCommunityIcons name='chevron-left-circle' size={25} color={theme.primaryText} />
            </TouchableOpacity>

            <CustomDatePickerForm
                date={selectedDate}
                onDateChange={setSelectedDate}
                theme={theme}
            />

            <TouchableOpacity onPress={incrementDate}>
                <MaterialCommunityIcons name='chevron-right-circle' size={25} color={theme.primaryText} />
            </TouchableOpacity>
        </View>

        <FlatList
            data={subjects}
            contentContainerStyle={styles.content}
            refreshControl={
                <RefreshControl
                    refreshing={refresh}
                    onRefresh={() => {
                        setRefresh(true)
                    }}
                />}
            renderItem={({ item, index }) =>
                <View >
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("MyAbsencesScreen", { classRoom: classRoom, subject: item })
                        }}
                        style={{ flexDirection: "row", alignItems: "center", gap: 20, paddingHorizontal: 20, width: "100%" }}>
                        <View style={{ justifyContent: "space-around", gap: 30 }}>
                            <Text style={{ ...Theme.fontStyle.inter.semiBold, fontSize: 18, color: theme.primaryText }}>{moment(item?.start_datetime).format("HH:mm")}</Text>
                            <Text style={{ ...Theme.fontStyle.inter.semiBold, fontSize: 18, color: theme.primaryText }}>{moment(item?.end_datetime).format("HH:mm")}</Text>
                        </View >

                        <View style={{ width: 10, backgroundColor: getRandomColor(), height: "100%", }} />

                        <View style={{ justifyContent: "space-around", flex: 1, }}>
                            <Text style={{ ...Theme.fontStyle.inter.semiBold, fontSize: 25, color: theme.primaryText, }}>{item?.subject_id?.name}</Text>
                            <Text>{classRoom.name}</Text>
                            {item.attendance_sheet &&
                                <MaterialCommunityIcons name='check-circle' size={25} color={theme.primary} />
                            }
                            {!item.attendance_sheet &&
                                <MaterialCommunityIcons name='check-circle' size={25} color={"red"} />
                            }

                        </View>
                    </TouchableOpacity>
                    <Divider style={{ width: "100%", marginVertical: 20 }}></Divider>
                </View >
            }
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={renderEmptyElement}
        />

    </View>

}

export default CourcesListeScreen;