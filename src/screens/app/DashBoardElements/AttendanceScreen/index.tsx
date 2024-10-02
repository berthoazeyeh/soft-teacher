import { useEffect } from "react";
import { View, Text } from "react-native";
import { useTheme } from "store";
import dynamicStyles from "./styles";


function AttendanceScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { children } = route.params
    const theme = useTheme()
    const styles = dynamicStyles(theme)
    useEffect(() => {
        console.log("children", children);

    }, [])



    return <View style={styles.container}>


        <Text>{"children"}</Text>


    </View>

}

export default AttendanceScreen;