import React from 'react';
import { View, Text, StyleSheet, Image, Linking } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const InChatFileTransfer = ({ filePath, names, type }: any) => {
    var fileType = '';
    var name = '';
    if (filePath !== undefined) {
        name = filePath?.split('/').pop();
        fileType = filePath?.split('.').pop();
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.frame}
                onPress={() => {
                    Linking.openURL(filePath);
                }
                }
            >
                <Image
                    source={
                        fileType === 'pdf'
                            ? require('../../../../../assets/assets/file.png')
                            : require('../../../../../assets/assets/file.png')
                    }
                    style={{ height: 60, width: 60 }}
                />
                <View>
                    <Text style={styles.text} numberOfLines={1}>
                        {names ? names : name.replace('%20', '').replace(' ', '')}
                    </Text>
                    <Text style={styles.textType}>{type ? type : fileType.toUpperCase()}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};
export default InChatFileTransfer;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 5,
        borderRadius: 15,
        padding: 5,
    },
    text: {
        color: 'black',
        marginTop: 10,
        fontSize: 16,
        lineHeight: 20,
        marginLeft: 5,
        marginRight: 5,
    },
    textType: {
        color: 'black',
        marginTop: 5,
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    frame: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        borderRadius: 10,
        padding: 5,
        marginTop: -4,
    },
});