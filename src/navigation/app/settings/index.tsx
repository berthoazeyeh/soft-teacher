import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { LanguageSettings, ProfileScreen, SettingsScreen } from 'screens';

export type SettingsList = {
    SettingsScreen: undefined;
    ProfileScreen: undefined;
    LanguageSettings: undefined;

};
interface Item {
    name: string;
    screen: React.ComponentType<any>;
    haveHeader?: boolean;
}

const elements: Item[] = [
    { name: "LanguageSettings", screen: LanguageSettings, haveHeader: false },
    { name: "ProfileScreen", screen: ProfileScreen, haveHeader: true },

];
const SettingsScreenStack = createStackNavigator<SettingsList>()

const SettingsScreenStacks = () => {
    return (
        <SettingsScreenStack.Navigator
            screenOptions={{
                headerBackTitleVisible: false,
            }}
            initialRouteName="SettingsScreen">
            <SettingsScreenStack.Screen
                options={{ headerShown: false }}
                name="SettingsScreen"
                component={SettingsScreen}
            />

            {
                elements.map((element) => <SettingsScreenStack.Screen
                    key={element.name}
                    options={{ headerShown: element.haveHeader }}
                    // @ts-ignore
                    name={element.name}
                    component={element.screen}
                />)
            }


        </SettingsScreenStack.Navigator>
    )
}



export default SettingsScreenStacks
