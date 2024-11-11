import { Dimensions, StyleSheet } from 'react-native';
import Theme from "theme"
const { height, width } = Dimensions.get('window')

const dynamicStyles = (theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            padding: 3,
            backgroundColor: theme.primaryBackground,
        },
        discussContainer: {
            backgroundColor: theme.primaryBackground,
            paddingVertical: 10,
            paddingHorizontal: 5,
            marginHorizontal: 5,
            marginVertical: 8,
            borderRadius: 5,
            width: "95%",
            flexDirection: "row",
            elevation: 2,
        },
        avatar: {
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            width: 40,
            height: 40,
            borderRadius: 25,
            backgroundColor: theme.gray,
            borderWidth: 1,
            borderColor: theme.gray,
        },
        avatarImg: {
            borderRadius: 25,
            resizeMode: "cover",
            width: "100%",
            height: "100%",
        },
        content: {
            marginLeft: 10,
            marginRight: 10,
            flexDirection: "column",
            justifyContent: "space-around",
            flex: 1
        },
        title: {
            ...Theme.fontStyle.montserrat.bold,
            color: theme.primaryText,
            fontSize: 16,
            overflow: "hidden",
            flex: 1,
        },
        timesTitle: {
            ...Theme.fontStyle.montserrat.semiBold,
            color: theme.primary,
            fontSize: 14
        },
        headerContent: {
            gap: 5,
            flexDirection: "row",
            justifyContent: "space-between",
        },
        headerContentF: {
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 5,
            alignItems: "flex-end"
        },
        messagetitle: {
            overflow: "hidden",
            flex: 1,
            ...Theme.fontStyle.montserrat.regular,
            color: theme.gray4,
            fontSize: 13
        },
        unReadMessage: {
            ...Theme.fontStyle.montserrat.regular,
            color: theme.gray4,
            borderRadius: 15,
            paddingHorizontal: 5,
            paddingVertical: 2,
            backgroundColor: theme.gray,
            fontSize: 10
        },
        emptyDataText: {
            fontSize: 14,
            paddingVertical: 3,
            ...Theme.fontStyle.montserrat.semiBold,
            color: theme.primaryText,
            textAlign: "center"
        },
        emptyData: {
            padding: 20,
            alignItems: "center"
        },

    });
};

export default dynamicStyles;
