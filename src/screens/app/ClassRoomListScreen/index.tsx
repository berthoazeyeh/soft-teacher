import dynamicStyles from "./styles";
import { Easing, FlatList } from "react-native";
import { ClasseItem } from "./component/ClasseItem";
import { useEffect, useLayoutEffect, useRef, useState, } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { I18n } from 'i18n';
import { clearUserStored, selectLanguageValue, useCurrentUser, useTheme } from 'store';
import { Image } from 'react-native';
import { groupByDay, ImageE1, showCustomMessage, Theme } from 'utils';
import { Divider, ProgressBar, Searchbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch, useSelector } from 'react-redux';
import { getData, LOCAL_URL } from 'apis';
import useSWR from 'swr';
import { Eleve } from 'models';
import moment from 'moment';
import useSWRMutation from 'swr/mutation';
import 'moment/locale/fr';
import { Animated } from "react-native";
import { getClassrooms, syncAllClassrooms } from "services";
import { db } from "apis/database";

function ClassRoomListScreen(props: any): React.JSX.Element {
    const { navigation } = props;
    const theme = useTheme()
    const styles = dynamicStyles(theme, false)
    const user = useCurrentUser();
    const dispatch = useDispatch()
    const [selectedClasse, setSelectedClasse] = useState<Eleve>()
    const [classRoom, setClassRoom] = useState<any[]>([])
    const [secondaryClassRoom, setSecondaryClassRoom] = useState<any[]>([])
    const [refresh, setRefresh] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [isLocalLoading, setIsLocalLoading] = useState(false)

    const [filteredData, setFilteredData] = useState<any[]>([])
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'All ClassRoom List',
            headerRight: () => <TouchableOpacity
                onPress={() => {
                    showHeader()
                }}
                style={{ marginRight: 10, }}
            >
                <MaterialCommunityIcons name='account-search' size={30} color={theme.primaryText} />

            </TouchableOpacity>,
        });
    }, []);
    const { trigger: getTeacherClassRoome, error, isMutating: isLoading } = useSWRMutation(`${LOCAL_URL}/api/rooms/faculty/${user?.id}`, getData)
    async function fetchClassrooms() {
        try {
            setIsLocalLoading(true)
            const response = await getClassrooms(db, false, user?.id);
            const response1 = await getClassrooms(db, true, user?.id);

            if (response.success) {
                if (response.data) {
                    setClassRoom([...response.data, ...(response1?.data ?? [])]);

                }
            } else {
                console.error("Erreur :", response.error);
            }
            if (response1.success) {
                if (response1.data) {
                    setSecondaryClassRoom(response1.data);
                }
            } else {
                console.error("Erreur :", response1.error);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération :", error);
        } finally {
            setIsLocalLoading(false)

        }
    }


    useEffect(() => {
        fetchClassrooms();
        getTeacherClassRoom();
        setTimeout(() => {
            setRefresh(false);
        }, 3000);
    }, [selectedClasse, refresh])
    useEffect(() => {
        hideHeader();
    }, [])

    const headerHeight = useRef(new Animated.Value(60)).current;
    const showHeader = () => {
        Animated.timing(headerHeight, {
            toValue: 60,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    };

    const hideHeader = () => {
        Animated.timing(headerHeight, {
            toValue: 0,
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    };



    const getTeacherClassRoom = async () => {
        try {
            const classe = await getTeacherClassRoome();
            if (classe?.success) {
                const assigms: any = classe?.success ? classe?.data : {}
                syncClassrooms(assigms?.rooms, assigms?.diffuser_rooms)
                // setClassRoom(assigms?.rooms);
                // setSecondaryClassRoom(assigms?.diffuser_rooms)
                // console.log("getTeacherClassRoom------size-------", assigms?.rooms[0]);
            } else {
            }
        } catch (error) {

        }
    };
    function syncClassrooms(data1: any[], data2: any[]) {
        syncAllClassrooms(data1, db, false, user?.id)
            .then(result => {
                console.log("Sync successful:------rooms", result);
                fetchClassrooms();
            })
            .catch(error => console.error("Sync failed:", error));
        syncAllClassrooms(data2, db, true, user?.id)
            .then(result => {
                console.log("Sync successful:-----diffuser_rooms.", result);
                fetchClassrooms();
            })
            .catch(error => console.error("Sync failed:", error));

    }

    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = [...classRoom, ...secondaryClassRoom]?.filter((item: any) =>
            item?.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filtered);
    };


    const renderHeader = (text: string, count: number) => (
        <View
            style={styles.logo}>
            <TouchableOpacity
                style={styles.TitleContainer}>
                <Text style={styles.fieldText}>{text} ({count})</Text>
            </TouchableOpacity>
            <Divider />


        </View>
    );


    const handlePresseLiveTrakingButton = (item: any) => {
        navigation.navigate('StudentActivitieScreen', {
            children: item
        })
    }
    const renderEmptyStudentElement = () => (

        <View style={styles.emptyData}>
            {(isLocalLoading) &&
                <ActivityIndicator color={theme.primary} size={25} />}
            {error &&
                <Text style={styles.emptyDataText}>{error?.message}</Text>}
            {!error &&
                <Text style={styles.emptyDataText}>{I18n.t("Home.notstudentFound")}</Text>}
        </View>
    );
    return <View>
        <ScrollView
            scrollEventThrottle={16}
            refreshControl={
                <RefreshControl
                    refreshing={refresh}
                    onRefresh={() => {
                        setRefresh(true)
                    }}
                />}>

            <Animated.View style={[styles.header, { height: headerHeight }]}>
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
                                }}>
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
                    {/* <TouchableOpacity
                        style={{ marginLeft: 10 }}
                        onPress={() => {
                            console.log('Filter clicked');
                        }}
                    >
                        <MaterialCommunityIcons name="filter" size={30} color="black" />
                    </TouchableOpacity> */}
                </View>
            </Animated.View>
            <FlatList
                scrollEnabled={false}
                nestedScrollEnabled={false}
                ListHeaderComponent={() => renderHeader(I18n.t('Home.myClassrooms'), classRoom.length)}
                data={classRoom}
                renderItem={({ item, index }) => <ClasseItem
                    item={item}
                    index={index}
                    I18n={I18n}
                    handlePresseLiveTrakingButton={() => handlePresseLiveTrakingButton(item)}
                    navigation={navigation}
                    isSelected={false}
                    setSelectedStudent={selectedClasse}
                />}
                keyExtractor={item => (item.id).toString()}
                ListEmptyComponent={renderEmptyStudentElement} />
            <MyDivider theme={theme} />

            <FlatList
                scrollEnabled={false}
                nestedScrollEnabled={false}
                ListHeaderComponent={() => renderHeader("My extra classroom", secondaryClassRoom.length)}
                data={secondaryClassRoom}
                renderItem={({ item, index }) => <ClasseItem
                    item={item}
                    index={index}
                    I18n={I18n}
                    handlePresseLiveTrakingButton={() => handlePresseLiveTrakingButton(item)}
                    navigation={navigation}
                    isSelected={true}
                    setSelectedStudent={selectedClasse}
                />}
                keyExtractor={item => (item.id).toString()}
                ListEmptyComponent={renderEmptyStudentElement}
            />
        </ScrollView>
    </View>
}
const MyDivider = ({ theme }: any) => {
    return <Divider style={{ backgroundColor: theme.gray4, marginVertical: 10, }} />
}
export default ClassRoomListScreen;