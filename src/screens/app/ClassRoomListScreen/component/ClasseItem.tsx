import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import dynamicStyles from "../styles";
import { useTheme } from "store";
import { bus, getRandomColor, profils, Theme } from "utils";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { I18n } from 'i18n';
import { Divider } from "react-native-paper";
import moment from "moment";
import React from "react";

export const ClasseItem = ({ item, I18n, index, navigation, isSelected }: any): React.JSX.Element => {
    const theme = useTheme()
    const styles = dynamicStyles(theme, isSelected)

    const handleGotoLive = (item: any) => {
        navigation.navigate("DashBoardScreen", {
            clasRoom: item
        });
    };
    function capitalizeFirstLetter(text: string) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    return <View style={styles.itemContainer}>
        <View style={styles.etiquettesItem}>
            <Text style={styles.etiquettesItemText}>{index + 1}</Text>
        </View>
        <View style={styles.etiquettesItem2}>
            <Text style={styles.etiquettesItemText2}>{capitalizeFirstLetter(item.branch?.name)}</Text>
        </View>
        <TouchableOpacity onPress={() => handleGotoLive(item)}>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 20, }}>
                <View
                    style={{
                        width: 40,
                        height: 40,
                        borderRadius: 50,
                        backgroundColor: getRandomColor(),
                        borderColor: theme.gray2,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Text style={{ color: theme.secondaryText, fontSize: 25 }}>#</Text>
                </View>
                <Text style={styles.title}>{item.name} </Text>
            </View>
            <View style={{ gap: 5, flex: 1, alignItems: "center" }}>
                <View style={styles.containerWrap}>
                    <Text style={{ color: theme.primaryText, ...Theme.fontStyle.inter.semiBold }}>{I18n.t("Home.course")}:</Text>
                    {item?.subjects?.slice(0, 3)?.map((item: any, index: number) => <View key={index} style={styles.item}>
                        <Text style={{ color: theme.primaryText, ...Theme.fontStyle.inter.regular, fontSize: 10 }}>{item.name} </Text>
                    </View>
                    )}
                    <View key={index} style={styles.item}>
                        <MaterialCommunityIcons name='dots-horizontal' size={15} color={theme.primaryText} />
                    </View>
                </View>

            </View>


        </TouchableOpacity>

    </View>
}
interface createStylesProps {
    theme: any,
    item: any
    hideDialog?: (b: boolean) => void,
    renderDoc?: (b: boolean, item: any) => void,
    handleButtonPress?: (b: boolean, index: number) => void,
    searchSubmitedAssignment?: (setLoading: any, item: any) => any,
    visible?: boolean
}
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
                                    <Text style={styles.subjectText}>{item?.subject_id?.name}</Text>
                                    <Text style={styles.taskText}>Mr. {item.name?.split(":")?.[0]}</Text>
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
        borderTopEndRadius: 10,
    },
    statusText: {
        ...Theme.fontStyle.inter.semiBold,
        color: theme.primaryText,
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


