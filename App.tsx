/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { AppState, SafeAreaView, StatusBar, useColorScheme } from 'react-native';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import { useSelector } from 'react-redux';
import { selectLanguageValue, useTheme } from 'store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FlashMessage from 'react-native-flash-message';
import { I18n } from 'i18n';
// @ts-ignore
import { AppStack } from '@navigation';
import NetInfo from '@react-native-community/netinfo';
import { showCustomMessage } from 'utils';
import notifee from '@notifee/react-native';

import { getApp } from '@react-native-firebase/app';

try {
  getApp();
} catch (error) {
}
AppState.addEventListener("change", async (state) => {
  // if (state === 'active') {
  //   await notifee.displayNotification({
  //     title: 'Bienvenue !',
  //     body: 'Ravi de vous revoir 😊',
  //     android: {
  //       channelId: 'default',
  //     },
  //   });
  // }
  // if (state === "inactive") {
  //   await notifee.displayNotification({
  //     title: 'Bienvenue !...',
  //     body: 'Ravi de vous revoir 😊',
  //     android: {
  //       channelId: 'default',
  //     },
  //   });
  // }
  // if (state === "background") {
  //   await notifee.displayNotification({
  //     title: 'Bienvenue !...background',
  //     body: 'Ravi de vous revoir 😊',
  //     android: {
  //       channelId: 'default',
  //     },
  //   });
  // }
});
const App = () => {

  const language = useSelector(selectLanguageValue);
  const themeColors = useTheme();
  I18n.locale = language;
  const scheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const [isConnected, setIsConnected] = useState<boolean>(false);


  useEffect(() => {
    // S'abonner aux changements de connexion
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected ?? false);
      console.log(state.isConnected);
      if (state.isConnected) {
        showCustomMessage("Connexion rétablie", "", "success", "top")
      } else {
        showCustomMessage("Aucune connexion internet", "", "error", "top")
      }
    });

    // Nettoyer l'abonnement lors du démontage du composant
    return () => {
      unsubscribe();
    };
  }, []);


  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      ...themeColors
    },
  };

  return (<GestureHandlerRootView style={{ flex: 1 }}>
    <PaperProvider theme={theme}>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer >
          <FlashMessage position="center" />
          <StatusBar
            backgroundColor={useTheme().statusbar}
            barStyle={scheme != "dark" ? 'dark-content' : 'light-content'}
          />
          <AppStack />

        </NavigationContainer >
      </SafeAreaView>
    </PaperProvider>
  </GestureHandlerRootView>);
};

export default App;
