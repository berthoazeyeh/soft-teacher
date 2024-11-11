import { View, Text, Image, TouchableOpacity } from "react-native";
import dynamicStyles from "../style";
import { Theme } from "utils";
import { useState } from "react";
import { Divider, Menu } from "react-native-paper";
import { I18n } from "i18n";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface PropsType {
    theme: any;
    navigation: any;
    item: any;
    handlePressConverssation: (item: any) => void;
}
function Header({ theme, item, handlePressConverssation, navigation }: PropsType): React.JSX.Element {
    const styles = dynamicStyles(theme)
    const getMembers = () => {
        let membres = "";
        item?.members?.forEach((element: any) => {
            membres = membres + element?.name + ", ";
        });
        return membres;
    }
    return <TouchableOpacity style={styles.discussContainer}>
        <TouchableOpacity
            onPress={() => {
                navigation.goBack()
            }}>
            <MaterialCommunityIcons
                name="arrow-left-thin"
                size={30}
                color={theme.primaryText}
            /></TouchableOpacity>
        <View style={styles.avatar}>
            <Image style={styles.avatarImg} source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCM1mAVNdyXdpZlLKZKjQ2VV2sKU4f_tf8OPKaSFgRO28-VdrigCQaxay5hEWGIwmM5Ug&usqp=CAU' }} />
        </View>

        <View style={styles.content}>
            <View style={styles.headerContent}>
                <Text style={styles.title} numberOfLines={1}>
                    {item?.name}
                </Text>
                <MyMenu theme={theme} styles={styles} navigation={navigation} item={item} />
            </View>
            <TouchableOpacity style={styles.headerContentF}
                onPress={() => {
                    navigation.navigate("ChatMemberScreen", { members: item?.members })

                }}
            >
                <Text style={styles.messagetitle} numberOfLines={1}>
                    {getMembers()}
                </Text>
            </TouchableOpacity>
        </View>



    </TouchableOpacity>

}


const MyMenu = ({ theme, styles, navigation, item }: any) => {
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
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'AppStacks' }],
                    })
                    setVisible(false)
                }}
            >
                <MaterialCommunityIcons
                    name="home"
                    size={27}
                    color={theme.primaryText}
                    style={styles.icon}
                />
                <Text style={styles.menuText}> {"Acceuil"}</Text>
            </TouchableOpacity>
            <Divider />
            <TouchableOpacity style={styles.menuItem}
                onPress={() => {
                    navigation.navigate("ChatMemberScreen", { members: item?.members })

                    setVisible(false)

                }}
            >
                <MaterialCommunityIcons
                    name="account-group"
                    size={27}
                    color={theme.primaryText}
                    style={styles.icon}
                />
                <Text style={styles.menuText}> {"Membres"}</Text>
            </TouchableOpacity>
        </Menu>
    )
}

export default Header;