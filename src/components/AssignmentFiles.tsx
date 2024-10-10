import { Alert, ScrollView, StyleSheet } from "react-native";
import { FlatList } from "react-native";
import { View } from "react-native";
import { Image, Text, TouchableOpacity } from "react-native";
import { useTheme } from "store";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Importez l'icône que vous souhaitez utiliser
import { Linking } from "react-native";
import { showCustomMessage, Theme } from "utils";

interface Props {
    items: any[];
    handleViewImages: (url: string) => void,

}


const AssignmentFiles = ({ items, handleViewImages }: Props) => {
    const theme = useTheme();

    const styles = style(theme);
    const handlePressUrl = async (url: string) => {
        try {


            const supported = await Linking.canOpenURL(url);
            await Linking.openURL(url);
        } catch (error: any) {
            Alert.alert(
                "Avertissement",
                error?.message,
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ],
                { cancelable: false }
            );
            console.log(error);
        }


    };
    const renderItem = ({ item, index }: any) => {
        if (item.mimetype === 'image/jpeg') {
            return (<>
                <TouchableOpacity style={styles.item} onPress={() => handleOpen(item.url)}>
                    <Image source={{ uri: item.url }} style={styles.image} />
                </TouchableOpacity>
                <View style={{ position: "absolute", right: 0, top: 5, justifyContent: "center", alignContent: "center", alignSelf: "center", alignItems: "center", backgroundColor: "blue", borderRadius: 20, paddingHorizontal: 5 }}>
                    <Text style={{ ...Theme.fontStyle.montserrat.bold, color: theme.secondaryText }}>{index + 1}</Text>
                </View>
            </>
            );
        } else {
            return (
                <>
                    <TouchableOpacity
                        key={item.code}
                        style={styles.itemContainer}
                        onPress={() => {
                            handlePressUrl(item?.url)
                        }}>
                        <Text style={styles.iconText}><MaterialCommunityIcons name="file-pdf-box" size={44} color="#007aff" /></Text>
                        <Text style={styles.itemText}>{item.name}</Text>
                    </TouchableOpacity>
                    <View style={{ position: "absolute", right: 0, top: 5, justifyContent: "center", alignContent: "center", alignSelf: "center", alignItems: "center", backgroundColor: "blue", borderRadius: 20, paddingHorizontal: 5 }}>
                        <Text style={{ ...Theme.fontStyle.montserrat.bold, color: theme.secondaryText }}>{index + 1}</Text>
                    </View>
                </>
            );

        }
    };

    const handleOpen = (detail: any) => {
        handleViewImages(detail);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Documents de l'assignement</Text>
            <FlatList
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                data={items}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </View>
    );
};

const style = (theme: any) => StyleSheet.create({
    container: {
        marginVertical: 20,
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: theme.primaryText, textAlign: "center"
    },
    itemContainer: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: theme.gray3,
        alignItems: "center",
        padding: 10,
        marginVertical: 10,
        gap: 10,
        borderRadius: 10
    },
    iconText: {
        padding: 10,
    },

    itemText: {
        padding: 10,
        flex: 1,
        fontSize: 16,
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    image: {
        width: "100%",
        height: 250,
        resizeMode: "cover",
        borderRadius: 10,
        marginRight: 15,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 5,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
    },
});

export default AssignmentFiles