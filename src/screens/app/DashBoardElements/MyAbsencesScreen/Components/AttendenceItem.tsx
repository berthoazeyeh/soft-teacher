import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AttendanceDataItem } from '..';
import { formatName, Theme } from 'utils';
import { StudentAttendances } from 'services/CommonServices';
interface AttendanceItemProps {
    item: StudentAttendances;
    attendanceDataList: AttendanceDataItem[];
    theme: any;
    setSelectedStudent: (student: any, data: any[]) => void; // If you have a specific type for student, you can define it instead of `any`
    setStudent: (student: any,) => void; // If you have a specific type for student, you can define it instead of `any`
    postAttendencesForStudent: (key: any, value: any, student: any, onccesPostAttendences?: () => void) => void; // If you have a specific type for student, you can define it instead of `any`
    setModalVisible: (visible: boolean) => void;
    onAddNewAttendanceForStudent: (attendanceDataItem: AttendanceDataItem) => void;
}

const AttendanceItem = ({ attendanceDataList, item, theme, setSelectedStudent, setModalVisible, postAttendencesForStudent, setStudent, onAddNewAttendanceForStudent }: AttendanceItemProps) => {
    const styles = createStyles(theme);
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const index = attendanceDataList.findIndex(itemN => itemN.student_id === item?.id);
    var attendanceDataItem: AttendanceDataItem | null = null;
    if (index !== -1) {
        attendanceDataItem = attendanceDataList[index];
    }


    const { firstList, secondList } = splitAttendanceData(item?.attendance_line);
    const { firstList: localList, secondList: ees } = splitAttendanceDataList(attendanceDataItem);

    return (
        <View
            style={styles.itemContainer}>
            <View style={styles.imageContainer}>
                {attendanceDataItem === null && <Image source={{ uri: item.avatar }}
                    style={[styles.image, {

                        borderColor: item.attendance_line ? getColorBorder(item.attendance_line, theme).backgroundColor : theme.gray
                    }]} />}
                {attendanceDataItem !== null && <Image source={{ uri: item.avatar }}
                    style={[styles.image, {

                        borderColor: getColorBorder(attendanceDataItem, theme).backgroundColor
                    }]} />}

                {item.is_invited && <View style={{ width: 40 }}>
                    <Text numberOfLines={1} style={{ ...Theme.fontStyle.inter.blackItalic, fontSize: 10, overflow: "hidden" }}>{item.home_class?.name} </Text>
                </View>}
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.nameText}>{formatName(item.name)}</Text>
                <View style={styles.statusContainer}>
                    {attendanceDataItem === null && item?.attendance_line && (
                        <>{
                            firstList.map(([key, value], index) => <TouchableOpacity
                                key={index}
                                style={{
                                    ...styles.statusButton,
                                    backgroundColor: getColorStyles(key, value, theme).backgroundColor,
                                }}
                                onPress={() => {
                                    setStudent(item);
                                    onAddNewAttendanceForStudent({
                                        [key as string]: true,
                                        student_id: item?.id,
                                        remark: 'R.A.S',
                                    })
                                    setSelectedIndex(index)
                                }}
                            >

                                {selectedIndex === index && isLoading &&
                                    <ActivityIndicator style={{ marginHorizontal: 20 }} />
                                }
                                {(!isLoading || selectedIndex != index) &&

                                    <Text style={{
                                        ...styles.statusText,
                                        color: getColorStyles(key, value, theme).textColor,
                                    }}>{capitalizeFirstLetter(key)}</Text>}

                            </TouchableOpacity>)
                        }

                        </>
                    )}
                    {attendanceDataItem !== null && (
                        <>{
                            localList.map(([key, value], index) => <TouchableOpacity
                                key={index}
                                style={{
                                    ...styles.statusButton,
                                    backgroundColor: getColorStyles(key, value, theme).backgroundColor,
                                }}
                                onPress={() => {
                                    setStudent(item);
                                    onAddNewAttendanceForStudent({
                                        [key as string]: true,
                                        student_id: item?.id,
                                        remark: 'R.A.S',
                                    })
                                    setSelectedIndex(index)
                                }}
                            >

                                {selectedIndex === index && isLoading &&
                                    <ActivityIndicator style={{ marginHorizontal: 20 }} />
                                }
                                {(!isLoading || selectedIndex != index) &&

                                    <Text style={{
                                        ...styles.statusText,
                                        color: getColorStyles(key, value, theme).textColor,
                                    }}>{capitalizeFirstLetter(key)}</Text>}

                            </TouchableOpacity>)
                        }

                        </>
                    )}

                    {!item?.attendance_line && attendanceDataItem === null &&
                        <>
                            <TouchableOpacity style={styles.statusButton}
                                onPress={() => {
                                    setStudent(item);
                                    setSelectedIndex(0)
                                    onAddNewAttendanceForStudent({
                                        present: true,
                                        student_id: item?.id,
                                        remark: 'R.A.S',
                                    })

                                }}>
                                {selectedIndex === 0 && isLoading &&
                                    <ActivityIndicator style={{ marginHorizontal: 20 }} />
                                }
                                {(!isLoading || selectedIndex != 0) &&

                                    <Text style={styles.statusText}>{"Present"}</Text>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.statusButton}
                                onPress={() => {
                                    setStudent(item);

                                    setSelectedIndex(1)
                                    onAddNewAttendanceForStudent({
                                        absent: true,
                                        student_id: item?.id,
                                        remark: 'R.A.S',
                                    })

                                }}
                            >
                                {selectedIndex === 1 && isLoading &&
                                    <ActivityIndicator style={{ marginHorizontal: 20 }} />
                                }
                                {(!isLoading || selectedIndex != 1) &&

                                    <Text style={styles.statusText}>{"Absent"}</Text>
                                }
                            </TouchableOpacity>
                        </>}

                    <TouchableOpacity
                        onPress={() => {
                            if (item.attendance_line) {
                                setSelectedStudent(item, Object.entries(item.attendance_line).slice(0, Object.entries(item.attendance_line).length - 1));
                            } else {
                                setSelectedStudent(item, Object.entries({ "absent": false, "excused": false, "late": false, "present": false }));
                            }
                            setModalVisible(true);
                        }}>
                        <MaterialCommunityIcons name='dots-horizontal-circle' size={20} color={theme.gray4} />
                    </TouchableOpacity>
                </View>
            </View>
        </View >
    );
    function capitalizeFirstLetter(text: any) {
        if (!text) return '';
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

};

