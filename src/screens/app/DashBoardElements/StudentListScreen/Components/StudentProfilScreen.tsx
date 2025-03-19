import { useState } from "react";
import { View, Text, Image, StyleSheet, FlatList, Dimensions } from "react-native";
import { useTheme } from "store";
import { Divider } from "react-native-paper";
import { profils, Theme } from "utils";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { I18n } from "i18n";
import React from "react";

function StudentProfilScreen(props: any): React.JSX.Element {
    const { student } = props
    const theme = useTheme()
    // console.log(student);

    const list = I18n.t("Dashboard.studentProfile.studentInfo")
    type GenderKey = 'm' | 'f';
    const sexe: Record<GenderKey, string> = {
        m: I18n.t("male"),
        f: I18n.t("female"),
    }
    const data = [
        {
            key: "birth_date",
            value: student?.birth_date,
            labels: list[0],
            icon: "calendar"
        },
        {
            key: "blood_group",
            value: student?.blood_group || "--",
            labels: list[1],
            icon: "blood-bag"
        },
        {
            key: "gender",
            value: sexe[student?.gender as GenderKey],
            labels: list[2],
            icon: "gender-male"
        },
        {
            key: "email",
            value: student?.email,
            labels: list[3],
            icon: "email"
        },
        {
            key: "phone",
            value: student?.phone || "--",
            labels: list[4],
            icon: "phone"
        },
        {
            key: "nationality",
            value: student?.nationality,
            labels: list[5],
            icon: "earth"
        },
        {
            key: "adresse",
            value: "--",
            labels: list[6],
            icon: "home"
        }
    ];


    const renderItem = ({ item }: any) => {
        return <View style={styles(theme).item}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <MaterialCommunityIcons name={item.icon} size={25} color={theme.primary} />
                <Text style={styles(theme).label} ellipsizeMode="tail" >{item.labels}</Text>
            </View>
            <View style={{ flex: 1, }} />
            <Text style={styles(theme).value}>{item.value}</Text>
        </View>
    }
    const renderHeader = () => {
        let name = ""
        if (student.middle_name) name = name + student.middle_name + " "
        if (student.last_name) name = name + student.last_name
        return <>
            <View style={styles(theme).headerContent}>
                <View style={styles(theme).imageContainer}>

                    <Image
                        source={{ uri: student?.avatar }}
                        style={styles(theme).image}
                    />
                </View>
                <View style={styles(theme).headerContentText}>
                    <Text style={styles(theme).title}>{student.first_name}</Text>
                    <Text style={styles(theme).name}>{name}</Text>

                </View>
            </View>
            <Divider />
        </>
    }

    return <View style={styles(theme).container}>
        <View style={styles(theme).content}>
            <FlatList
                data={data}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                keyExtractor={(item) => item.key.toString()}
                numColumns={2}
                ListHeaderComponent={renderHeader}
                columnWrapperStyle={styles(theme).column} />

        </View>


    </View>

}
const styles = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.primaryBackground,
    },
    item: {
        flex: 1,
        // alignItems: "center",
        // alignContent: "center",
        justifyContent: "space-between",
        flexDirection: "column",
        backgroundColor: theme.gray3,
        paddingTop: 10,
        paddingBottom: 10,
        paddingHorizontal: 10,
        height: 120,
        marginVertical: 8,
        marginHorizontal: 8,
        borderRadius: 15,
        width: 160,
    },
    content: {
        gap: 10,
    },
    label: {
        flex: 1,
        ...Theme.fontStyle.inter.bold,
        color: theme.primaryText,
        fontSize: 13,

    },
    value: {
        textAlign: "center",
        ...Theme.fontStyle.inter.regular,
        color: theme.primaryText,
        flex: 2,
        fontSize: 12,

    },
    column: {
        justifyContent: "space-evenly",
    },
    headerContent: {
        paddingHorizontal: 0,
        paddingVertical: 10,
        width: "100%",
        flexDirection: "row",
        gap: 20,
        alignItems: "center"
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 2

    },
    imageContainer: {
        width: 170,
        height: 170,
        padding: 5,
        backgroundColor:
            theme.gray3,
        borderWidth: 2,
        borderColor: theme.gray4
    },

    title: {
        ...Theme.fontStyle.inter.bold,
        color: theme.primaryText,
        fontSize: 16,

    },
    name: {
        ...Theme.fontStyle.inter.bold,
        color: theme.primaryText,
        fontSize: 15,

    },
    headerContentText: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "space-evenly",
        height: 150,
    },

});
export default StudentProfilScreen;