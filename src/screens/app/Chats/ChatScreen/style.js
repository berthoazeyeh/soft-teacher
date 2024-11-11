import { Dimensions, StyleSheet } from 'react-native';
import Theme from "theme"
const { height, width } = Dimensions.get('window')

const dynamicStyles = (theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.primaryBackground,
        },
        fileContainer: {
            padding: 3
        },
        fileText: {
            margin: 3,
            ...Theme.fontStyle.montserrat.regular,

        },
        chatFooter: {
            paddingVertical: 10,
            paddingHorizontal: 5,
            flexDirection: "row",
            width: "100%",
            backgroundColor: "gray",
        },
        buttonFooterChatImg: {
            backgroundColor: "lightblue",
            position: "absolute",
            left: 75,
            top: 0,
            backgroundColor: "lightblue",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 90
        },
        buttonFooterChat: {
            position: "absolute",
            right: 5,
            top: 0,
            backgroundColor: "lightblue",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 90
        },
        textFooterChat: {
            ...Theme.fontStyle.montserrat.bold,
            color: theme.primaryText,
        },
        discussContainer: {
            marginHorizontal: 10,
            marginVertical: 15,
            width: "97%",
            flexDirection: "row",
            alignItems: "center",
            elevation: 2,
        },
        avatar: {
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
            color: theme.primaryText,
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
            ...Theme.fontStyle.montserrat.semiBold,
            color: theme.gray4,
            fontSize: 12
        },
        menuItem: {
            flexDirection: 'row',
            alignItems: 'center',
            width: "100%",
            marginLeft: 10,
            gap: 10,
            justifyContent: "center",
            paddingHorizontal: 1,
            paddingVertical: 8,
        },
        menuText: {
            flex: 1,
            fontSize: 16,
            color: theme.primaryText,
            ...Theme.fontStyle.montserrat.semiBold,
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
