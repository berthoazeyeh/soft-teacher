
import React, { useState, useEffect } from 'react';
import { Image, Text, View, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import { LOCAL_URL, postDataDoc } from 'apis';
import { useDispatch } from 'react-redux';
import { I18n } from 'i18n';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importez l'icône que vous souhaitez utiliser
import useSWRMutation from 'swr/mutation';
import dynamicStyles from './styles';
import { useCurrentUser, useTheme } from 'store';
import { CustomerLoader } from 'components';
import moment, { now } from 'moment';
import { showCustomMessage } from 'utils';

const ChoseFileScreen = (props: any) => {
    const { name, setLoading, closeModal, loading, getDoc, children } = props;
    const theme = useTheme();
    const styles = dynamicStyles(theme);
    const [scannedImages, setScannedImages] = useState<any>();
    const dispatch = useDispatch();
    const users = useCurrentUser();
    const onSucces = () => {
        setLoading(false);
        console.log("succes");
    }
    useEffect(() => {
        setLoading(true);

        choochefile();
        setLoading(false);
    }, [])


    const { trigger: postNewDocumentAtach } = useSWRMutation(`${LOCAL_URL}/api/create/assignment-sub-line`, postDataDoc)

    const choochefile = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.images, DocumentPicker.types.xls, DocumentPicker.types.plainText, DocumentPicker.types.docx, DocumentPicker.types.doc],
                copyTo: "cachesDirectory"
            });
            console.log(
                result
            );
            const nouvelleListe: any = scannedImages;
            console.log("hjshdjhsjhds", scannedImages);
            const listeFusionnee = nouvelleListe ? nouvelleListe.concat(result) : result;
            console.log("liste complete/////////", listeFusionnee);
            if (result) {
                setScannedImages(listeFusionnee)
            }

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log(
                    "selection annuler"
                );
            } else {
                console.log(
                    err
                );
                throw err;
            }
        }
    }


    const onPress = () => {
        setLoading(true);
        try {
            const newDatta = {
                "document": scannedImages[0],
                "assignment_id": name.id,
                "student_id": children?.id,
                "submission_date": new Date().toISOString().replace("T", " ").split(".")[0],
                "description": "...",
                "note": "10"

            }
            console.log("formdata", newDatta);
            postDataDoc(`${LOCAL_URL}/api/create/assignment-sub-line`, { arg: newDatta }).then((res => {
                if (res.success) {
                    closeModal()
                    showCustomMessage("Document", res?.message, "success", "center")
                } else {
                    closeModal()
                    Alert.alert("Erreur lors de la creation du document", res?.message)
                }
                console.log(res);
            }))


        } catch (error) {
            setLoading(false)
            console.error('Une erreur s\'est produite :', error);
        }

    }
    const onPress1 = async () => {
        setLoading(true);
        try {
            const promises = scannedImages.map(async (file: any) => {
                const newDatta = {
                    "document": file,
                    "assignment_id": name.id,
                    "student_id": children?.id,
                    "submission_date": moment.now().toLocaleString(),

                }

                console.log("formdata", newDatta);
                await postNewDocumentAtach(newDatta).then((data) => {

                }).catch((err) => {
                    console.log(err);
                })


            });
            await Promise.all(promises);
            console.log('Toutes les requêtes sont terminées. Dernière requête effectuée.');
        } catch (error) {
            setLoading(false)
            console.error('Une erreur s\'est produite :', error);
        }

    }


    const handleDeleteImage = (id: any) => {

        // Supprimez l'image du tableau d'images en fonction de son ID
        const updatedImages = scannedImages?.filter((image: any) => image !== id);
        setScannedImages(updatedImages);
    };


    const renderPDFItem = (item: any) => {
        return (<View key={item + new Date().toLocaleTimeString()}>
            <TouchableOpacity
                style={styles.itemContainer}
                onPress={() => { }}
            >
                <Text style={styles.iconText}><Icon name="file-pdf-o" size={24} color="#007aff" /></Text>
                <Text style={styles.itemText}>{item.name}</Text>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteImage(item)}
                >
                    <Icon name="times" size={20} color="green" />
                </TouchableOpacity>
            </TouchableOpacity>
        </View>

        );
    };
    const renderItem = ({ item, index }: any) => {

        console.log("fdfdf", item)
        return (
            <View key={index}>
                {(item.type != "image/jpeg") && renderPDFItem(item)}
                {(item.type == "image/jpeg") &&
                    <View style={styles.imageContainer10} key={item + new Date().toLocaleTimeString()}>
                        <Image source={{ uri: item.uri }} style={styles.image} />
                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteImage(item)}
                        >
                            <Icon name="times" size={28} color="green" />
                        </TouchableOpacity>
                    </View>
                }
            </View>

            // <Image source={{ uri: item }} style={styles.image} />
        )
    };

    const renderEmptyStudentElement = () => (
        <View style={styles.emptyData}>
            <Text style={styles.emptyDataText}>{"Aucun Document n'a ete scanner"}</Text>
        </View>
    );
    return (
        <View style={styles.container1}>

            <Text style={styles.fieldTextstart}>{name.name} : {name.tache}</Text>
            <FlatList
                data={scannedImages}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                numColumns={1} // Affichez deux images par ligne
                ListEmptyComponent={renderEmptyStudentElement}

            />
            <View style={styles.content}></View>

            <View style={styles.buttonContainers}>
                <TouchableOpacity
                    style={styles.loginContainer12}
                    activeOpacity={0.8}
                    onPress={() => { choochefile() }}>
                    <Text style={styles.loginTexts}>Choisir</Text>
                </TouchableOpacity>
                {scannedImages && scannedImages.length > 0 &&
                    <TouchableOpacity
                        style={styles.loginContainer}
                        activeOpacity={0.8}
                        onPress={onPress}>
                        {loading && <ActivityIndicator color={theme.secondaryText} />
                        }
                        {!loading &&
                            <Text style={styles.loginText}> Soumettre</Text>}
                    </TouchableOpacity>
                }
            </View>
        </View>)
}
export default ChoseFileScreen