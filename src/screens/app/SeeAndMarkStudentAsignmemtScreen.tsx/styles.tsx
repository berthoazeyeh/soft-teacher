import { Dimensions, StyleSheet } from 'react-native';
import Theme from "theme"
const { height, width } = Dimensions.get('window')

const dynamicStyles = (theme: any) => {
    return StyleSheet.create({
        container: {
            flexGrow: 1,

            backgroundColor: theme.primaryBackground,
        },
        content: {
            flex: 1,
            paddingVertical: 10,
            paddingHorizontal: 15,
            backgroundColor: theme.primaryBackground,
        },

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
            fontSize: 22

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
        noteTitle: {
            color: theme.primaryText,
            ...Theme.fontStyle.inter.bold,
            letterSpacing: 1,
            paddingRight: 10,
            paddingLeft: 10,
            textAlign: "center",
            fontSize: 20
        },
        input: {
            borderColor: '#ccc',
            borderWidth: 1,
            alignItems: "center",
            flex: 1,
            borderRadius: 5,
            textAlign: "right",
            paddingHorizontal: 10,
            marginVertical: 10,
            fontSize: 20,
            color: theme.primaryText,
            backgroundColor: theme.gray,
            ...Theme.fontStyle.inter.bold
        },
        InputContainers: {
            width: '100%',
            flexDirection: 'row',
            alignItems: "center",
            marginVertical: 15,
            paddingHorizontal: 10,
        },
        headerContainer: {
            backgroundColor: theme.gray,
            paddingTop: 10,
            marginTop: 10,
            padding: 10,
            alignItems: 'center',
            width: '100%',
            borderRadius: 15,
            gap: 20,

        },
        headerContents: {
            gap: 20,
            width: '100%',

            flexDirection: 'row',

        },
        docContainer: {
            backgroundColor: theme.gray,
            marginTop: 10,

            padding: 10,

            alignItems: 'center',
            width: '100%',
            borderRadius: 15,
            gap: 20
        },

        headerBar: {
            width: 10,
            marginLeft: 10,
            height: "100%",
            backgroundColor: theme.primary,
        },
        headerContent: {
            flexDirection: "column",
        },
        subjectName: {
            fontSize: 18, color: theme.primary, ...Theme.fontStyle.inter.semiBold,
        },
        itemTitle: {
            fontSize: 18, color: theme.primaryText, ...Theme.fontStyle.inter.bold,
            paddingTop: 20, paddingHorizontal: 0,
        },
        taskContainer: {},
        taskContainerText: {
            fontSize: 18,
            color: theme.primaryText,
            ...Theme.fontStyle.inter.regular,
            paddingTop: 20, paddingHorizontal: 0,
        },
        modalcontainerText: {
            fontSize: 16,
            color: theme.primary,
            textAlign: "center",
            ...Theme.fontStyle.inter.italic,
            paddingTop: 10, paddingHorizontal: 0,
        },
        classeName: {
            fontSize: 14, color: theme.primaryText, ...Theme.fontStyle.inter.regular,
        },

        textLab: {
            fontSize: 14, color: theme.primaryText, ...Theme.fontStyle.inter.regular,

        },
        textVal: {
            fontSize: 16, color: theme.primaryText, ...Theme.fontStyle.inter.bold,

        },






        // Documents styles

        header: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 10,
            color: theme.primaryText, textAlign: "center"
        },
        itemContainer: {
            flexDirection: "row",
            backgroundColor: theme.gray3,
            alignItems: "center",
            padding: 10,
            marginVertical: 10,
            gap: 10,
            borderRadius: 10
        },
        iconText: {
            padding: 0,
        },

        itemText: {
            padding: 10,
            flex: 1,
            fontSize: 16,
        },
        item: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 5,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#ccc',
        },
        image: {
            width: "100%",
            height: 250,
            resizeMode: "cover",
            borderRadius: 10,
            marginRight: 15,
        },
        button: {
            backgroundColor: '#007bff',
            padding: 5,
            borderRadius: 5,
        },
        buttonText: {
            color: '#fff',
        },
    });
};

export default dynamicStyles;
