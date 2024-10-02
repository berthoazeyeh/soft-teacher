import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { useTheme } from "store";
import dynamicStyles from "./styles";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from "moment";
import { FlatList } from "react-native";
import { getRandomColor, Theme } from "utils";
import { CustomDatePickerForm } from "components";
import { Divider } from "react-native-paper";


function CourcesListeScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { children } = route.params
    const theme = useTheme()
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<any>(null);
    const styles = dynamicStyles(theme)
    useEffect(() => {
        console.log("children", children);

    }, [])

    const data = [
        {
            startDate: "11h",
            endDate: "12h",
            name: "Chimie",
            isDone: false,
        },
        {
            startDate: "08h",
            endDate: "10h",
            name: "Mathematique",
            isDone: true,

        },
        {
            startDate: "11h",
            endDate: "12h",
            name: "Informatique",
            isDone: true,
        },

    ]
    const renderEmptyElement = () => (
        <View style={styles.emptyData}>
            {isLoading &&
                <ActivityIndicator color={theme.primary} size={25} />}

            {!isLoading &&
                <Text style={styles.emptyDataText}>{"Aucun cours present."}</Text>}
        </View>
    );
    const incrementDate = () => {
        setSelectedDate((prevDate: any) => moment(prevDate).add(1, 'days'));
    };

    const decrementDate = () => {
        setSelectedDate((prevDate: any) => moment(prevDate).subtract(1, 'days'));
    };


    return <View style={styles.container}>
        <TouchableOpacity style={{ paddingHorizontal: 10, flexDirection: "row", gap: 30, alignItems: "center" }}
            onPress={() => {
                navigation.goBack()
            }}
        >
            <MaterialCommunityIcons name='arrow-left' size={25} color={theme.primaryText} />
            <Text style={{ ...Theme.fontStyle.montserrat.semiBold, fontSize: 28, color: theme.primary }}>{children.name}</Text>
        </TouchableOpacity>
        <Divider />
        <View style={styles.headerTimeConatiner}>
            <TouchableOpacity onPress={decrementDate}>
                <MaterialCommunityIcons name='chevron-left-circle' size={25} color={theme.primaryText} />
            </TouchableOpacity>

            <CustomDatePickerForm
                date={selectedDate}
                onDateChange={setSelectedDate}
                theme={theme}
            />

            <TouchableOpacity onPress={incrementDate}>
                <MaterialCommunityIcons name='chevron-right-circle' size={25} color={theme.primaryText} />
            </TouchableOpacity>
        </View>

        <FlatList
            data={data}
            renderItem={({ item, index }) =>
                <TouchableOpacity
                    onPress={() => {
                        navigation.navigate("MyAbsencesScreen", { class: children, courses: item })
                    }}
                    style={{ flexDirection: "row", marginBottom: 20, gap: 20, paddingHorizontal: 20, }}>
                    <View style={{ justifyContent: "space-around", width: 50, }}>
                        <Text style={{ ...Theme.fontStyle.montserrat.semiBold, fontSize: 18, color: theme.primaryText }}>{item.startDate}</Text>
                        <Text style={{ ...Theme.fontStyle.montserrat.semiBold, fontSize: 18, color: theme.primaryText }}>{item.endDate}</Text>
                    </View >

                    <View style={{ width: 10, backgroundColor: getRandomColor(), height: 80, }} />

                    <View style={{ justifyContent: "space-around" }}>
                        <Text style={{ ...Theme.fontStyle.montserrat.semiBold, fontSize: 28, color: theme.primaryText }}>{item.name}</Text>
                        <Text>{children.name}</Text>
                        {item.isDone &&
                            <MaterialCommunityIcons name='check-circle' size={25} color={theme.primary} />
                        }
                        {!item.isDone &&
                            <MaterialCommunityIcons name='check-circle' size={25} color={"red"} />
                        }

                    </View>
                </TouchableOpacity>

            }
            keyExtractor={(item, index) => index.toString()}
            ListEmptyComponent={renderEmptyElement}
        />

    </View>

}

export default CourcesListeScreen;