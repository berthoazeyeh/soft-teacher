import React, { useState } from 'react';
import { View, FlatList, Image, TouchableOpacity, Text, StyleSheet } from 'react-native';


interface Props {
    onPressAddButton: () => void;
    files: any[];
}
const HorizontalScrollWithAddButton = ({ onPressAddButton, files }: Props) => {
    // console.log(files);
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
                renderItem={({ item }) => {
                    if (item.type === 'addButton') {
                        return <TouchableOpacity onPress={() => onPressAddButton()} style={styles.addButton}>
                            <Text style={styles.addButtonText}>+</Text>
                        </TouchableOpacity>
                    }
                    if (isImage(item.fileCopyUri)) {
                        return (
                            <View style={styles.fileContainer}>
                                <Image source={{ uri: item.fileCopyUri }} style={styles.image} />
                            </View>
                        )
                    } else {
                        return (
                            <View style={styles.fileContainer}>
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
