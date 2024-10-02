
import React, { useState, useEffect } from 'react';
import { Image, Text, View, TouchableOpacity, FlatList } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DocumentScanner, { ResponseType } from 'react-native-document-scanner-plugin'
import { useDispatch } from 'react-redux';
import { PermissionsAndroid } from 'react-native';
import useSWRMutation from 'swr/mutation';
import { LOCAL_URL, postDataDoc } from 'apis';
import { useCurrentUser, useTheme } from 'store';
import dynamicStyles from './styles';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importez l'icône que vous souhaitez utiliser


const ScanFileScreen = (props: any) => {
    const dispatch = useDispatch();
    const { name, setLoading, closeModal } = props;
    const theme = useTheme();
    const styles = dynamicStyles(theme);
    const [scannedImage, setScannedImage] = useState<any>();
    const users = useCurrentUser();

    const { trigger: postNewDocumentAtach } = useSWRMutation(`${LOCAL_URL}/api/contact.document/upload`, postDataDoc)
    const permmition = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'Enable Location Services',
                message:
                    'Our app needs access to your camera ' +
                    'so you can take awesome rides.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            return true
        } else {
            return false

        }
    }
    useEffect(() => {
        handleScan()
    }, [])

    const handleScan = async () => {
        if (await permmition()) {

            scanDocument()
        }
        setLoading(false);
    }
    const handleDeleteImage = (id: any) => {
        const updatedImages = scannedImage.filter((image: any) => image !== id);
        setScannedImage(updatedImages);
    };



    const renderItem = ({ item }: any) => {

        console.log(item)
        return (
            <View style={styles.imageContainer10}>
                <Image source={{ uri: item }} style={styles.image} />
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteImage(item)}
                >
                    <Icon name="times" size={28} color="green" />
                </TouchableOpacity>
            </View>
        )
    };
    const scanDocument = async () => {
        const { scannedImages } = await DocumentScanner.scanDocument({
        }
        )

        const nouvelleListe = scannedImage;
        const listeFusionnee = nouvelleListe ? nouvelleListe.concat(scannedImages) : scannedImages;
        if (scannedImages && scannedImages.length > 0) {
            // set the img src, so we can view the first scanned image
            setScannedImage(listeFusionnee)
        }
    }
    const onPress = async () => {
        setLoading(true);

        const listeDObjets = scannedImage.map((valeur: any, index: any) => ({
            "fileCopyUri": null,
            "size": 0,
            "type": "image/jpeg",
            "name": valeur.includes("file:///storage/emulated/0/Android/data/com.metuadriver/files/Pictures/") ? valeur.replace("file:///storage/emulated/0/Android/data/com.metuadriver/files/Pictures/", "") : valeur,
            "uri": valeur
        }));
        try {
            const promises = listeDObjets.map(async (file: any) => {
                const newDatta = {
                    "file": file,
                    "record_id": users?.user?.partner_id,
                    "name": file?.name,
                    "begin_date": "2010-10-12 23:22:22",
                    "end_date": "2060-10-12 23:22:22",
                    "type": name.id
                }

                // console.log("formdata", newDatta);
                // await postNewDocumentAtach(newDatta).then((data) => {

                // }).catch((err) => {
                //     console.log(err);
                // })


            });
            await Promise.all(promises);
            console.log('Toutes les requêtes sont terminées. Dernière requête effectuée.');
        } catch (error) {
            setLoading(false)
            console.error('Une erreur s\'est produite :', error);
        }

    }

    const renderEmptyStudentElement = () => (
        <View style={styles.emptyData}>
            <Text style={styles.emptyDataText}>{"Aucun Document n'a ete scanner"}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.fieldTextstart}>{name.name} :{name.tache}</Text>

            <FlatList
                data={scannedImage}
                renderItem={renderItem}
                keyExtractor={(item) => item}
                numColumns={2}
                ListEmptyComponent={renderEmptyStudentElement}
            />
            <View style={styles.content}></View>

            <View style={styles.buttonContainers}>
                <TouchableOpacity
                    style={styles.loginContainer12}
                    activeOpacity={0.8}
                    onPress={() => scanDocument()}>
                    <Text style={styles.loginTexts}>Scanner</Text>
                </TouchableOpacity>
                {scannedImage && scannedImage.length > 0 &&
                    <TouchableOpacity
                        style={styles.loginContainer}
                        activeOpacity={0.8}
                        onPress={() => onPress()}>
                        <Text style={styles.loginText}>Soummetre</Text>
                    </TouchableOpacity>
                }
            </View>

        </View>)
}
export default ScanFileScreen