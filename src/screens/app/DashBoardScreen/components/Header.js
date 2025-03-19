import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, Checkbox, Divider, Menu, Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Theme } from 'utils';
import { I18n } from 'i18n';

const Header = ({ title, onLogoutPressed, theme, visible, setVisible }) => {

    return (
        <View style={styles(theme).header}>
            <Text style={styles(theme).headerText}>{title}</Text>

            <Menu
                visible={visible}
                onDismiss={() => { setVisible(false) }}
                style={{ width: '50%' }}
                contentStyle={{ backgroundColor: theme.primaryBackground, }}
                anchor={
                    <TouchableOpacity onPress={setVisible}>
                        <MaterialCommunityIcons
                            name="more"
                            size={27}
                            color={theme.primaryText}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                }
            >
                <Menu.Item style={{ alignSelf: "center" }} titleStyle={{
                    fontWeight: "bold", textAlign: "center", color: theme.primaryText,
                    ...Theme.fontStyle.inter.regular,
                }} onPress={() => { }} title={I18n.t('more')} />


                <Divider />
                <TouchableOpacity style={styles(theme).menuItem}
                    onPress={() => onLogoutPressed(true)}
                >
                    <MaterialCommunityIcons
                        name="cog"
                        size={27}
                        color={theme.primaryText}
                        style={styles(theme).icon}
                    />
                    <Text style={styles(theme).menuText}>{I18n.t('settings')}</Text>
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity style={styles(theme).menuItem}
                    onPress={() => onLogoutPressed(false)}
                >
                    <MaterialCommunityIcons
                        name="logout"
                        size={27}
                        color={theme.primaryText}
                        style={styles(theme).icon}
                    />
                    <Text style={styles(theme).menuText}>{I18n.t('logout')}</Text>
                </TouchableOpacity>
            </Menu>
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
