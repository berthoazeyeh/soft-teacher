import { StyleSheet } from 'react-native';
import Theme from "theme"

const dynamicStyles = (theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: theme.primaryBackground,
        },
        content: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: theme.primaryBackground,
        },
        itemContainer: {
            marginBottom: 10,
            padding: 10,
            margin: 10,
            // borderWidth: 1,
            backgroundColor: theme.gray3,
            borderRadius: 10
        },
        title: {
            fontSize: 16,
            color: theme.primaryText,
            ...Theme.fontStyle.inter.bold,
        },
        name: {
            fontSize: 14,
            color: theme.primaryText,
            ...Theme.fontStyle.inter.regular,

        },
        date: {
            fontSize: 13,
            color: theme.primary,
            ...Theme.fontStyle.inter.regular,

        },
    });
};

export default dynamicStyles;
