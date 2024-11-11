import { View, Text, Image, TouchableOpacity } from "react-native";
import { useCurrentUser } from "store";
import dynamicStyles from "../style";
import { formatDate, removeHtmlTags } from "utils";


interface PropsType {
    theme: any;
    navigation: any;
    item: any;
    handlePressConverssation: (item: any) => void;
}
function DiscussItem({ theme, navigation, item, handlePressConverssation }: PropsType): React.JSX.Element {
    const styles = dynamicStyles(theme)
    const user = useCurrentUser();

    // console.log("//////", item);



    return <TouchableOpacity style={styles.discussContainer}
        onPress={() => {
            handlePressConverssation(item);
        }}
    >
        <View style={styles.avatar}>
            <Image style={styles.avatarImg} source={{ uri: item?.image }} />
        </View>

        <View style={styles.content}>
            <View style={styles.headerContent}>
                <Text style={styles.title} numberOfLines={1}>
                    {item?.name}
                </Text>
                <Text style={styles.timesTitle} >
                    {item?.date?.length > 2 ? formatDate(item?.date) : '------'}
                </Text>
            </View>
            <View style={styles.headerContentF}>
                <Text style={styles.messagetitle} numberOfLines={1}>
                    {item?.message?.length > 2 ? removeHtmlTags(item?.message) : "Vous avez été ajouter a la discussion"}
                </Text>
                <Text style={styles.unReadMessage}>{"0"}</Text>
            </View>
        </View>



    </TouchableOpacity>

}

export default DiscussItem;