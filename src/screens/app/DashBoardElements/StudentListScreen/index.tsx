import { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Image } from "react-native";
import { useTheme } from "store";
import dynamicStyles from "./styles";
import { TouchableOpacity } from "react-native";
import { Divider, Searchbar } from "react-native-paper";
import { profils, showCustomMessage, Theme } from "utils";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ActivityIndicator } from "react-native";
import { Easing } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { getData, LOCAL_URL } from "apis";
import { RefreshControl } from "react-native";


function StudentListScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom } = route.params
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [refresh, setRefresh] = useState(false)
    const styles = dynamicStyles(theme)
    const [studentList, setStudentList] = useState<any[]>([])
    const [filteredData, setFilteredData] = useState<any[]>([])

    useEffect(() => {
        getClassRoomStudent()
        onChangeSearch("");
    }, [refresh])

    useEffect(() => {
        onChangeSearch("");
    }, [studentList])

    const getClassRoomStudent = async () => {
        setIsLoading(true)
        try {
            const assigma = await getData(`${LOCAL_URL}/api/students/room/${classRoom?.id}`)
            if (!assigma?.success) {
                showCustomMessage("Information", assigma?.message, "warning", "bottom")
                return;
            }
            let assigmCorrect: any[] = [];
            const assigms: any[] = assigma?.success ? assigma?.data : []
            assigms?.forEach((item) => {
                let name = ""
                if (item.first_name) name = name + item.first_name + " "
                if (item.middle_name) name = name + item.middle_name + " "
                if (item.last_name) name = name + item.last_name
                assigmCorrect.push({
                    ...item,
                    name: name,
                })
            })
            setStudentList(assigmCorrect);
            console.log("getClassRoomStudent----", assigmCorrect);

        } catch (error: any) {
            console.log('Une erreur s\'est produite :', error.message);

            showCustomMessage("Information", 'Une erreur s\'est produite :' + error?.message, "warning", "bottom")

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
            toValue: 0, // Hide the header by reducing its height
            duration: 400,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    };
    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = studentList.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filtered);
    };

    useEffect(() => {
        onChangeSearch("")
    }, []);
    const renderEmptyElement = () => (
        <View style={styles.emptyData}>
            {isLoading &&
                <ActivityIndicator color={theme.primary} size={25} />}
            {!isLoading &&
                <Text style={styles.emptyDataText}>{"Aucun cours present."}</Text>}
        </View>
    );


    return <View style={styles.container}>
        <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 10, flexDirection: "row", gap: 30, alignItems: "center", justifyContent: "space-between" }}
            onPress={() => {
                navigation.goBack()
            }}>
            <MaterialCommunityIcons name='arrow-left' size={25} color={theme.primaryText} />
            <Text style={{ ...Theme.fontStyle.montserrat.semiBold, fontSize: 22, color: theme.primary }}>{"Mes élèves"}</Text>
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
                refreshControl={
                    <RefreshControl
                        refreshing={refresh}
                        onRefresh={() => {
                            setRefresh(true)
                        }}
                    />}
                renderItem={({ item, index }) =>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate("StudentDetailsScreen", { classRoom: classRoom, student: item })
                        }}
                        style={{ flexDirection: "row", marginBottom: 15, gap: 20, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: theme.gray, paddingBottom: 10, alignItems: "center" }}>
                        <View style={{ width: 50, height: 50, borderRadius: 60, backgroundColor: theme.gray, padding: 2, borderColor: theme.gray4, borderWidth: 1 }}>
                            <Image source={{ uri: item?.avatar }} style={{ width: "100%", height: "100%", borderRadius: 50, }} />
                        </View >
                        <View style={{ justifyContent: "space-between", flex: 1, gap: 5, alignContent: "center", }}>
                            <Text style={{ ...Theme.fontStyle.montserrat.semiBold, fontSize: 20, color: theme.primaryText }}>{item.name}</Text>
                        </View>
                    </TouchableOpacity>

                }
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={renderEmptyElement}
            />
        </View>

    </View>

}

export default StudentListScreen;