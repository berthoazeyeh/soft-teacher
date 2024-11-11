import { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { useCurrentUser, useTheme } from "store";
import dynamicStyles from "./style";
import { I18n } from "i18n";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useSWR from "swr";
import { getData, LOCAL_URL, postData, postMessageDoc } from "apis";
import { showCustomMessage, Theme } from "utils";
import { Divider, Icon, Menu } from "react-native-paper";
import Header from "./components/Header";
import { Bubble, Composer, GiftedChat, IMessage, InputToolbar, Send } from "react-native-gifted-chat";
import 'dayjs/locale/fr'
import { TextInput } from "react-native-gesture-handler";
import useSWRMutation from "swr/mutation";
import { InChatFileTransfer } from "./components";
import DocumentPicker from 'react-native-document-picker';
import { Linking } from "react-native";

function ChatScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { channel } = route.params
    const theme = useTheme()
    const inputRef = useRef<TextInput>(null);
    const styles = dynamicStyles(theme)
    const [messages, setMessages] = useState<any[]>([])
    const [messageToSend, setMessageToSend] = useState<any>(null)
    const [imagePath, setImagePath] = useState<any>(null)
    const [filePath, setFilePath] = useState<any>(null)
    const [file, setFile] = useState<any>(null)
    const user = useCurrentUser();
    const [isAttachImage, setIsAttachImage] = useState(false);
    const [isAttachFile, setIsAttachFile] = useState(false);
    const { trigger: postMessage } = useSWRMutation(`${LOCAL_URL}/api/send/message/${channel?.id}`, postMessageDoc);
    // console.log(user);
    const choocheImage = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.images, DocumentPicker.types.video],
                copyTo: "cachesDirectory"
            });
            const fileUri = result[0].fileCopyUri;
            if (!fileUri) {
                console.log('File URI is undefined or null');
                return;
            }
            setFile(result[0])
            setImagePath(fileUri);
            setIsAttachImage(true);


        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log(
                    "selection annuler"
                );
            }
        }
    }
    const choocheFile = async () => {
        try {
            const result = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf, DocumentPicker.types.xls, DocumentPicker.types.plainText, DocumentPicker.types.docx, DocumentPicker.types.audio,],
                copyTo: "cachesDirectory"
            });
            const fileUri = result[0].fileCopyUri;
            if (!fileUri) {
                console.log('File URI is undefined or null');
                return;
            }
            setFile(result[0])
            setFilePath(fileUri);
            setIsAttachFile(true);

        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log(
                    "selection annuler"
                );
            }
        }
    }
    const { data, error, isLoading } = useSWR(`${LOCAL_URL}/api/messages/${channel?.id}`,
        getData,
        {
            refreshInterval: 1000,
            refreshWhenHidden: true,
        },
    );

    useEffect(() => {
        if (!messageToSend) {
            return
        }
        postNewMessage(messageToSend, file)
        console.log("messageToSend", messageToSend);

    }, [messageToSend])

    const postNewMessage = async (text: string, file?: any) => {
        const data = {
            user_id: user?.user_id,
            message: text,
            haveFile: false,
            file: file
        }
        setMessages([])
        try {
            const res = await postMessage(data)
            setFilePath(null);
            setFile(null);
            setImagePath(null);
            setMessageToSend(null)
            console.log(res);

            if (!res?.success) {
                // showCustomMessage("Information", res?.message, "warning", "bottom")
                return;
            }

            // showCustomMessage("Success", "Note Atribuer avec success", "success", "center")

        } catch (error: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + error.message, "warning", "bottom")

        } finally {
        }
    };
    // console.log(data?.data[3]);

    useEffect(() => {
        if (data && data?.data) {
            const correctMessage = formatMessagesForGiftedChat(data?.data);
            setMessages(correctMessage?.reverse());
        }
    }, [data])




    const onSend = useCallback((messages = []) => {
        const [messageToSend]: any = messages;
        setMessageToSend(messageToSend.text);
        if (isAttachImage) {

            const newMessage: any = {
                _id: messageToSend._id + 1,
                text: messageToSend.text,
                createdAt: new Date(),
                user: {
                    _id: user?.partner_id,
                    name: user.name
                },
                image: imagePath,
                file: null
            };
            setMessages(previousMessages =>
                GiftedChat.append(previousMessages, newMessage),
            );
            setImagePath(null);
            setIsAttachImage(false);
            // postNewMessage(messageToSend.text, file)
        } else if (isAttachFile) {

            const newMessage: any = {
                _id: messageToSend._id + 1,
                text: messageToSend.text,
                createdAt: new Date(),
                user: {
                    _id: user?.partner_id,
                    name: user.name
                },
                image: '',
                file: {
                    url: filePath,
                    name: file?.name
                }
            };
            setMessages(previousMessages =>
                GiftedChat.append(previousMessages, newMessage),
            );
            setFilePath(null);
            setIsAttachFile(false);
            // postNewMessage(messageToSend.text, file)

        } else {
            setMessages(previousMessages =>
                GiftedChat.append(previousMessages, messages),
            );
            // postNewMessage(messageToSend.text)

        }

    }, [filePath, imagePath, isAttachFile, isAttachImage])

    const renderSend = (props: any) => {
        return (
            <Send {...props}
                containerStyle={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'transparent',
                    padding: 0,
                    marginRight: 0,
                }}>
                <View style={{ marginRight: 10, marginLeft: 5 }}>
                    <Icon source="send" size={30} color="#007AFF" />
                </View>
            </Send>
        );
    };
    const renderInputToolbar = (props: any) => {
        return (
            <InputToolbar
                {...props}
                containerStyle={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 25,
                    borderColor: theme.primary,
                    borderWidth: 1,
                    margin: 5,
                    paddingVertical: 3,
                    paddingHorizontal: 10,
                    backgroundColor: 'white',
                }}
                renderComposer={(composerProps) => (
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>

                        <MyMenu theme={theme} styles={styles} navigation={navigation} choocheFile={choocheFile} choocheImage={choocheImage} />
                        <Composer
                            {...composerProps}
                            textInputStyle={{
                                flex: 1,
                            }}
                            placeholder="Tapez votre message..."
                        />
                        <TouchableOpacity style={{ paddingHorizontal: 10 }}>
                            <Icon source="microphone" size={24} color="#007AFF" />
                        </TouchableOpacity>
                    </View>
                )}
            />
        );
    };

    const renderChatFooter = useCallback(() => {
        if (imagePath) {
            return (
                <View style={styles.chatFooter}>
                    <Image source={{ uri: imagePath }} style={{ height: 75, width: 85 }} />
                    <TouchableOpacity
                        onPress={() => setImagePath('')}
                        style={styles.buttonFooterChatImg}
                    >
                        <Text style={styles.textFooterChat}>X</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        if (filePath) {
            return (
                <View style={styles.chatFooter}>
                    <InChatFileTransfer
                        filePath={filePath}
                    />
                    <TouchableOpacity
                        onPress={() => setFilePath('')}
                        style={styles.buttonFooterChat}
                    >
                        <Text style={styles.textFooterChat}>X</Text>
                    </TouchableOpacity>
                </View>
            );
        }
        return null;
    }, [filePath, imagePath]);
    const formatMessagesForGiftedChat = (data: any[]) => {

        return data.map((item: any) => {
            let images = null;
            let files = null;
            if (item.attachment_ids?.length > 0 && item.attachment_ids[0].mimetype?.split("/")[0] === "image") {
                images = item.attachment_ids[0]?.url;
            } else {
                files = item.attachment_ids[0];
            }
            // console.log(images, files);

            return {
                _id: item.id,
                text: item.body.replace(/<[^>]+>/g, ''), // Remove HTML tags
                createdAt: new Date(item.date),
                user: {
                    _id: item.author_id.id,
                    name: item.author_id.name,
                },
                file: files,
                image: images

            };
        });
    };

    const renderBubble = (props: any) => {
        const { currentMessage } = props;
        // console.log("currentMessage.file", currentMessage.file);

        if (currentMessage.file) {
            return (
                <View
                    style={{
                        ...styles.fileContainer,
                        backgroundColor: props.currentMessage.user._id === user?.partner_id ? '#2e64e5' : '#efefef',
                        borderBottomLeftRadius: props.currentMessage.user._id === user?.partner_id ? 15 : 5,
                        borderBottomRightRadius: props.currentMessage.user._id === user?.partner_id ? 5 : 15,
                    }}

                >
                    <InChatFileTransfer
                        style={{ marginTop: -10 }}
                        filePath={currentMessage?.file.url}
                        names={currentMessage?.file.name}
                        type={currentMessage?.file.mimetype?.split("/")?.[1]?.toUpperCase()}
                    />
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{
                            ...styles.fileText,
                            color: currentMessage.user._id === user?.partner_id ? 'white' : 'black',
                        }} >
                            {currentMessage.text}
                        </Text>
                    </View>
                </View>
            );
        }
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#2e64e5',
                    },
                }}
                textStyle={{
                    right: {
                        color: '#efefef',
                    },
                }}
            />
        );
    }




    return <View style={styles.container}>
        <Header theme={theme} item={channel} handlePressConverssation={() => { }} navigation={navigation} />
        <Divider />
        <GiftedChat
            textInputRef={inputRef}
            messages={messages}
            onSend={onSend as (messages: IMessage[]) => void}
            onLongPress={() => {
                Alert.alert("Confirmation", "Voulez-vous supprimer ce message ?", [{ text: "Annuler", style: "cancel" }, { text: "Supprimer", style: "destructive", onPress: () => { } }], { cancelable: true })
            }}
            user={{
                _id: user?.partner_id,
                name: user.name
            }}
            locale={"fr"}
            // isTyping={true}
            renderSend={renderSend}

            renderInputToolbar={renderInputToolbar}
            scrollToBottom
            renderChatFooter={renderChatFooter}
            renderBubble={renderBubble}
            // @ts-ignore
            // inverted={false}
            renderUsernameOnMessage={true} />

    </View>
}



