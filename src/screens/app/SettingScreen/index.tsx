/**
 * Settings component
 * @module Settings
 */

import React, { Component } from "react";
import { Text, View, Image, Switch, TouchableOpacity, BackHandler, Alert } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import whitPropsAll from "./whitPropsAll";
import dynamicStyles from "./style";
import { Header } from "components";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { clearUserStored, updateSyncing } from "store";
import { clearCustomTables } from "apis/database";
import { useDispatch } from "react-redux";

interface Props {
    navigation: any;
    I18n: any;
    theme: any;
    dispatch: any;
    isDarkMode: boolean;
    onThemeChange: (isDarkMode: boolean) => void;
}

interface State {
    changeTheme: boolean;

}

/**
 * Setting component
 */
class SettingsScreen extends Component<Props, State> {
    private backHandler: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            changeTheme: props.isDarkMode || false,
        };
    }

    componentDidMount() {
        const { isDarkMode } = this.props;
        this.setState({ changeTheme: isDarkMode });
        this.backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            this.handleBackPress
        );
    }
    handleBackPress = (): boolean => {
        this.props.navigation.navigate("HomeBottomTabNavigation")
        return false;
    };
    componentWillUnmount() {
        // Nettoyer l'écouteur lorsqu'il n'est plus nécessaire
        this.backHandler.remove();
    }
    /**
     * @function handleScreenRedirection
     * @summary Function triggered on click of buttons
     */
    handleScreenRedirection = (routeName: string) => {
        this.props.navigation.navigate(routeName);
    };

    /**
     * @function changeTheme
     * @summary Function triggered on click of dark mode
     */
    changeTheme = () => {
        this.setState(
            (prevState) => ({ changeTheme: !prevState.changeTheme }),
            () => {
                this.props.onThemeChange(this.state.changeTheme);
            }
        );
    };

    render() {
        const { I18n, theme, navigation, dispatch } = this.props;
        const { changeTheme } = this.state;
        const {
            screenTitle,
            accountTitle,
            mapStylingTitle,
            privacyTitle,
            languageTitle,
            darkModeSwitch,
        } = I18n.t("SettingsScreen");
        const styles = dynamicStyles(theme);

        return (
            <View style={styles.container1}>
                <Header theme={theme} title={screenTitle} navigation={navigation} />
                <View style={{ flex: 1, marginHorizontal: 10, }}>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.button}

                        onPress={() => navigation.navigate("ProfileScreen")}
                    >
                        <Icon name="edit" size={30} style={styles.icon} />
                        <Text style={styles.primaryText}>{accountTitle}</Text>
                    </TouchableOpacity>

                    {/* <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.button}
                    onPress={() => navigation.navigate("MapSettings")}
                    >
                    <Icon name="map" size={24} style={styles.icon} />
                    <Text style={styles.primaryText}>{mapStylingTitle}</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.button}
                        // disabled={true}
                        onPress={() => this.handleScreenRedirection("PrivacySettings")}
                    >
                        <Icon name="privacy-tip" size={30} style={styles.icon} />
                        <Text style={styles.primaryText}>{privacyTitle}</Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.button}
                        onPress={() => this.handleScreenRedirection("LanguageSettings")}
                    >
                        <Icon
                            size={30}
                            name="language"
                            color={theme.primary}
                            style={{ marginRight: 15, marginLeft: 4 }}
                        />
                        <Text style={styles.primaryText}>{languageTitle}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={this.changeTheme}>
                        <Switch
                            value={changeTheme}
                            trackColor={{ true: theme.primary, false: "#ccc" }}
                            thumbColor={theme.primary}
                            onValueChange={this.changeTheme}
                        />
                        <Text style={styles.primaryText}>{darkModeSwitch}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.button}
                        onPress={async () => {
                            dispatch(clearUserStored(null))
                            await clearCustomTables(["users", "notifications", "faculty_attendances", "student_subject", "student_classroom", "assignment_types", "assignment_types", "assignments", "assignment_rooms", "attendanceLine", "students", "sessions", "classrooms", "faculty_attendances"]);

                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'AuthStacks' }],
                            });
                            dispatch(updateSyncing(true))
                            console.log("log out");
                        }}
                    >
                        <MaterialCommunityIcons name="database-alert-outline" size={24} style={styles.icon} />
                        <Text style={styles.primaryText}>{'Netoyer mes données'}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={styles.button}
                        onPress={async () => {
                            dispatch(clearUserStored(null))
                            // await clearCustomTables(["users", "student_subject", "student_classroom", "assignment_types", "assignment_types", "assignments", "assignment_rooms", "attendanceLine", "students", "sessions", "classrooms"]);

                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'AuthStacks' }],
                            });
                            dispatch(updateSyncing(true))
                            console.log("log out");
                        }}
                    >
                        <MaterialCommunityIcons name="logout" size={24} style={styles.icon} />
                        <Text style={styles.primaryText}>{I18n.t('logout')}</Text>
                    </TouchableOpacity>


                </View>
            </View>
        );
    }
}

export default whitPropsAll(SettingsScreen);
