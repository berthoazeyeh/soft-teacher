import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

interface RotatingImageProps {
    source: any; // Image source
    size?: number; // Taille de l'image (optionnel)
    duration?: number; // Durée de la rotation en ms (optionnel)
}

const MyRotatingImage: React.FC<RotatingImageProps> = ({ source, size = 100, duration = 2000 }) => {
    const rotateAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const rotateLoop = Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        rotateLoop.start();

        return () => rotateLoop.stop();
    }, [rotateAnim, duration]);

    const rotateInterpolation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    return (
        <View style={[styles.container, { width: size, height: size, alignSelf: "center" }]}>
            <Animated.Image
                source={source}
                style={[styles.image, { width: size, height: size, alignSelf: "center", transform: [{ rotate: rotateInterpolation }] }]}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        resizeMode: 'contain',
    },
});

export default MyRotatingImage;
