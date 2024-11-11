import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Banner } from 'react-native-paper';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

// Définir un type pour les props du composant
type AnimatedBannerProps = {
    visibleBanner: boolean;
    isLocalImages: boolean;
    setVisibleBanner: (value: boolean) => void;
    confirmAction: () => void;
    iconUrl: any;
    message: string;
    cancelLabel: string;
    modifyLabel: string;
};

const MyAnimatedBanner: React.FC<AnimatedBannerProps> = ({
    visibleBanner,
    setVisibleBanner,
    iconUrl,
    isLocalImages,
    message,
    cancelLabel,
    modifyLabel,
    confirmAction
}) => {
    const translateY = useSharedValue(0); // Initial translation for animation

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateY: withTiming(visibleBanner ? 0 : -100, { duration: 1500 }) }],
        };
    });

    return (
        <Animated.View style={[styles.bannerContainer, animatedStyle]}>
            <Banner
                visible={visibleBanner}
                actions={[
                    {
                        label: cancelLabel,
                        onPress: () => {
                            setTimeout(() => {

                                setVisibleBanner(false)
                            }, 200)
                        },
                    },
                    {
                        label: modifyLabel,
                        onPress: () => confirmAction(),
                    },
                ]}
                icon={({ size }) => {

                    if (isLocalImages) {

                        return <Image
                            source={iconUrl}
                            style={{
                                width: size,
                                height: size,
                            }}
                        />
                    }

                    return <Image
                        source={{
                            uri: iconUrl,
                        }}
                        style={{
                            width: size,
                            height: size,
                        }}
                    />
                }
                }
            >
                {`${message}`}
            </Banner>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    bannerContainer: {
        // position: 'absolute',
        top: 0,
        width: '100%',
    },
});

export default MyAnimatedBanner;
