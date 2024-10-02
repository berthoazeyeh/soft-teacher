import { Image, StyleSheet, TouchableOpacity, View } from "react-native"
import { Divider, Text } from "react-native-paper";
import { getRandomColor, Theme } from "utils";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


type Props = {
    navigation: any;
    children: any;
    theme: any;
    componend?: any;
}
const HeaderDashBoad = ({ navigation, children, theme, componend }: Props): React.JSX.Element => {

    const styles = style(theme)
    return (<View>

        <View style={styles.headerContent}>

            <TouchableOpacity
                onPress={() => navigation.goBack()}>
                <MaterialCommunityIcons name={"arrow-left"} size={30} color={theme.primaryText} />
            </TouchableOpacity>
            <View
                style={{
                    width: 35,
                    height: 35,
                    borderRadius: 50,
                    backgroundColor: getRandomColor(),
                    borderColor: theme.gray2,
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
                <Text style={{ color: theme.secondaryText, fontSize: 20 }}>#</Text>
            </View>
            <View style={styles.headerContentText}>
                <Text style={styles.title}> {children?.name + " "}</Text>
                {/* <Text style={styles.name}>{children?.middle_name + " " + children?.last_name}</Text> */}
            </View>
        </View>

        {componend}
        <Divider />

    </View>)
}

const style = (theme: any) => StyleSheet.create({
    headerStyle: {
        backgroundColor: theme.primary
    },
    container: {
        flex: 1,
        backgroundColor: theme.primaryBackground,
    },
    title: {
        ...Theme.fontStyle.montserrat.bold,
        color: theme.primaryText,
        fontSize: 18,
    },
    name: {
        ...Theme.fontStyle.montserrat.bold,
        color: theme.primaryText,
        fontSize: 18,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 40,
    },

    headerContent: {
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: "100%",
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
        height: 70
    },
    headerContentText: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        height: 150
    },
    icon: {
        marginRight: 0,
        color: theme.primaryText,
    },
});

export default HeaderDashBoad;