import { Dimensions, StyleSheet } from 'react-native';
import Theme from "theme"
const { height, width } = Dimensions.get('window')

const dynamicStyles = (theme) => {
    return StyleSheet.create({
        container: {
            flexGrow: 1,

            backgroundColor: theme.primaryBackground,
        },
        content: {
            flex: 1,
            gap: 10,
            padding: 10,
            paddingBottom: 20,
            backgroundColor: theme.primaryBackground,
        },
        picker: {
            height: 50,
            width: "89%",

        },
        dateInput: {
            height: 50,
            borderColor: '#ccc',
            flexDirection: "row",
            alignItems: "center",
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            marginVertical: 5,
            backgroundColor: '#fff',
        },
        dateText: {
            color: theme.primaryText,
            fontSize: 16,
            ...Theme.fontStyle.inter.regular
        },
        input: {
            borderColor: '#ccc',
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 10,
            marginBottom: 10,
            color: theme.primaryText,
            backgroundColor: theme.primaryBackground,
            ...Theme.fontStyle.inter.bold
        },
        textdanger1: {
            margin: 2,
            color: 'red',
            ...Theme.fontStyle.inter.italic,
            fontSize: 10,
            marginLeft: 10,
        },
        profil: {
            padding: 5,
            marginLeft: 15,
            backgroundColor: theme.gray3,
            borderRadius: 10,
            // marginHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 3,
        },
        header: {
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginBottom: 10,
            backgroundColor: theme.gray3,
            borderRadius: 10,
        },
        pickerItemStyle: { color: "black", ...Theme.fontStyle.inter.semiBold },
        modalContent: {
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: -5,
        },
        fabStyle: {
            bottom: 16,
            right: 16,
            backgroundColor: theme.primary,
            position: 'absolute',

            color: theme.secondaryText
        },
        modalView: {
            backgroundColor: theme.primaryBackground,
            paddingVertical: 10,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            width: width,
            height: height * 0.5,
            paddingHorizontal: 10,
        },
        contentContainer: {
            flex: 1,
            alignItems: 'center',
            //marginHorizontal:15,

        },
        titleBottonSheet: {
            color: theme.primaryText,
            ...Theme.fontStyle.inter.bold,
            letterSpacing: 1,
            marginBottom: 15,
            paddingHorizontal: 20,
            flex: 1,
            textAlign: "center",
            fontSize: 17

        },
        viewBar: {
            width: 40,
            borderBottomWidth: StyleSheet.hairlineWidth * 4,
            borderBottomColor: theme.primaryText,
            borderRadius: 5,
            marginBottom: 20,

        },
        emptyDataText: {
            fontSize: 14,
            paddingVertical: 3,
            ...Theme.fontStyle.inter.semiBold,
            color: theme.primaryText,
            textAlign: "center"
        },
        emptyData: {
            padding: 20,
            alignItems: "center"
        },
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 10,
            padding: 2,
            width: '50%',
        },
        inputContainerP: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: "space-around",
            borderWidth: 1,
            borderColor: theme.gray,
            marginBottom: 5,
            borderRadius: 10,
            paddingHorizontal: 10,
            padding: 2,
            width: '100%',
        },
        icon: {
            marginRight: 0,
            color: theme.primaryText,
        },


    });
};

export default dynamicStyles;
