import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; // Import de MaterialCommunityIcons
import { Badge } from 'react-native-paper';
import { useNotificationCount, useTheme } from 'store';
import { DashBoardScreen, HomeScreen, NotificationScreen } from 'screens';

const Tab = createBottomTabNavigator();





const HomeBottomTabNavigation = () => {
    const [badgeCount, setBadgeCount] = useState(40);
    const theme = useTheme()
    return (
        <Tab.Navigator
            initialRouteName="HomeScreen"
            tabBarPosition="bottom"
            screenOptions={{
                tabBarActiveTintColor: "green",
                tabBarInactiveTintColor: theme.primaryText,
                tabBarGap: 10,
                tabBarIndicatorStyle: {
                    height: 0,
                },
                tabBarAndroidRipple: {
                    color: "#ffffff"
                },
                tabBarIconStyle: { width: 80 },

                tabBarStyle: { backgroundColor: theme.primaryBackground, paddingBottom: 5, paddingTop: 5, },
            }}
        >
            <Tab.Screen name="HomeScreen" component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarIcon({ color, size }) {
                        iconName = 'home';
                        return <MaterialCommunityIcons style={iconStyle(color).icons} name={iconName} size={size} color={color} />;
                    },
                    tabBarLabel() {
                        return null;
                    },

                }}
            />

            <Tab.Screen name="DashBoardScreen" component={DashBoardScreen}
                options={{
                    headerShown: false,
                    tabBarIcon({ color, size }) {
                        iconName = 'view-dashboard-outline';
                        return <View>
                            <MaterialCommunityIcons style={iconStyle(color).icons} name={iconName} size={size} color={color} />
                        </View>
                    },
                    tabBarLabel() {
                        return null;
                    },
                }}
            />
            <Tab.Screen name="NotificationScreen" component={NotificationScreen}
                options={{
                    headerShown: false,
                    tabBarIcon({ color, size }) {
                        iconName = 'bell-outline';
                        return <View>
                            <MaterialCommunityIcons style={iconStyle(color).icons} name={iconName} size={size} color={color} />
                            <Badge
                                style={{ color: "white", backgroundColor: "black", position: "absolute", top: -5, right: 0 }}
                                onPress={() => {

                                }}>
                                {useNotificationCount()}
                            </Badge>
                        </View>
                    },
                    tabBarLabel() {
                        return null;
                    },
                }}
            />

        </Tab.Navigator >
    );
};
const iconStyle = (color) => StyleSheet.create({
    icons: {
        color: color,
        backgroundColor: color === "green" ? "#D0EDA4" : null,
        paddingHorizontal: 15,
        paddingVertical: 1,
        borderRadius: 17,
    }
})
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    tabBarLabel: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
    },
});

export default HomeBottomTabNavigation;
