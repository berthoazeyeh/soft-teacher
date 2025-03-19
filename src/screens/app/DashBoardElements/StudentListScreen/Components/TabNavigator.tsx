import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from 'store';
import { Theme } from 'utils';

const TabNavigator = ({ children }: any) => {
    const [activeTab, setActiveTab] = useState(0);
    const screenWidth = Dimensions.get('window').width;
    const tabWidth = screenWidth / 3; // 4 tabs, so divide the screen width
    const animation = new Animated.Value(activeTab);
    const theme = useTheme()
    const styles = style(theme)
    useEffect(() => {
        Animated.timing(animation, {
            toValue: activeTab * tabWidth - 20, // Move the indicator
            duration: 400,
            useNativeDriver: false,
        }).start();
    }, [activeTab]);

    return (
        <View style={styles.container}>
            <View style={styles.tabs}>
                {['Identité', 'Scolarité', 'Responsables'].map((tab, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => setActiveTab(index)}
                        style={styles.tab}
                    >
                        <Text style={activeTab === index ? styles.activeTabText : styles.tabText}>{tab}</Text>
                    </TouchableOpacity>
                ))}
                <Animated.View style={[styles.indicator, { transform: [{ translateX: animation }], width: tabWidth }]} />
            </View>

            <View style={styles.contentContainer}>
                {children[activeTab]}
            </View>
        </View>
    );
};

const style = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
    },
    tabs: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: theme.gary,
        paddingVertical: 10,
        position: 'relative',
    },
    tab: {
        flex: 1,
        alignItems: 'center',
    },
    tabText: {
        color: theme.primaryText,
        ...Theme.fontStyle.inter.semiBold,
        fontSize: 13,
    },
    activeTabText: {
        color: "blue",
        ...Theme.fontStyle.inter.semiBold,
        fontSize: 16,
    },
    indicator: {
        position: 'absolute',
        height: 4,
        backgroundColor: "blue",
        bottom: 0,
        left: 20,
    },
    contentContainer: {
        flex: 1,
        backgroundColor: theme.primaryBackground,
        padding: 20,
    },
});

export default TabNavigator;
