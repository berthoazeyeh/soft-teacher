import { Dimensions, StyleSheet } from 'react-native';
import Theme from "theme"
const { height, width } = Dimensions.get('window')

const dynamicStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.primaryBackground,
        },
        headerContainer: {
            backgroundColor: theme.secondary,
            paddingBottom: 10,
            // paddingHorizontal: 10,
            elevation: 4,
            // borderWidth: 1.5,
            justifyContent: 'space-between',
            // borderColor: '#434343'
        },
        value: {
            fontSize: 14,
            marginRight: 10,
            textAlign: "center",
            alignSelf: "center",
            flex: 1,
            ...Theme.fontStyle.inter.bold,
            color: theme.primaryText
        },
        value1: {
            fontSize: 14,
            textAlign: "center",
            alignSelf: "center",
            flex: 1,
            ...Theme.fontStyle.inter.bold,
            color: theme.primaryText
        },
        content: {
            padding: 10,
            flex: 1,
        },
        picker: {
            height: 40,
            flex: 1,
        },
        profil: {
            padding: 3,
            marginLeft: 10,
            backgroundColor: theme.gray3,
            borderRadius: 10,
            // marginHorizontal: 10,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 1,
        },
        headers: {
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            marginBottom: 10,
            backgroundColor: theme.gray3,
            borderRadius: 1,
        },
        pickerItemStyle: { color: "black", ...Theme.fontStyle.inter.semiBold, fontSize: 13, },
        header: {
            backgroundColor: 'skyblue',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden', // Prevents content from showing outside bounds
        },
        buttonLabel: {
            color: theme.secondaryText,
            fontSize: 20,
            ...Theme.fontStyle.inter.semiBold,
        },
        loginText: {
            color: theme.secondaryText,
            fontSize: 16,
            letterSpacing: 1.7,
            ...Theme.fontStyle.inter.bold,

        },
        error: {
            color: "red",
            fontSize: 12,
            marginBottom: 10,
        },
        textdanger1: {
            margin: 2,
            color: 'red',
            ...Theme.fontStyle.inter.italic,
            fontSize: 10
        },
        linearGradient: {
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
        },
        titleContainer: {
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
            justifyContent: "space-between",
            backgroundColor: theme.primaryBackground,


        },
        text: {
            color: theme.primaryText,
            paddingVertical: 10,
            fontSize: 18,
            ...Theme.fontStyle.inter.bold,
        },

        scrollViewContent: {
            height: "40%",
            // flex: 1,
            flexGrow: 1, // Permet au ScrollView de prendre toute la hauteur
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
            marginBottom: 5,

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
        inputContainerC: {
            marginTop: 10,
            borderRadius: 10,
            padding: 2,
            width: '100%',
            paddingHorizontal: 10
        },
        fabStyle: {
            bottom: 16,
            right: 16,
            backgroundColor: theme.primary,
            position: 'absolute',

            color: theme.secondaryText
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
        headerTimeConatiner: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
            paddingHorizontal: 10,
            // paddingVertical: 10,
            backgroundColor: theme.primaryBackground,
        },
        modalBackground: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fond transparent
        },
        listContainer: {
            alignItems: 'flex-start',
            marginBottom: 20,
        },
        checkboxContainer: {
            width: "100%",
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5,
        },
        titleText: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 15,
        },
        closeButton: {
            alignSelf: "flex-end",
            backgroundColor: '#e74c3c',
            borderRadius: 5,
            paddingHorizontal: 20,
            paddingVertical: 10,
        },
        closeButtonText: {
            color: 'white',
            fontSize: 18,
        },
        // modal


        modalContent: {
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: -5,
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
        item: {
            paddingRight: 5,
            paddingVertical: 3,
            marginVertical: 3,
            fontSize: 16,
            borderRadius: 25,
        },
        containerWrap: {
            marginBottom: 7,
            flexDirection: 'row',
            // flexWrap: 'wrap',
            paddingHorizontal: 10,
            alignItems: "center"
        },
        modalcontainerText: {
            fontSize: 18,
            color: theme.primary,
            textAlign: "center",
            ...Theme.fontStyle.inter.italic,
            paddingTop: 10, paddingHorizontal: 0,
        },
        modalcontainerText1: {
            fontSize: 16,
            color: theme.primaryText,
            textAlign: "center",
            ...Theme.fontStyle.inter.italic,
            paddingTop: 5, paddingHorizontal: 0,
        },
        input: {
            borderColor: '#ccc',
            borderWidth: 1,
            alignItems: "center",
            flex: 1,
            borderRadius: 5,
            height: 50,
            textAlign: "right",
            paddingHorizontal: 15,
            marginVertical: 20,
            fontSize: 20,
            color: theme.primaryText,
            backgroundColor: theme.gray,
            ...Theme.fontStyle.inter.bold
        },
        input1: {
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 10,
            borderRadius: 5,
            fontSize: 16,
            ...Theme.fontStyle.inter.bold,
            marginTop: 5,
            width: '100%',


        },
        InputContainers: {
            width: '100%',
            flexDirection: 'row',
            alignItems: "center",
            marginVertical: 1,
            paddingHorizontal: 10,
        },
        noteTitle: {
            color: theme.primaryText,
            ...Theme.fontStyle.inter.bold,
            letterSpacing: 1,
            paddingRight: 10,
            paddingLeft: 10,
            textAlign: "center",
            fontSize: 20
        },
    });
};

export default dynamicStyles;
