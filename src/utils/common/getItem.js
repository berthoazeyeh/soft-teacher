import AsyncStorage from "@react-native-async-storage/async-storage";

export const retrieveTheme = async () => {
  try {
    const value = await AsyncStorage.getItem('persist:root');
    return value;
  } catch (error) {
    return null;
  }
};
export async function getTranslation() {
  try {
    const persistedState = await AsyncStorage.getItem('persist:root');
    if (persistedState) {
      const state = JSON.parse(persistedState); // Parse the serialized state
      const translationState = state.translation ? JSON.parse(state.translation) : null;
      return translationState.language;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving translation from AsyncStorage:', error);
    return null;
  }
}
export async function getCurrentScreen() {
  try {
    const persistedState = await AsyncStorage.getItem('persist:root');
    if (persistedState) {
      const state = JSON.parse(persistedState); // Parse the serialized state
      const translationState = state.current_screen ? JSON.parse(state.current_screen) : null;
      return translationState;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving translation from AsyncStorage:', error);
    return null;
  }
}
export const retrieveLanguage = async () => {
  try {
    const value = await AsyncStorage.getItem('language');
    return value;
  } catch (error) {
    return null;
  }
};
export const retrieveTranslation = async () => {
  try {
    const value = await AsyncStorage.getItem('language');
    return value;
  } catch (error) {
    return null;
  }
};

export const retrieveFcmToken = async () => {
  try {
    const value = await AsyncStorage.getItem('fcmToken');
    return value;
  } catch (error) {
    return null;
  }
};
