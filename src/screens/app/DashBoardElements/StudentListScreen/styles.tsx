import { Dimensions, StyleSheet } from 'react-native';
import Theme from "theme"
const { height, width } = Dimensions.get('window')

const dynamicStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.primaryBackground,
        },
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
        titleBottonSheet: {
            color: theme.primaryText,
            ...Theme.fontStyle.montserrat.bold,
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
            ...Theme.fontStyle.montserrat.semiBold,
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
        header: {
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        content: {
            padding: 10,
            flex: 1,
        },
        classRoomText: {
            fontSize: 14,
            paddingVertical: 3,
            ...Theme.fontStyle.inter.blackItalic,
            color: theme.primaryText
        },
        classRoomContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 10,
            backgroundColor: 'lightblue',
            gap: 3,
        },
        headerTimeConatiner: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 0,
            paddingHorizontal: 10,
            // paddingVertical: 10,
            backgroundColor: 'lightblue',
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
    });
};

export default dynamicStyles;
