import { Dimensions, I18nManager, Platform, StyleSheet } from 'react-native'
import { Theme } from 'utils';

const { height, width } = Dimensions.get('window')
const imageSize = height * 0.232
const photoIconSize = imageSize * 0.27
const windowWidth = Dimensions.get('window').width;
export default dynamicStyles = (theme) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.primaryBackground,
            paddingBottom: 75,
        },
        container1: {
            flex: 1,
            backgroundColor: theme.primaryBackground,
        },
        iconText: {
            padding: 10,
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
        deleteButton: {
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'transparent',
            padding: 15,
        },
        image: {
            width: 250,
            height: 150,
        },
        imageContainer10: {
            position: 'relative',
            flexWrap: 'wrap',
            margin: 5,
        },
        imageContainer10: {
            position: 'relative',
            flexWrap: 'wrap',
            margin: 5,
        },
        itemText: {
            padding: 10,
            fontSize: 16,
        },
        fieldTextstart: {
            alignContent: "center",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontSize: 16,
            paddingVertical: 3,
            ...Theme.fontStyle.montserrat.bold,
            color: theme.primaryText,
        },
        itemContainer: {
            flex: 1,
            flexDirection: "row",
            // backgroundColor: "gray",
            width: "100%",
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#ddd',
        },
        itemContainersa: {
            width: width,
            flexDirection: 'row', // Assurez-vous que les composants s'affichent horizontalement
            flexWrap: 'wrap',
            // flex-wrap: wrap,
        },
        loginContainer12: {
            flex: 1,

            backgroundColor: theme.gray,
            borderRadius: 25,
            padding: 12,
            marginTop: 10,
            marginEnd: 5,
            // marginBottom: 40,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        buttonContainers: {
            flexDirection: 'row', // Place les boutons côte à côte
            justifyContent: 'space-between', // Espace les boutons également
            margin: 10,
            width: "100%"
        },
        content: {
            paddingHorizontal: 20,
            marginVertical: 20,
        },
        loginTexts: {
            color: theme.primaryText,

            fontSize: 14,
            ...Theme.fontStyle.montserrat.semiBold,
            letterSpacing: 1,
        },
        loginContainer: {
            flex: 1,
            // width:"100%",
            backgroundColor: theme.primary,
            borderRadius: 25,
            padding: 12,
            marginTop: 10,
            // marginBottom: 40,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
        },
        loginText: {
            color: theme.buttonTextColor,
            fontSize: 14,
            ...Theme.fontStyle.montserrat.semiBold,
            letterSpacing: 1,
        },
    })
}
