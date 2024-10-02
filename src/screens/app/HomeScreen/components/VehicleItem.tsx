import { Image, Text, TouchableOpacity, View } from "react-native"
import dynamicStyles from "../style";
import { useTheme } from "store";
import { bus, getRandomColor, profils, Theme } from "utils";

const VehicleItem = ({ item, I18n, index, navigation }: any): React.JSX.Element => {
    const theme = useTheme()
    const styles = dynamicStyles(theme)

    const handleGotoLive = (item: any) => {
        navigation.navigate("DashBoardScreen", {
            item
        });
    };


    return <View style={styles.itemContainer}>
        <View style={styles.etiquettesItem}>
            <Text style={styles.etiquettesItemText}>{index + 1}</Text>
        </View>
        <TouchableOpacity onPress={() => handleGotoLive(item)}>
            <View style={{ flexDirection: "row", gap: 20 }}>
                <View
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 50,
                        backgroundColor: getRandomColor(),
                        borderColor: theme.gray2,
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                >
                    <Text style={{ color: theme.secondaryText, fontSize: 40 }}>#</Text>
                </View>
                <View style={{ gap: 5, flex: 1 }}>
                    <Text style={styles.title}>{item.name} </Text>
                    <View style={styles.containerWrap}>
                        <Text style={{ color: theme.primaryText, ...Theme.fontStyle.montserrat.semiBold }}>Cours:</Text>
                        {item?.cours?.map((item: any, index: number) => <View key={index + item} style={styles.item}>
                            <Text style={{ color: theme.primaryText, ...Theme.fontStyle.montserrat.semiBold }}>{item}</Text>
                        </View>
                        )}
                    </View>

                </View>
            </View>


        </TouchableOpacity>

    </View>
}

export default VehicleItem;
