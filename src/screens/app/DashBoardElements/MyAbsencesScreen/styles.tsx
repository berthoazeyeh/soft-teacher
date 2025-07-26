import { Dimensions, StyleSheet } from 'react-native';
import Theme from "theme"
const { height, width } = Dimensions.get('window')

const dynamicStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.primaryBackground,
        },
        content: {
            paddingTop: 10,
            paddingHorizontal: 10,
            flex: 1,
        },
        header: {
            backgroundColor: 'skyblue',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden', // Prevents content from showing outside bounds
        },
        modalContent: {
            justifyContent: 'flex-end',
            alignItems: 'center',
            marginBottom: -5,
            flex: 1,
        },
        modalContent1: {
            alignItems: 'center',
            flex: 1,
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
        modalView1: {
            backgroundColor: theme.primaryBackground,
            paddingVertical: 10,
            borderTopLeftRadius: 15,
            borderTopRightRadius: 15,
            width: width,
            height: height * 0.9,
            paddingHorizontal: 10,
        },
        scrollViewContent: {
            height: "40%",
            // flex: 1,
            flexGrow: 1, // Permet au ScrollView de prendre toute la hauteur
        },
        contentContainer: {
            marginTop: 5,
            flex: 1,
            alignItems: 'center',
            borderTopWidth: 1,
            borderTopColor: theme.gray,
            paddingVertical: 10,
            marginHorizontal: 1,

        },

        titleBottonSheet: {
            color: theme.primaryText,
            ...Theme.fontStyle.inter.bold,
            letterSpacing: 1,
            marginBottom: 5,
            paddingHorizontal: 20,
            // flex: 1,
            textAlign: "center",
            fontSize: 17

        },
        modalcontainerText: {
            fontSize: 16,
            color: theme.primary,
            textAlign: "center",
            ...Theme.fontStyle.inter.italic,
            paddingTop: 10, paddingHorizontal: 0,
        },
        viewBar: {
            width: 40,
            borderBottomWidth: StyleSheet.hairlineWidth * 4,
            borderBottomColor: theme.primaryText,
            borderRadius: 5,
            marginBottom: 10,

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
            backgroundColor: theme.primaryBackground,
            elevation: 2,
        },
        titleText: {
            fontSize: 14,
            ...Theme.fontStyle.inter.bold,
            marginBottom: 15,
            color: theme.primaryText,
            textAlign: "center"
        },
        itemTitleText: {
            fontSize: 14,
            ...Theme.fontStyle.inter.regular,
            marginBottom: 15,
            color: theme.primaryText,
            textAlign: "center"
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
            fontSize: 12,
        },
        startedButton: {
            // backgroundColor: theme.primary,
            borderRadius: 5,
            paddingHorizontal: 5,
            paddingVertical: 5,
            borderWidth: 1,
            borderColor: theme.primary,
            justifyContent: "center",
            alignItems: "center"
        },
        unStartedButton: {
            // backgroundColor: theme.primary,
            borderRadius: 5,
            paddingHorizontal: 5,
            paddingVertical: 5,
            borderWidth: 1,
            borderColor: theme.gray4,
            justifyContent: "center",
            alignItems: "center"
        },
        taskText: {
            fontSize: 11,

            ...Theme.fontStyle.inter.regular,
            color: theme.primaryText,
        },
    });
};

export default dynamicStyles;
