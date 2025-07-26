import { Text, View } from "react-native"
import dynamicStyles from "../style";
import { useTheme } from "store";
import { formatRelativeTime, MyNotificationTypes } from "utils";

const NotificationItem = ({ item }: { item: MyNotificationTypes }): React.JSX.Element => {
    const theme = useTheme()
    const styles = dynamicStyles(theme)
    return <View style={styles.itemContainer}>
        <Text style={styles.date}>{formatRelativeTime(item.date)}</Text>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.name}>{item.body}</Text>
    </View>
}

export default NotificationItem;