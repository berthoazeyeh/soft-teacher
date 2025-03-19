import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from 'utils';
interface AttendanceItemProps {
    item: any;
    theme: any;
    setSelectedStudent: (student: any, data: any[]) => void; // If you have a specific type for student, you can define it instead of `any`
    setStudent: (student: any,) => void; // If you have a specific type for student, you can define it instead of `any`
    postAttendencesForStudent: (value: any, student: any, onccesPostAttendences?: () => void) => void; // If you have a specific type for student, you can define it instead of `any`
}

const AttendanceItem = ({ item, theme, setSelectedStudent, postAttendencesForStudent, setStudent }: AttendanceItemProps) => {
    const styles = createStyles(theme);
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    return (
        <TouchableOpacity
            onPress={() => {
                console.log(item);

            }}
            style={styles.itemContainer}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: item.avatar }}
                    style={[styles.image, { borderColor: item.attendance_line ? getColorBorder(item.attendance_line, theme).backgroundColor : theme.gray }]} />
            </View>

            <View style={styles.detailsContainer}>
                <Text style={styles.nameText}>{item.name}</Text>

                <View style={styles.statusContainer}>
                    {item?.attendee && <>
                        <TouchableOpacity style={[styles.statusButton, { backgroundColor: item?.attendee?.status === "present" ? theme.primary : theme.secondaryText }]}
                            onPress={() => {
                                setStudent(item);
                                setSelectedIndex(0)
                                setIsLoading(true)
                                postAttendencesForStudent(
                                    'present',
                                    item,
                                    () => {
                                        setIsLoading(false)

                                    })
                            }}>
                            {selectedIndex === 0 && isLoading &&
                                <ActivityIndicator style={{ marginHorizontal: 20 }} />
                            }
                            {(!isLoading || selectedIndex != 0) &&

                                <Text style={[styles.statusText, { color: item?.attendee?.status === "present" ? theme.secondaryText : theme.primaryText }]}>{"Present"}</Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.statusButton, { backgroundColor: item?.attendee?.status === "absent" ? "red" : theme.secondaryText }]}
                            onPress={() => {
                                setStudent(item);

                                setSelectedIndex(1)
                                setIsLoading(true)
                                postAttendencesForStudent(
                                    'absent',
                                    item,
                                    () => {
                                        setIsLoading(false)

                                    })
                            }}
                        >
                            {selectedIndex === 1 && isLoading &&
                                <ActivityIndicator style={{ marginHorizontal: 20 }} />
                            }
                            {(!isLoading || selectedIndex != 1) &&

                                <Text style={[styles.statusText, { color: item?.attendee?.status === "absent" ? theme.secondaryText : theme.primaryText }]}>{"Absent"}</Text>
                            }
                        </TouchableOpacity>
                    </>}
                    {!item?.attendee && <>
                        <TouchableOpacity style={[styles.statusButton]}
                            onPress={() => {
                                setStudent(item);
                                setSelectedIndex(0)
                                setIsLoading(true)
                                postAttendencesForStudent(
                                    'present',
                                    item,
                                    () => {
                                        setIsLoading(false)

                                    })
                            }}>
                            {selectedIndex === 0 && isLoading &&
                                <ActivityIndicator style={{ marginHorizontal: 20 }} />
                            }
                            {(!isLoading || selectedIndex != 0) &&

                                <Text style={[styles.statusText]}>{"Present"}</Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.statusButton]}
                            onPress={() => {
                                setStudent(item);

                                setSelectedIndex(1)
                                setIsLoading(true)
                                postAttendencesForStudent(
                                    'absent',
                                    item,
                                    () => {
                                        setIsLoading(false)

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
                    </>
                    }

                </View>
            </View>
        </TouchableOpacity >
    );


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
        alignItems: 'center',
    },
    imageContainer: {
        width: 55,
        height: 55,
        borderRadius: 50,
        // borderWidth: 1,
        backgroundColor: theme.gray,
        alignItems: "center",
    },
    image: {
        width: 55,
        borderWidth: 2,
        borderColor: "red",
        height: 55,
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
        ...Theme.fontStyle.inter.bold,
        fontSize: 14,
        color: theme.primaryText,
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
        ...Theme.fontStyle.inter.regular,
        fontSize: 12,
    },
});
function splitAttendanceData(data: any) {
    if (!data) {
        return {
            firstList: [],
            secondList: []
        }
    }
    const entries = Object.entries(data); // Convertit l'objet en tableau de paires [clé, valeur]

    // Trouver l'élément avec `true`
    const trueElement: any = entries.find(([key, value]) => value === true);

    // Trouver un autre élément (même si `false`)
    const otherElement: any = entries.find(([key, value]) => key !== trueElement[0]);

    // Construire le premier tableau avec l'élément `true` et un autre élément
    const firstList = [trueElement, otherElement];

    // Ajouter le reste des éléments dans le deuxième tableau
    const secondList = entries.filter(([key]) => key !== trueElement[0] && key !== otherElement[0]);

    return { firstList, secondList };
}
function getColorStyles(key: string, value: boolean, theme: any) {
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
