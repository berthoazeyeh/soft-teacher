import React, { useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from 'store';
import { Theme } from 'utils';


interface Props {
    onPressAddButton: (onchange: (val: any) => void) => void;
    onDeleteItem: (item: any, onchange: (val: any) => void) => void;
    onchange: (item: any) => void;
    files: any[];
}
const HorizontalScrollWithAddButton = ({ onPressAddButton, files, onDeleteItem, onchange }: Props) => {
    const theme = useTheme();
    const isImage = (fileUri: any) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const fileExtension = fileUri.split('.').pop().toLowerCase();
        return imageExtensions.includes(fileExtension);
    };


    return (
        <View style={styles.container}>
            <FlatList
                horizontal
                data={[{ type: 'addButton' }, ...files]}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={{ paddingVertical: 10 }}
                renderItem={({ item }) => {
                    if (item.type === 'addButton') {
                        return <TouchableOpacity onPress={() => onPressAddButton(onchange)} style={styles.addButton}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    }
                    if (isImage(item.fileCopyUri)) {
                        return (
                            <View style={styles.fileContainer}>
                                <Image source={{ uri: item.fileCopyUri }} style={styles.image} />
                                <TouchableOpacity style={{ position: "absolute", right: -10, top: -10 }} onPress={() => onDeleteItem(item, onchange)}>
                                    <MaterialCommunityIcons name="close-circle-outline" size={23} color={theme.primaryText} />
                                </TouchableOpacity>
                            </View>
                        )
                    } else {
                        return (
                            <View style={[styles.fileContainer, { alignItems: "center", width: 100, alignContent: "center", justifyContent: "center", padding: 5 }]}>
                                <TouchableOpacity style={{ position: "absolute", right: -10, top: -10 }} onPress={() => onDeleteItem(item, onchange)}>
                                    <MaterialCommunityIcons name="close-circle-outline" size={23} color={theme.primaryText} />
                                </TouchableOpacity>
                                <MaterialCommunityIcons name="file-document-multiple-outline" size={35} color={theme.primary} />
                                <Text style={styles.filename}>{item?.name}</Text>

                            </View>
                        )

                    }
                }

                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        paddingLeft: 0,
        paddingBottom: 20,

    },
    addButton: {
        width: 100,
        height: 150,
        backgroundColor: '#e0e0e0',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginRight: 10,
    },
    addButtonText: {
        fontSize: 40,
        color: '#888',
    },
    filename: {
        fontSize: 14,
        textAlign: "center",
        ...Theme.fontStyle.montserrat.regular,
        color: '#888',
    },
    fileContainer: {
        marginRight: 10,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,


    },
    image: {
        width: 100,
        height: 150,
        borderRadius: 10,
    },
});

export default HorizontalScrollWithAddButton;
