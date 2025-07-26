import { useEffect, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native";
import { useTheme } from "store";
import { Header, NotificationItem } from "./components";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { I18n } from 'i18n';
import dynamicStyles from "./style";
import { getNotifications } from "services/NotificationsServices";
import { db } from "apis/database";
import { MyNotificationTypes, showCustomMessage, Theme } from "utils";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native-paper";

function NotificationScreen(props: any): React.JSX.Element {
    const { navigation } = props;
    const isDarkMode = useColorScheme() === 'dark';
    const theme = useTheme()
    const styles = dynamicStyles(theme)
    const [isLocalLoading, setIsLocalLoading] = useState(true)
    const [isUnReadSelect, setIsUnReadSelect] = useState(true)
    const [notificationList, setNotificationList] = useState<MyNotificationTypes[]>([])

    const data = [
        { id: '1', name: 'John Doe', date: '2024-07-29', title: 'First Title' },
        { id: '2', name: 'Jane Smith', date: '2024-08-01', title: 'Second Title' },
        { id: '3', name: 'Alice Johnson', date: '2024-09-15', title: 'Third Title' },
        { id: '4', name: 'John Doe', date: '2024-07-29', title: 'First Title' },
        { id: '5', name: 'Jane Smith', date: '2024-08-01', title: 'Second Title' },
        { id: '6', name: 'Alice Johnson', date: '2024-09-15', title: 'Third Title' },
        { id: '7', name: 'John Doe', date: '2024-07-29', title: 'First Title' },
        { id: '8', name: 'Jane Smith', date: '2024-08-01', title: 'Second Title' },
        { id: '9', name: 'Alice Johnson', date: '2024-09-15', title: 'Third Title' },
        { id: '10', name: 'John Doe', date: '2024-07-29', title: 'First Title' },
        { id: '11', name: 'Jane Smith', date: '2024-08-01', title: 'Second Title' },
        { id: '12', name: 'Alice Johnson', date: '2024-09-15', title: 'Third Title' },
        // Ajoutez plus d'éléments si nécessaire
    ];
    useEffect(() => {
        // getlan()
        fetchNotification();
    }, [navigation, isUnReadSelect])



    async function fetchNotification() {
        try {
            setIsLocalLoading(true);
            setNotificationList([]);
            const response = await getNotifications(db, isUnReadSelect ? false : undefined);
            if (response.success) {
                console.log("Données des classes :", response.data?.length);
                if (response.data) {
                    setNotificationList(response.data);
                }
            } else {
                showCustomMessage("Information", response?.error, "warning", "bottom")

                // console.error("Erreur :", response.error);
            }

        } catch (error) {
            console.error("Erreur lors de la récupération :", error);
        } finally {
            setIsLocalLoading(false);
        }
    }

    return (
        <View style={styles.container}>

            <Header title={I18n.t("Notification.title")} theme={theme} />

            <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 10, paddingVertical: 10 }}>
                <TouchableOpacity
                    onPress={() => {
                        setIsUnReadSelect(true)
                    }}
                    style={{
                        paddingHorizontal: 10, paddingVertical: 5, backgroundColor: isUnReadSelect ? theme.primary : theme.gray,
                        borderRadius: 10,
                    }}>
                    <Text style={{ ...Theme.fontStyle.inter.semiBold, color: isUnReadSelect ? theme.secondaryText : theme.primaryText, }}>Non lues</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        setIsUnReadSelect(false)
                    }}
                    style={{ paddingHorizontal: 10, borderRadius: 10, paddingVertical: 5, backgroundColor: isUnReadSelect ? theme.gray : theme.primary }}>
                    <Text style={{ ...Theme.fontStyle.inter.semiBold, color: !isUnReadSelect ? theme.secondaryText : theme.primaryText, }}>tout afficher</Text>
                </TouchableOpacity>
            </View>

            <View
                style={styles.content}>
                <FlatList

                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    data={notificationList}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => <NotificationItem item={item} />}
                    ListEmptyComponent={() => <View style={{ alignItems: "center", padding: 30 }}>
                        {isLocalLoading && <ActivityIndicator />}
                        {!isLocalLoading && <Text style={{ ...Theme.fontStyle.inter.regular, color: theme.gray, textAlign: 'center', marginTop: 20 }}>Aucune notification</Text>}
                    </View>}
                />
            </View>
        </View>
    );
}

export default NotificationScreen