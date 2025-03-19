import { Animated, Easing } from "react-native";

export const showHeader = (headerHeight: Animated.Value) => {
    Animated.timing(headerHeight, {
        toValue: 60,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
    }).start();
};

export const hideHeader = (headerHeight: Animated.Value) => {
    Animated.timing(headerHeight, {
        toValue: 0,
        duration: 300,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
    }).start();
};



export const hideFilter = (filterHeight: Animated.Value) => {
    Animated.timing(filterHeight, {
        toValue: 0,
        duration: 400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
    }).start();
};
export const showFilter = (filterHeight: Animated.Value) => {
    Animated.timing(filterHeight, {
        toValue: 45,
        duration: 400,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: false,
    }).start();
};

export const getPosition = (classRoom: any,) => {

}