import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Checkbox, Divider, Menu, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from 'utils';
import { I18n } from 'i18n';
import { MyMenu } from 'screens/app/HomeScreen/components/Header';

const Header = ({ title, onLogoutPressed, theme, visible, setVisible,navigation }) => {

    return (
        <View style={styles(theme).header}>
            <Text style={styles(theme).headerText}>{title}</Text>
                                        <MyMenu theme={theme} styles={styles} navigation={navigation} onLogoutPressed={onLogoutPressed}/>
            
           
        </View>
    );
};

const styles = (theme) => StyleSheet.create({
    header: {
        backgroundColor: theme.primaryBackground,
        flexDirection: 'row',
        alignItems: 'center', justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingVertical: 0,
        borderBottomColor: "white",
        borderBottomWidth: 1,
        elevation: 10,
        zIndex: 1,
        height: 45,
        width: "100%",
    },
    headerleft: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderColor: '#fff',
        borderRadius: 5,
        flexDirection: 'row',

    },
    headerText: {
        fontSize: 18,
        color: theme.primaryText,
        ...Theme.fontStyle.inter.semiBold
    },

    icon: {
        paddingLeft: 5,
        marginRight: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around",
        paddingHorizontal: 1,
        paddingVertical: 8,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: theme.primaryText,
        ...Theme.fontStyle.inter.regular,
    },

});

export default Header;
