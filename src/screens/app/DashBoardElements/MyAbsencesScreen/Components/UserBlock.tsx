import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getColorStyles } from './AttendenceItem';
import { useTheme } from 'store';

type UserBlockProps = {
    name: string;
    photoUrl: string;
    isPresent: boolean;
};

function capitalizeFirstLetter(text: any) {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1);
}
function splitAttendanceData(data: any) {
    const entries = Object.entries(data);
    const trueElement: any = entries.find(([key, value]) => value === true);
    return trueElement
}
const UserBlock = ({ name, photoUrl, isPresent }: UserBlockProps) => {
    const theme = useTheme();
    if (isPresent) {
        const [key, value] = splitAttendanceData(isPresent);
        return (
            <View style={styles.container}>
                <Image source={{ uri: photoUrl }} style={styles.photo} />
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <View style={[styles.status, { backgroundColor: getColorStyles(key, value, theme).backgroundColor }]}>
                        <Text style={styles.statusText}>{capitalizeFirstLetter(key)}</Text>
                    </View>
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    photo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "row",
    },
    name: {
        fontSize: 18,
        flex: 1,
        fontWeight: '600',
        color: '#333',
    },
    status: {
        marginTop: 5,
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 5,
    },
    present: {
        backgroundColor: 'green',
    },
    absent: {
        backgroundColor: 'red',
    },
    statusText: {
        color: '#fff',
        fontSize: 14,
    },
});

export default UserBlock;
