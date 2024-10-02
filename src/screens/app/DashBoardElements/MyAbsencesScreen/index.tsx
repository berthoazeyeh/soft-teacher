import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Easing } from "react-native";
import { isDarkMode, useTheme } from "store";
import dynamicStyles from "./styles";
import { getRandomColor, profils, Theme } from "utils";
import { FlatList } from "react-native";
import moment from "moment";
import { Image } from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Checkbox, Searchbar } from "react-native-paper";
import { Animated } from "react-native";
import Modal from 'react-native-modal';
import { ScrollView } from "react-native-gesture-handler";


function MyAbsencesScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { class: classe, courses } = route.params
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const styles = dynamicStyles(theme)
    const [filteredData, setFilteredData] = useState<any[]>([])

    useLayoutEffect(() => {
        navigation.setOptions({
            title: courses?.name,
            headerRight: () => <TouchableOpacity
                style={{ marginRight: 20 }}
                onPress={() => {
                    setShowSearch(true)
                    showHeader()
                }}
            >
                <MaterialCommunityIcons name='account-search' size={30} color={theme.primaryText} />
            </TouchableOpacity>,
        });
    }, []);

    const [modalVisible, setModalVisible] = useState(true);

    const [checkedItems, setCheckedItems] = useState<any>({
        infirmerie: false,
        punition: false,
        exclusion: false,
        dispense: false,
        observations: false,
        encouragements: false,
        defautsCarnet: false,
        leconNonApprise: false,
        oubliMateriel: false,
        travailNonFait: false,
    });

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const handleCheckBoxChange = (key: any) => {
        setCheckedItems((prevState: any) => ({
            ...prevState,
            [key]: !prevState[key],
        }));
    };

    const headerHeight = useRef(new Animated.Value(60)).current;  // Assuming 60 is your header height

    // Animation function to show header
    const showHeader = () => {
        Animated.timing(headerHeight, {
            toValue: 60, // Full height of the header
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false, // height doesn't support native driver
        }).start();
    };

    // Animation function to hide header
    const hideHeader = () => {
        Animated.timing(headerHeight, {
            toValue: 0, // Hide the header by reducing its height
            duration: 300,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
        }).start();
    };

    const data = [
        { id: 1, name: "John Doe", hasMarkedAttendance: true, status: true, timeMarked: "09:00 AM", date: "2024-09-23", remarks: "On time" },
        { id: 2, name: "Jane Smith", hasMarkedAttendance: true, status: false, timeMarked: "09:15 AM", date: "2024-09-23", remarks: "Absent" },
        { id: 3, name: "Michael Johnson", hasMarkedAttendance: false, status: false, timeMarked: null, date: "2024-09-23", remarks: "Pending" },
        { id: 4, name: "Emily Davis", hasMarkedAttendance: true, status: true, timeMarked: "08:50 AM", date: "2024-09-23", remarks: "Early arrival" },
        { id: 5, name: "Daniel Brown", hasMarkedAttendance: true, status: true, timeMarked: "09:05 AM", date: "2024-09-23", remarks: "On time" },
        { id: 6, name: "Olivia Williams", hasMarkedAttendance: false, status: false, timeMarked: null, date: "2024-09-23", remarks: "Pending" },
        { id: 7, name: "James Miller", hasMarkedAttendance: true, status: false, timeMarked: "09:30 AM", date: "2024-09-23", remarks: "Absent" },
        { id: 8, name: "Sophia Wilson", hasMarkedAttendance: true, status: true, timeMarked: "08:55 AM", date: "2024-09-23", remarks: "On time" },
        { id: 9, name: "Liam Martinez", hasMarkedAttendance: true, status: true, timeMarked: "09:10 AM", date: "2024-09-23", remarks: "Slightly late" },
        { id: 10, name: "Emma Anderson", hasMarkedAttendance: true, status: false, timeMarked: "09:25 AM", date: "2024-09-23", remarks: "Absent" },
        { id: 11, name: "Noah Thomas", hasMarkedAttendance: true, status: true, timeMarked: "08:45 AM", date: "2024-09-23", remarks: "Early arrival" },
        { id: 12, name: "Ava Taylor", hasMarkedAttendance: false, status: false, timeMarked: null, date: "2024-09-23", remarks: "Pending" },
        { id: 13, name: "William Lee", hasMarkedAttendance: true, status: true, timeMarked: "09:20 AM", date: "2024-09-23", remarks: "Slightly late" },
        { id: 14, name: "Mia Harris", hasMarkedAttendance: true, status: true, timeMarked: "09:00 AM", date: "2024-09-23", remarks: "On time" },
        { id: 15, name: "Ethan Clark", hasMarkedAttendance: true, status: false, timeMarked: "09:35 AM", date: "2024-09-23", remarks: "Absent" },
        { id: 16, name: "Isabella Lewis", hasMarkedAttendance: true, status: true, timeMarked: "09:05 AM", date: "2024-09-23", remarks: "On time" },
        { id: 17, name: "Mason Walker", hasMarkedAttendance: false, status: false, timeMarked: null, date: "2024-09-23", remarks: "Pending" },
        { id: 18, name: "Lucas Hall", hasMarkedAttendance: true, status: true, timeMarked: "08:55 AM", date: "2024-09-23", remarks: "Early arrival" },
        { id: 19, name: "Charlotte Young", hasMarkedAttendance: true, status: true, timeMarked: "09:10 AM", date: "2024-09-23", remarks: "Slightly late" },
        { id: 20, name: "Elijah King", hasMarkedAttendance: true, status: false, timeMarked: "09:30 AM", date: "2024-09-23", remarks: "Absent" }
    ];


    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = data.filter(item =>
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
                renderItem={({ item, index }) =>
                    <TouchableOpacity
                        onPress={() => {
                        }}
                        style={{ flexDirection: "row", marginBottom: 15, gap: 20, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: theme.gray, paddingBottom: 10, alignItems: "center" }}>
                        <View style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: theme.gray }}>
                            <Image source={profils} style={{ width: 50, height: 50, borderRadius: 50, backgroundColor: theme.gray }} />
                        </View >


                        <View style={{ justifyContent: "space-between", flex: 1, gap: 5, alignContent: "center", }}>
                            <Text style={{ ...Theme.fontStyle.montserrat.semiBold, fontSize: 20, color: theme.primaryText }}>{item.name}</Text>

                            <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                                {
                                    item.hasMarkedAttendance && <>
                                        <TouchableOpacity
                                            style={{ borderWidth: 1, borderColor: theme.gray, paddingHorizontal: 5, paddingVertical: 3, alignItems: "center", borderRadius: 5, backgroundColor: item.status ? theme.primary : theme.primaryBackground }}
                                        >
                                            <Text style={{ color: item.status ? theme.secondaryText : theme.primaryText, fontSize: 16 }}>{"Present"}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ borderWidth: 1, borderColor: theme.gray, paddingHorizontal: 5, paddingVertical: 3, alignItems: "center", borderRadius: 5, backgroundColor: !item.status ? "red" : theme.primaryBackground }}>
                                            <Text style={{ color: !item.status ? theme.secondaryText : theme.primaryText, fontSize: 16 }}>{"Absent"}</Text>
                                        </TouchableOpacity>
                                    </>
                                }
                                {
                                    !item.hasMarkedAttendance && <>
                                        <TouchableOpacity
                                            style={{ borderWidth: 1, borderColor: theme.gray, paddingHorizontal: 5, paddingVertical: 3, alignItems: "center", borderRadius: 5 }}
                                        >
                                            <Text style={{ fontSize: 16 }}>{"Present"}</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ borderWidth: 1, borderColor: theme.gray, paddingHorizontal: 5, paddingVertical: 3, alignItems: "center", borderRadius: 5 }}>
                                            <Text style={{ fontSize: 16 }}>{"Absent"}</Text>
                                        </TouchableOpacity>
                                    </>
                                }
                                <TouchableOpacity onPress={() => {
                                    setSelectedStudent(item)
                                    setModalVisible(true)
                                }}>
                                    <MaterialCommunityIcons name='plus-box' size={35} color={theme.gray4} />
                                </TouchableOpacity>

                            </View>

                        </View>
                    </TouchableOpacity>

                }
                keyExtractor={(item, index) => index.toString()}
                ListEmptyComponent={renderEmptyElement}
            />
        </View>
        <Modal
            onBackButtonPress={() => setModalVisible(false)}
            isVisible={modalVisible}
            style={styles.modalContent}
            backdropColor={isDarkMode() ? theme.underlayColor : 'black'}
        >
            <View style={styles.modalView}>
                <View style={[styles.modalContent]}>
                    <Text style={styles.titleText}>{selectedStudent?.name}</Text>
                    <ScrollView >
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                status={checkedItems.infirmerie ? 'checked' : 'unchecked'}
                                onPress={() => handleCheckBoxChange('infirmerie')}
                            />
                            <Text>Infirmerie</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                status={checkedItems.punition ? 'checked' : 'unchecked'}
                                onPress={() => handleCheckBoxChange('punition')}
                            />
                            <Text>Punition</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                status={checkedItems.exclusion ? 'checked' : 'unchecked'}
                                onPress={() => handleCheckBoxChange('exclusion')}
                            />
                            <Text>Exclusion</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                status={checkedItems.dispense ? 'checked' : 'unchecked'}
                                onPress={() => handleCheckBoxChange('dispense')}
                            />
                            <Text>Dispense</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                status={checkedItems.observations ? 'checked' : 'unchecked'}
                                onPress={() => handleCheckBoxChange('observations')}
                            />
                            <Text>Observations</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                status={checkedItems.encouragements ? 'checked' : 'unchecked'}
                                onPress={() => handleCheckBoxChange('encouragements')}
                            />
                            <Text>Encouragements</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                status={checkedItems.defautsCarnet ? 'checked' : 'unchecked'}
                                onPress={() => handleCheckBoxChange('defautsCarnet')}
                            />
                            <Text>Défauts de carnet/carte</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                status={checkedItems.leconNonApprise ? 'checked' : 'unchecked'}
                                onPress={() => handleCheckBoxChange('leconNonApprise')}
                            />
                            <Text>Leçon non apprise</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                status={checkedItems.oubliMateriel ? 'checked' : 'unchecked'}
                                onPress={() => handleCheckBoxChange('oubliMateriel')}
                            />
                            <Text>Oubli de matériel</Text>
                        </View>
                        <View style={styles.checkboxContainer}>
                            <Checkbox
                                status={checkedItems.travailNonFait ? 'checked' : 'unchecked'}
                                onPress={() => handleCheckBoxChange('travailNonFait')}
                            />
                            <Text>Travail non fait</Text>
                        </View>
                        {/* </View> */}
                    </ScrollView>

                    <TouchableOpacity onPress={toggleModal} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Fermer</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </View>


}

export default MyAbsencesScreen;