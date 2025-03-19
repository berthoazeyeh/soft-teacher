import { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Image } from "react-native";
import { useTheme } from "store";
import dynamicStyles from "./styles";
import { TouchableOpacity } from "react-native";
import { Divider, Searchbar } from "react-native-paper";
import { groupTasksByDate, profils, showCustomMessage, Theme } from "utils";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator } from "react-native";
import { Easing } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import moment from "moment";
import { getData, LOCAL_URL } from "apis";
import { I18n } from 'i18n';
import React from "react";



function AssignmemtRenderStudentListScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom, assignment } = route.params
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [assignments, setAssignments] = useState<any>(null)
    const styles = dynamicStyles(theme)
    const [studentList, setStudentList] = useState<any[]>([])
    const [filteredData, setFilteredData] = useState<any[]>([])
    useEffect(() => {
        getAssigmentById()
    }, [refresh])

    const getAssigmentById = async () => {
        setIsLoading(true)
        try {
            const assigma = await getData(`${LOCAL_URL}/api/assignment/${assignment?.id}`)
            if (!assigma?.success) {
                showCustomMessage("Information", assigma.message, "warning", "bottom")
                return;
            }
            const assigms: any = assigma?.success ? assigma?.data : []
            if (assigms?.id) {
                setAssignments(assigms);
                setStudentList(assigms?.submissions)
            }
            console.log("getAssigmentById----", assigms?.submissions?.length);

        } catch (error: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + error.message, "warning", "bottom")

        } finally {
            setIsLoading(false)
            setRefresh(false)
        }
    };
    const headerHeight = useRef(new Animated.Value(80)).current;

    const showHeader = () => {
        Animated.timing(headerHeight, {
            toValue: 80, // Full height of the header
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false, // height doesn't support native driver
        }).start();
    };

    const hideHeader = () => {
        Animated.timing(headerHeight, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    };


    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = studentList.filter(item =>
            item?.student?.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filtered);
    };

    useEffect(() => {
        onChangeSearch("")
    }, [studentList]);
    const renderEmptyElement = () => (
        <View style={styles.emptyData}>
            {isLoading &&
                <>
                    <ActivityIndicator color={theme.primary} size={25} />
                    <Text style={styles.emptyDataText}>{I18n.t("Home.loading")}</Text>
                </>}
            {!isLoading &&
                <Text style={styles.emptyDataText}>{"Aucun élève n'a rendu le devoir ."}</Text>}
        </View>
    );


    return <View style={styles.container}>
        <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 10, flexDirection: "row", gap: 30, alignItems: "center", justifyContent: "space-between" }}
        >
            <MaterialCommunityIcons name='arrow-left' size={25} color={theme.primaryText} onPress={() => {
                navigation.goBack()
            }} />
            <Text style={{ ...Theme.fontStyle.inter.semiBold, fontSize: 20, color: theme.primary }}>{""}</Text>
            <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={() => {
                    setShowSearch(true)
                    showHeader()
                }}
            >
                <MaterialCommunityIcons name='account-search' size={30} color={theme.primaryText} />
            </TouchableOpacity>
        </TouchableOpacity>
        <Divider />
        {showSearch && <Animated.View style={[styles.header, { height: headerHeight }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15 }}>
                <Searchbar
                    placeholder="Search"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    right={() =>
                        <TouchableOpacity
                            style={{ marginRight: 10 }}
                            onPress={() => {
                                hideHeader()
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
        </Animated.View>}
        <View style={styles.content}>
            <FlatList
                data={filteredData}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                renderItem={({ item, index }) =>
                    <TouchableOpacity
                        onPress={() => {
                            // console.log(item);

                            navigation.navigate("SeeAndMarkStudentAsignmemtScreen", { classRoom: classRoom, student: item, assignment: assignment })
                        }}
                        style={{ flexDirection: "row", marginBottom: 15, gap: 10, paddingHorizontal: 0, borderBottomWidth: 1, borderBottomColor: theme.gray, paddingBottom: 10, alignItems: "center" }}>
                        <View style={{ width: 50, height: 50, borderRadius: 60, backgroundColor: theme.gray, padding: 2, borderColor: theme.gray4, borderWidth: 1 }}>
                            <Image source={profils} style={{ width: "100%", height: "100%", borderRadius: 50, }} />
                        </View >
                        <View style={{ justifyContent: "space-around", flex: 1, gap: 5, alignContent: "center", }}>
                            <View style={{ justifyContent: "space-between", flexDirection: "row", gap: 5, alignContent: "center", }}>
                                <Text style={{ ...Theme.fontStyle.inter.semiBold, fontSize: 14, color: theme.primaryText, flex: 1 }}>{item?.student?.name}</Text>
                                <MaterialCommunityIcons name={item?.state === "accept" ? "eye-check-outline" : "eye-remove-outline"} size={25} color={item?.state === "accept" ? theme.primary : theme.primaryText} />
                            </View>
                            <Text style={{ ...Theme.fontStyle.inter.regular, fontSize: 12, color: theme.primaryText }}> {I18n.t("SeeAndMarkStudentAsignmemtScreen.submittedOn")} <Text style={{ ...Theme.fontStyle.inter.semiBold }}> {moment(item.submission_date).format("LLLL")}</Text></Text>
                        </View>
                    </TouchableOpacity>
                }
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={renderEmptyElement}
            />
        </View>

    </View>

}

export default AssignmemtRenderStudentListScreen;