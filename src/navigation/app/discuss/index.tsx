import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { ChatMemberScreen, DiscussScreen, ChatScreen } from 'screens'



export type DiscussStackList = {

    DiscussScreen: undefined;
    ChatScreen: undefined;
    ChatMemberScreen: undefined;

};
const DiscussScreenStack = createStackNavigator<DiscussStackList>()

const DiscussStacks = () => {
    return (
        <DiscussScreenStack.Navigator
            screenOptions={{
                headerBackTitleVisible: false,
            }}
            initialRouteName="DiscussScreen">
            <DiscussScreenStack.Screen
                options={{ headerShown: true }}
                name="DiscussScreen"
                component={DiscussScreen}
            />
            <DiscussScreenStack.Screen
                options={{ headerShown: false }}
                name="ChatScreen"
                component={ChatScreen}
            />
            <DiscussScreenStack.Screen
                options={{ headerShown: true }}
                name="ChatMemberScreen"
                component={ChatMemberScreen}
            />



        </DiscussScreenStack.Navigator>
    )
}



export default DiscussStacks