import { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useCurrentUser, useTheme } from "store";
import dynamicStyles from "./style";
import { I18n } from "i18n";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useSWR from "swr";
import { getData, LOCAL_URL, postData } from "apis";
import useSWRMutation from "swr/mutation";
import DiscussItem from "./components/DiscussItem";
import { Theme } from "utils";
import { Divider, Menu } from "react-native-paper";


function ChatMemberScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { members } = route.params
    const theme = useTheme()
    const styles = dynamicStyles(theme)

    const user = useCurrentUser();
    console.log(members);





    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitleStyle: {
                color: theme.primary,
                ...Theme.fontStyle.montserrat.semiBold,
                alignItems: "center"

            },
            title: "Membres de la discursion"
        })



    }, []);

    const handlePressConverssation = (item: any) => {
        navigation.navigate('ChatScreen', { channel: item });
        console.log(item);

    }

    return <View style={styles.container}>

        <Divider />

        <FlatList
            data={members}
            renderItem={({ item, index }) =>
                <DiscussItem
                    handlePressConverssation={handlePressConverssation}
                    theme={theme}
                    navigation={navigation}
                    item={item}
                />}
            keyExtractor={(item, index) => (index).toString()}
        />



    </View>

}



const MyMenu = ({ theme, styles, navigation }: any) => {
    const [visible, setVisible] = useState(false)
    return (
        <Menu
            visible={visible}
            onDismiss={() => { setVisible(false) }}
            style={{ width: '50%' }}
            contentStyle={{ backgroundColor: theme.primaryBackground, }}
            anchor={
                <TouchableOpacity onPress={() => setVisible(true)} style={{ marginRight: 10 }}>
                    <MaterialCommunityIcons
                        name="dots-vertical"
                        size={27}
                        color={theme.primaryText}
                        style={styles.icon}
                    />
                </TouchableOpacity>}>
            <Menu.Item style={{ alignSelf: "center" }} titleStyle={{
                fontWeight: "bold", textAlign: "center", color: theme.primaryText,
                ...Theme.fontStyle.montserrat.regular,
            }} onPress={() => { }} title={I18n.t('more')} />

            <Divider />
            <TouchableOpacity style={styles.menuItem}
                onPress={() => {
                    navigation.navigate("SettingsScreen")
                    setVisible(false)
                }}
            >
                <MaterialCommunityIcons
                    name="cog"
                    size={27}
                    color={theme.primaryText}
                    style={styles.icon}
                />
                <Text style={styles.menuText}> {I18n.t('settings')}</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity style={styles.menuItem}
                onPress={() => { }}
            >
                <MaterialCommunityIcons
                    name="logout"
                    size={27}
                    color={theme.primaryText}
                    style={styles.icon}
                />
                <Text style={styles.menuText}> {I18n.t('logout')}</Text>
            </TouchableOpacity>
        </Menu>
    )
}

export default ChatMemberScreen;