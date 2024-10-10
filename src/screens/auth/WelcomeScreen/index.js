import { useEffect } from "react";
import { StatusBar, StyleSheet, View } from "react-native";
import { ActivityIndicator, Image, Text } from "react-native"
import { isDarkMode, updateUserStored, useCurrentUser, useTheme } from "store";
import { ImageE2, logo, showCustomMessage, Theme } from "utils"
import { getDataM, LOCAL_URL } from "apis";
import { useDispatch } from "react-redux";
import { ThemeActionTypes } from "store/actions/ThemeAction";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";




const Welcome = (props) => {
    const theme = useTheme()
    const { navigation } = props
    const dispatch = useDispatch()
    const user = useCurrentUser();
    useEffect(() => {
        tryToLoginParents()
        // console.log("user------------", user);
    }, [navigation]);
    const scheme = useColorScheme();






    useEffect(() => {

        dispatch({ type: ThemeActionTypes.SET_SYSTEM_THEME, payload: scheme });

    }, [dispatch, scheme]);



    const tryToLoginParents = async () => {
        try {
            const user_Parent_Id = user?.id
            if (!user_Parent_Id) {

                navigation.navigate("LoginScreen");
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