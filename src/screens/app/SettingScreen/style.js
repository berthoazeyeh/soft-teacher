import { StyleSheet } from 'react-native';
import { BLACK, PRIMARY } from 'utils/constants/colors';
import Theme from "theme"

const dynamicStyles = (theme) => {
    return StyleSheet.create({
        container1: {
            flex: 1,
            backgroundColor: theme.primaryBackground,
        },
        button: {
            width: "100%",
            marginVertical: 10,
            padding: 15,
            borderRadius: 10,
            flexDirection: "row",
            alignItems: "center",
            elevation: 2,
            zIndex: 2,
            backgroundColor: theme.primaryBackground

        },
        primaryText: {
            fontSize: 14,
            letterSpacing: 1,
            ...Theme.fontStyle.inter.semiBold,
            color: theme.primaryText
        },
        icon: {
            width: 32,
            height: 32,
            // width: 40,
            // height: 40,
            marginRight: 10,
            color: theme.primary,
            resizeMode: "center"
        }
    });
};

export default dynamicStyles;
