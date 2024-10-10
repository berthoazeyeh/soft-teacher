import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { Theme } from 'utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Header = ({ title, theme, navigation }) => {

    return (
        <View style={styles(theme).header}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
            >
                <MaterialCommunityIcons
                    name="arrow-left" size={27} color={theme.primaryText}
                    style={styles(theme).icon}
                />
            </TouchableOpacity>
            <Text style={styles(theme).headerText}>{title}</Text>
        </View>
    );
};

const styles = (theme) => StyleSheet.create({
    header: {
        gap: 20,
        backgroundColor: theme.primaryBackground,
        flexDirection: 'row',
        alignItems: 'center', justifyContent: "flex-start",
        paddingHorizontal: 15,
        paddingVertical: 0,
        elevation: 10,
        zIndex: 1,
        height: 45,
        width: "100%",
    },

    headerText: {
        fontSize: 18,
        width: "100%",
        color: theme.primaryText,
        ...Theme.fontStyle.montserrat.bold,

    },


});

export default Header;
