import { Dimensions, StyleSheet } from 'react-native';
import Theme from "theme"
const { height, width } = Dimensions.get('window')

const dynamicStyles = (theme) => {
    return StyleSheet.create({
        container: {
            flexGrow: 1,
            backgroundColor: theme.primaryBackground,
            paddingHorizontal: 10,
        },
        content: {
            flex: 1,
            gap: 10,
            padding: 10,
            paddingBottom: 20,
            backgroundColor: theme.primaryBackground,
        },
        search: {
            backgroundColor: theme.gray3,
            ...Theme.fontStyle.inter.regular,
            fontSize: 19,
            justifyContent: "center",
            alignItems: "center",
            height: 50, marginVertical: 5,
        },
        searchInput: {
            ...Theme.fontStyle.inter.regular,
            fontSize: 14,
            justifyContent: "center",
            alignItems: "center",
        },
        item1: {
            padding: 15,
            marginVertical: 10,
            borderRadius: 10,
            backgroundColor: '#f9f9f9',
        },
        title: {
            fontSize: 14,
            ...Theme.fontStyle.inter.semiBold,
            color: theme.primaryText
        },
        selectedClasses: {
            marginVertical: 5,
            backgroundColor: theme.gray3,
            borderRadius: 10,
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center"
        },
        textField: {
            ...Theme.fontStyle.inter.regular,
            color: theme.primaryText
        },
        classRoomText: {
            fontSize: 14,
            paddingVertical: 3,
            ...Theme.fontStyle.inter.regular,
            color: theme.primaryText
        },
        emptyDataText: {
            fontSize: 12,
            paddingVertical: 3,
            ...Theme.fontStyle.inter.regular,
            color: theme.primaryText,
            textAlign: "center"
        },
        emptyData: {
            padding: 20,
            alignItems: "center"
        },
        item: {
            padding: 5,
            height: 35,
            paddingHorizontal: 10,
            marginHorizontal: 5,
            backgroundColor: "#ddd",
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",

        },
        selectedItem: {
            backgroundColor: "#007bff",
        },
        text: {
            color: theme.primaryText,
            fontSize: 14,
            ...Theme.fontStyle.inter.semiBold,
        },

        header: {
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
    });
};

export default dynamicStyles;
