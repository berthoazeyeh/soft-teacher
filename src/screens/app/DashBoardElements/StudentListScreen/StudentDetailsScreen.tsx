import { useEffect, useRef, useState } from "react";
import { View, Text, Animated, Image } from "react-native";
import { useTheme } from "store";
import dynamicStyles from "./styles";
import { TouchableOpacity } from "react-native";
import { Divider } from "react-native-paper";
import { Theme } from "utils";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";
import { EducationScreen, GuardiansScreen, StudentProfilScreen, TabNavigator } from "./Components";
import { Student } from "services/CommonServices";







function StudentDetailsScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { student }: { student: Student } = route.params
    const theme = useTheme()

    useEffect(() => {

    }, [])






    return <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 10, flexDirection: "row", gap: 20, alignItems: "center", }}
            onPress={() => {
                navigation.goBack()
            }}>
            <MaterialCommunityIcons name='arrow-left' size={25} color={theme.primaryText} />
            <Text style={{ ...Theme.fontStyle.inter.semiBold, fontSize: 16, color: theme.primary }}>{"Fiche de renseignements"}</Text>

        </TouchableOpacity>
        <Divider />
        <TabNavigator>
            <StudentProfilScreen student={student} />
            <EducationScreen />
            <GuardiansScreen student={student} />
        </TabNavigator>
    </SafeAreaView>

}







export default StudentDetailsScreen;