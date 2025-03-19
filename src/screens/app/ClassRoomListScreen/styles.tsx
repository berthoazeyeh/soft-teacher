import { StyleSheet } from 'react-native';
import Theme from "theme"

const dynamicStyles = (theme: any, isSelected: any) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            backgroundColor: theme.primaryBackground,
        },
        content: {
            flex: 1,
            backgroundColor: theme.primaryBackground,
        },
        etiquettesItem: {
            borderEndEndRadius: 20,
            borderTopEndRadius: 20,
            borderBottomRightRadius: 20,
            borderBottomLeftRadius: 20,
            backgroundColor: theme.primary,
            width: 22,
            height: 22,
            position: "absolute",
            alignContent: "center",
            alignItems: "center"
        },
        classRoomText: {
            fontSize: 16,
            paddingVertical: 3,
            ...Theme.fontStyle.inter.bold,
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
            marginBottom: 10,
            paddingHorizontal: 10,
            // paddingVertical: 10,
            backgroundColor: 'lightblue',
        },
        etiquettesItem2: {
            right: 0,
            borderTopRightRadius: 10,
            position: "absolute",
            alignContent: "center",
            alignItems: "center",
            backgroundColor: isSelected ? "#4B7895" : theme.primaryText,
        },
        header: {
            backgroundColor: 'skyblue',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden', // Prevents content from showing outside bounds
        },
        itemContainer: {
            zIndex: 1,
            marginBottom: 5,
            padding: 10,
            margin: 10,
            elevation: 1,
            paddingHorizontal: 15,
            backgroundColor: theme.gray3,
            borderEndEndRadius: 10,
            borderTopEndRadius: 10,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            borderWidth: isSelected ? 1.5 : 0,
            borderColor: isSelected ? "#4B7895" : "white",
        },
        logo: {
            position: "relative",
            flex: 1,
            width: "100%",
            marginVertical: 5

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
        containerWrap: {
            marginTop: 0,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: "center",
            alignItems: "center"
        },
        item: {
            backgroundColor: 'lightblue',
            paddingHorizontal: 10,
            paddingVertical: 3,
            marginHorizontal: 5,
            marginVertical: 3,
            borderRadius: 25,
        },
        title: {
            flex: 1,
            fontSize: 18,
            ...Theme.fontStyle.inter.bold,
            color: "black",
            overflow: "hidden"
        },
        name: {
            fontSize: 16,
            color: "black",

        },
        date: {
            fontSize: 14,
            color: '#666',
        },
        liveTrackButtom: {
            marginTop: 7,
            backgroundColor: theme.primary,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 25,
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 0
        },
        liveTrackButtomText: {
            color: theme.secondaryText,
            ...Theme.fontStyle.inter.semiBold,
        },
        TitleContainer: {
            flex: 1,
            marginTop: 10,
            marginLeft: 20,
            marginRight: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingBottom: 5
        },
        etiquettesItemText: {
            ...Theme.fontStyle.inter.blackItalic,
            color: theme.secondaryText,
        },
        etiquettesItemText2: {
            paddingHorizontal: 10,
            paddingVertical: 1,
            fontSize: 12,
            ...Theme.fontStyle.inter.semiBold,
            color: theme.secondaryText,
        },
        fieldText: {
            fontSize: 16,
            paddingVertical: 3,
            ...Theme.fontStyle.inter.bold,
            color: theme.primaryText,
        },
    });
};

export default dynamicStyles;
