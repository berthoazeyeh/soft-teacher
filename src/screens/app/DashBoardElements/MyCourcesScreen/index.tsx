import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useCurrentUser, useTheme } from "store";
import dynamicStyles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
import { FlatList } from "react-native";
import { getRandomColor, showCustomMessage, Theme } from "utils";
import { CustomDatePickerForm } from "components";
import { Divider } from "react-native-paper";
import useSWRMutation from "swr/mutation";
import { getData, LOCAL_URL } from "apis";
import { RefreshControl } from "react-native";


function MyCourcesScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom, nexScreen } = route.params
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [subjects, setSubject] = useState<any[]>(classRoom?.subjects ?? []);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const styles = dynamicStyles(theme)
    const user = useCurrentUser();
    const { trigger: getTeacherSubjectInClassRoome } = useSWRMutation(`${LOCAL_URL}/api/subjects/faculty/${user?.id}/${classRoom?.id}`, getData)
    // console.log(classRoom);

    useEffect(() => {
        // getTeacherSubjectInClassRoom();
    }, [refresh])
    const getTeacherSubjectInClassRoom = async () => {
        try {
            setIsLoading(true);
            const classe = await getTeacherSubjectInClassRoome();
            if (classe?.success) {
                const data: any[] = classe?.success ? classe?.data : []
                if (classRoom.isSecondary && classRoom?.subjects?.length > 0) {
                    setSubject(classRoom?.subjects);
                } else {
                    setSubject(data ?? []);

                }
                console.log("getTeacherClassRoom------size-------", data.length);

            } else {
                showCustomMessage("Information", classe.message, "warning", "bottom")
            }
        } catch (err: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + err.message, "warning", "bottom")
            console.error('Une erreur s\'est produite :', err);
        } finally {
            setIsLoading(false);
            setRefresh(false);
        }

    };


    const renderEmptyElement = () => (
        <View style={styles.emptyData}>
            {isLoading &&
                <ActivityIndicator color={theme.primary} size={25} />}

            {!isLoading &&
                <Text style={styles.emptyDataText}>{"Aucun cours present."}</Text>}
        </View>
    );


    return <View style={styles.container}>
        <TouchableOpacity style={{ paddingHorizontal: 10, flexDirection: "row", gap: 30, alignItems: "center" }}
            onPress={() => {
                navigation.goBack()
            }}
        >
            <MaterialCommunityIcons name='arrow-left' size={25} color={theme.primaryText} />
            <Text style={{ ...Theme.fontStyle.inter.semiBold, fontSize: 18, color: theme.primary }}>{classRoom.name} ({subjects.length})</Text>
        </TouchableOpacity>
        <Divider />

        {nexScreen && <View style={{ paddingHorizontal: 10, alignItems: "center", backgroundColor: theme.primaryText, paddingVertical: 10, }}        >
            <Text style={{ ...Theme.fontStyle.inter.semiBold, fontSize: 28, color: theme.secondaryText, textAlign: "center" }}>
                {"Choisissez un cours"}
            </Text>
        </View>}


        <FlatList
            data={subjects}
            refreshControl={
                <RefreshControl
                    refreshing={refresh}
                    onRefresh={() => {
                        setRefresh(true)
                    }}
                />}
            renderItem={({ item, index }) =>
                <View
                    // onPress={() => {
                    //     if (nexScreen) {
                    //         navigation.navigate(nexScreen, { classRoom: classRoom, subject: item })
                    //     }
                    // }}
                    style={{ flexDirection: "row", marginBottom: 20, gap: 20, paddingHorizontal: 20, }}>
                    <View style={{ width: 10, backgroundColor: getRandomColor(), height: 50, }} />
                    <View style={{ justifyContent: "space-around" }}>
                        <Text style={{ ...Theme.fontStyle.inter.semiBold, fontSize: 16, color: theme.primaryText }}>{item.name}</Text>
                    </View>
                </View>

            }
            contentContainerStyle={{ paddingVertical: 10, }}
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={renderEmptyElement}
        />

    </View>

}


export default MyCourcesScreen;