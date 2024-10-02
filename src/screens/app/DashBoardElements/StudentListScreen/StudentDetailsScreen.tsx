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







function StudentDetailsScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { children } = route.params
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false)
    const [showSearch, setShowSearch] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedStudent, setSelectedStudent] = useState<any>(null)
    const styles = dynamicStyles(theme)
    const [filteredData, setFilteredData] = useState<any[]>([])
    useEffect(() => {

    }, [])






    return <SafeAreaView style={{ flex: 1 }}>
        <TouchableOpacity style={{ paddingHorizontal: 10, paddingVertical: 10, flexDirection: "row", gap: 20, alignItems: "center", }}
            onPress={() => {
                navigation.goBack()
            }}>
            <MaterialCommunityIcons name='arrow-left' size={25} color={theme.primaryText} />
            <Text style={{ ...Theme.fontStyle.montserrat.semiBold, fontSize: 18, color: theme.primary }}>{"Fiche de renseignements"}</Text>

        </TouchableOpacity>
        <Divider />
        <TabNavigator>
            <StudentProfilScreen />
            <EducationScreen />
            <GuardiansScreen />
        </TabNavigator>
    </SafeAreaView>

}




const IdentiteScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Identité Screen Content</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
    },
});


export default StudentDetailsScreen;