const MyMenu = ({ theme, styles, navigation, choocheFile, choocheImage }: any) => {
    const [visible, setVisible] = useState(false)
    return (
        <Menu
            visible={visible}
            onDismiss={() => { setVisible(false) }}
            style={{ width: '50%' }}
            contentStyle={{ backgroundColor: theme.primaryBackground, }}
            anchor={
                <TouchableOpacity onPress={() => setVisible(true)} style={{ marginRight: 10 }}>
                    <Icon source="plus" size={24} color="#007AFF" />
                </TouchableOpacity>}>

            <TouchableOpacity style={styles.menuItem}
                onPress={() => {
                    setVisible(false)
                    choocheImage();
                }}
            >
                <MaterialCommunityIcons
                    name="image"
                    size={27}
                    color={theme.primary}
                    style={styles.icon}
                />
                <Text style={styles.menuText}> {"Image & Vidéo"}</Text>
            </TouchableOpacity>

            <Divider />
            <TouchableOpacity style={styles.menuItem}
                onPress={() => {
                    setVisible(false)
                    choocheFile();
                }}
            >
                <MaterialCommunityIcons
                    name="file"
                    size={27}
                    color={theme.primary}
                    style={styles.icon}
                />
                <Text style={styles.menuText}> {"Fichier"}</Text>
            </TouchableOpacity>
        </Menu>
    )
}

export default ChatScreen;