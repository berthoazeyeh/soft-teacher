import { View, Text, TouchableOpacity } from "react-native";
import dynamicStyles from "../style";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


interface PropsType {
    theme: any;
    navigation: any;
    item: any;
    handlePressConverssation: (item: any) => void;
}
function DiscussItem({ theme, navigation, item, handlePressConverssation }: PropsType): React.JSX.Element {
    const styles = dynamicStyles(theme)

    return <TouchableOpacity style={styles.discussContainer}
        onPress={() => {
            handlePressConverssation(item);
        }}
    >
        {/*  */}
        <View style={styles.avatar}>
            <MaterialCommunityIcons
                name="account-circle"
                size={27}
                color={theme.primaryText}
            />
        </View>

        <View style={styles.content}>
            <View style={styles.headerContent}>
                <Text style={styles.title} numberOfLines={2}>
                    {item?.name}
                </Text>

            </View>

        </View>



    </TouchableOpacity>

}

export default DiscussItem;