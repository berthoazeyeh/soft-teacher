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
    useEffect(() => {
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
                setClassRoom(assigms?.rooms);
                setSecondaryClassRoom(assigms?.diffuser_rooms)
                console.log("getTeacherClassRoom------size-------", assigms);
            } else {
            }
        } catch (error) {

        }
    };
    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = [...classRoom, ...secondaryClassRoom]?.filter((item: any) =>
            item?.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredData(filtered);
    };


    const renderHeader = (text: string) => (
        <View
            style={styles.logo}>
            <TouchableOpacity
                style={styles.TitleContainer}>
                <Text style={styles.fieldText}>{text} ({classRoom?.length})</Text>
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
            {isLoading &&
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
                ListHeaderComponent={() => renderHeader(I18n.t('Home.myClassrooms'))}
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
                ListHeaderComponent={() => renderHeader("My extra classroom")}
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