import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { ClassRoomListScreen, HomeScreen } from 'screens'
import HomeBottomTabNavigation from './bottom';
import DashboadElementStacks from './dashboadElement';
import SettingsScreenStacks from './settings';
import DiscussStacks from './discuss';



export type AuthStackList = {
    HomeBottomTabNavigation: undefined;
    DashboadElementStacks: undefined;
    FleetAnalyticsDetails: undefined;
    DiscussStacks: undefined;
    MapSettings: undefined;
    SettingsScreenStacks: undefined;
    LanguageSettings: undefined;
    PrivacySettings: undefined;
    ReportsView: undefined;
    ReportsInfo: undefined;
    AllTrips: undefined;
    RoutesMap: undefined;
    ClassRoomListScreen: undefined;
    LiveScreen: { uniqueId: string, name: string, status: string, vehicleType: string }; // Ajoutez les paramètres ici
};
const AuthStack = createStackNavigator<AuthStackList>()

const AppStacks = () => {
    return (
        <AuthStack.Navigator
            screenOptions={{
                headerBackTitleVisible: false,
            }}
            initialRouteName="HomeBottomTabNavigation">

            <AuthStack.Screen
                options={{ headerShown: false }}
                name="HomeBottomTabNavigation"
                component={HomeBottomTabNavigation}
            />
            <AuthStack.Screen
                options={{ headerShown: false }}
                name="DashboadElementStacks"
                component={DashboadElementStacks}
            />
            <AuthStack.Screen
                options={{ headerShown: false }}
                name="SettingsScreenStacks"
                component={SettingsScreenStacks}
            />
            <AuthStack.Screen
                options={{ headerShown: false }}
                name="DiscussStacks"
                component={DiscussStacks}
            />
            <AuthStack.Screen
                options={{ headerShown: true }}
                name="ClassRoomListScreen"
                component={ClassRoomListScreen}
            />



        </AuthStack.Navigator>
    )
}



export default AppStacks
