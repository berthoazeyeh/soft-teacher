import { Dimensions } from 'react-native';
import { StyleSheet } from 'react-native';
import Theme from "theme"
const windowWidth = Dimensions.get('window').width;

const dynamicStyles = (theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.primaryBackground,
        },
        content: {
            flex: 1,
            backgroundColor: theme.primaryBackground,
            padding: 10,
        },
        picker: {
            height: 50,
            width: "89%",

        },
        pickerItemStyle: { color: "black", ...Theme.fontStyle.inter.bold },
        pickerItemStyle1: { color: "#4B7895", ...Theme.fontStyle.inter.bold, },
        column: {
            justifyContent: 'space-between',
        },
        item: {
            backgroundColor: '#f9c2ff',
            paddingTop: 10,
            paddingBottom: 20,
            paddingHorizontal: 20,
            height: 150,
            marginVertical: 8,
            marginHorizontal: 8,
            borderRadius: 15,
            width: (windowWidth - 30) / 2,
        },
        itemText: {
            fontSize: 14,
            color: theme.secondaryText,
            paddingHorizontal: 5,
            paddingVertical: 5,
            textAlign: 'center',
            ...Theme.fontStyle.inter.regular
        },
        itemTextlabels: {
            fontSize: 14,
            color: theme.secondaryText,
            paddingHorizontal: 5
        },
        header: {
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginBottom: 10,
            backgroundColor: theme.gray3,
            margin: 8,
            marginVertical: 10,
            borderRadius: 5,
            elevation: 4,
        },
        profil: {
            padding: 5,
            marginLeft: 15,
            backgroundColor: theme.gray3,
            borderRadius: 10,
            // marginHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 5,
        },
        paginationContainer: {
            flexDirection: 'row',
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 10
        },
        paginationContent: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginVertical: 20,
        },
        pageButton: {
            padding: 5,
            paddingHorizontal: 10,
            marginHorizontal: 5,
            borderRadius: 20,
            backgroundColor: '#f0f0f0',
        },
        selectedPageButton: {
            backgroundColor: '#007BFF',
        },
        pageText: {
            color: '#000',
        },
        selectedPageText: {
            color: theme.primaryText,
            ...Theme.fontStyle.inter.regular

        },
    });
};

export default dynamicStyles;
