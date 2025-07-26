import { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { ActivityIndicator, Image, Text } from "react-native"
import { isDarkMode, updateNotificationSettings, updateUserStored, useCurrentUser, useTheme } from "store";
import { displayNotificationTest, ImageE2, logo, showCustomMessage, Theme } from "utils"
import { getData, getDataM, LOCAL_URL } from "apis";
import { useDispatch } from "react-redux";
import { ThemeActionTypes } from "store/actions/ThemeAction";
import { useColorScheme } from "react-native";
import { clearTables, createAllTable, db, dropCustomTables, dropTables } from "apis/database";

import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, AndroidVisibility, AndroidAction, AndroidCategory, TimestampTrigger, TimeUnit, TriggerType, EventType } from '@notifee/react-native';
import moment from "moment";
import { fetchLocalTeacherTimeTablesData, FacultyAttendance, saveAttendance, onEventNotification } from "services/CommonServices";
import { useCurrentNotificationSettings } from "store/selectors/NotificationSelector";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";




notifee.onForegroundEvent((event) => {
    onEventNotification(event)
});

notifee.onBackgroundEvent((event) => {
    onEventNotification(event)
}),




    messaging().onMessage(async remoteMessage => {
        console.log('Message received!--', remoteMessage);
        if (remoteMessage?.notification) {
            onDisplayNotification(remoteMessage?.notification?.title, remoteMessage?.notification?.body, remoteMessage?.notification?.android)
        }
    });

// messaging().setBackgroundMessageHandler(async remoteMessage => {
//     console.log('Message push reçu en arrière-plan:', remoteMessage);
// });

// messaging().onNotificationOpenedApp(notificationOpen => {
//     console.log('Notification opened!', notificationOpen);
// });


notifee.getTriggerNotifications().then(ids => console.log('All trigger notifications: ', ids.length));
notifee.getTriggerNotifications().then(ids => console.log('All trigger notifications: ', ids));
notifee.cancelTriggerNotifications();



const Welcome = (props) => {
    const theme = useTheme();
    const { navigation } = props;
    const dispatch = useDispatch();
    const user = useCurrentUser();
    const settings = useCurrentNotificationSettings();

    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Authorization status:|||||||||||||||||||11111', authStatus);
        } else {
            console.warn('Authorization status:|||||||||||||||||00000', authStatus);
        }
    }
    const { data, error, isLoading } = useSWR(`${LOCAL_URL}/api/get/params`,
        getData,
    );

    useEffect(() => {
        // console.warn("error");

        if (data && data?.data?.time_notification) {
            const tmpSettings = settings;
            try {
                tmpSettings.time = parseInt(data?.data?.time_notification)
                // console.warn("error11111111", parseInt(data?.data?.time_notification));
            } catch (error) {
                console.log("error", error);
            }
            dispatch(updateNotificationSettings(tmpSettings));
        }
    }, [data]);


    useEffect(() => {
        // displayNotificationTest();
        // registerForPushNotifications();
        requestUserPermission();
        tryToLoginParents();
        console.log("user------------", user, settings);
    }, [navigation]);
    const scheme = useColorScheme();
    async function registerForPushNotifications() {
        const token = await messaging().getToken();
        console.log('Push notification token: ', token);
        if (token) {
            return token;
        } else {
            return null;
        }
    }


    const createAllTables = async () => {
        // const res = await dropTables(db);
        // const res = await dropCustomTables(["assignment_types", "assignment_types", "assignments", "assignment_rooms", "attendanceLine", "students", "sessions", "classrooms"]);
        // console.log(res);

    }



    useEffect(() => {
        dispatch({ type: ThemeActionTypes.SET_SYSTEM_THEME, payload: scheme });
    }, [dispatch, scheme]);



    const tryToLoginParents = async () => {
        try {
            await createAllTables();
            await createAllTable(db);
            const user_Parent_Id = user?.id
            if (!user_Parent_Id) {

                navigation.navigate("LoginScreen");
                return;
            } else {
                await fetchLocalTeacherTimeTablesData(user, settings);
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'AppStacks' }],
                })
                return;
            }
            const response = await getDataM(`${LOCAL_URL}/api/op.parent/${user_Parent_Id}`)
            if (response?.success) {
                const data = response.data[0]
                const user1 = user
                dispatch(updateUserStored(user1))
                showCustomMessage("Success", `Authentification reuissi bienvenue Mr/Mme ${user?.name}`, "success", "center")
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'AppStacks' }],
                })
            } else {
                navigation.navigate("LoginScreen");
            }
        } catch (error) {
            console.log("error", error);
            navigation.navigate("LoginScreen");
        }
    }
    return (
        <View style={styles.container}>
            <StatusBar
                backgroundColor={useTheme().statusbar}
                barStyle={!isDarkMode() ? 'dark-content' : 'light-content'}
            />

            <Image
                source={ImageE2} // Remplacez par le chemin de votre image
                style={styles.logo}
            />


            <View style={styles.boxContainerCenter}>
                <View style={{ backgroundColor: theme.primaryBackground, width: "80%", borderRadius: 20, paddingBottom: 10, paddingHorizontal: 10 }}>

                    <Image
                        source={logo} // Remplacez par le chemin de votre image
                        style={styles.logos}
                    />
                    <ActivityIndicator size={25} color={theme.primary} />

                    <Text style={{ textAlign: "center", ...Theme.fontStyle.montserrat.regular }}>Authentification en cours...</Text>
                </View>
            </View>
            <View style={styles.boxContainer}>

                <ActivityIndicator size={45} color={theme.primary} style={styles.loader} />

            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    boxContainer: {
        flex: 1,
        position: "absolute",
        justifyContent: "flex-end",
        alignItems: "center",
    },
    boxContainerCenter: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
    },
    boxContainersCenter: {
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
    },
    logo: {
        resizeMode: "cover",
        position: "relative",
        flex: 1,

    },
    logos: {
        resizeMode: "contain",
        position: "relative",
        height: 100,
        alignSelf: "center",
    },
    loader: {
        marginVertical: 20,
    },
    text: {
        color: '#0C0C0C',
        fontSize: 16,
    },
    subText: {
        color: '#3700FF',
        fontSize: 18,
    },
});
export default Welcome