const createStyles = (theme: any) => StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        marginBottom: 15,
        gap: 10,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.gray,
        paddingBottom: 10,
        // alignItems: 'center',
    },
    imageContainer: {
        width: 42,
        height: 42,
        borderRadius: 5,
        // borderWidth: 1,
        backgroundColor: theme.gray,
        alignItems: "center",
    },
    image: {
        width: 40,
        borderWidth: 2,
        borderColor: "red",
        height: 40,
        borderRadius: 50,
        backgroundColor: 'transparent',
    },
    detailsContainer: {
        justifyContent: 'space-between',
        flex: 1,
        gap: 5,
        alignContent: 'center',
    },
    nameText: {
        fontSize: 14,
        color: theme.primaryText,
        ...Theme.fontStyle.inter.semiBold,
    },
    statusContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'center',
    },
    statusButton: {
        borderWidth: 1,
        borderColor: theme.gray,
        paddingHorizontal: 5,
        paddingVertical: 3,
        alignItems: 'center',
        borderRadius: 5,
    },
    statusText: {
        fontSize: 12,
        ...Theme.fontStyle.inter.regular,

    },
});
function splitAttendanceData(data: any) {
    const entries = Object.entries(data); // Convertit l'objet en tableau de paires [clé, valeur]

    // Trouver l'élément avec `true`
    const trueElement: any = entries.find(([key, value]) => value === true);

    // Trouver un autre élément (même si `false`)
    const otherElement: any = entries.find(([key, value]) => key !== trueElement?.[0]);

    // Construire le premier tableau avec l'élément `true` et un autre élément
    const firstList = [trueElement, otherElement];

    // Ajouter le reste des éléments dans le deuxième tableau
    const secondList = entries.filter(([key]) => key !== trueElement?.[0] && key !== otherElement?.[0]);

    return { firstList, secondList };
}
function splitAttendanceDataList(data: any) {
    if (!data) {
        return { firstList: [], secondList: [] };


    }

    const entries = Object.entries(data); // Convertit l'objet en tableau de paires [clé, valeur]
    const entriesTmp = Object.entries({ "present": false, "absent": false, "excused": false, "late": false, });
    // Trouver l'élément avec `true`
    const trueElement: any = entries.find(([key, value]) => value === true);
    if (trueElement.length <= 0) {
        return { firstList: [], secondList: [] };
    }
    // Trouver un autre élément (même si `false`)
    const otherElement: any = entriesTmp.find(([key, value]) => key !== trueElement?.[0]);

    // Construire le premier tableau avec l'élément `true` et un autre élément
    const firstList = [trueElement, otherElement];

    // Ajouter le reste des éléments dans le deuxième tableau
    const secondList = entries.filter(([key]) => key !== trueElement?.[0] && key !== otherElement?.[0]);

    return { firstList, secondList };
}


export function getColorStyles(key: string, value: boolean, theme: any) {
    let backgroundColor = '';
    let textColor = '';

    switch (key) {
        case 'present':
            backgroundColor = value ? theme.primary : theme.secondaryText;
            textColor = value ? theme.secondaryText : theme.primaryText;
            break;
        case 'absent':
            backgroundColor = value ? 'red' : theme.secondaryText;
            textColor = value ? theme.secondaryText : theme.primaryText;
            break;
        case 'excused':
            backgroundColor = value ? 'blue' : theme.secondaryText;
            textColor = value ? theme.secondaryText : theme.primaryText;
            break;
        case 'late':
            backgroundColor = value ? 'orange' : theme.secondaryText;
            textColor = value ? theme.primaryText : theme.primaryText;
            break;
        default:
            backgroundColor = theme.secondaryText;
            textColor = theme.primaryText;
            break;
    }

    return { backgroundColor, textColor };
}
function getColorBorder(data: any, theme: any) {
    let backgroundColor = '';
    const { absent, excused, late, present } = data;

    if (present) {
        backgroundColor = theme.primary;
    }
    else if (absent) {
        backgroundColor = 'red';
    }
    else if (excused) {
        backgroundColor = 'blue';
    }
    else if (late) {
        backgroundColor = 'orange';
    }
    else {
        backgroundColor = theme.gray;
    }
    return { backgroundColor };
}

export default AttendanceItem;


// postAttendencesForStudent(
//     key,
//     true,
//     item,
//     () => {
//         setIsLoading(false)

//     })


// postAttendencesForStudent(
//     'absent',
//     true,
//     item,
//     () => {
//         setIsLoading(false)

//     })
// postAttendencesForStudent(
//     'present',
//     true,
//     item,
//     () => {
//         setIsLoading(false)

//     })