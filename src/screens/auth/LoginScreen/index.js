import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { StatusBar } from "react-native";
import { ActivityIndicator, Image, Text } from "react-native"
import { changeLanguage, selectLanguageValue, updateUserStored, useTheme } from "store";
import { backgroundImages, ImageE2, ImageE3, showCustomMessage, Theme } from "utils"
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { I18n } from 'i18n';
import { useState } from "react";
import dynamicStyles from "./style";
import { Button } from "react-native-paper";
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import useSWRMutation from 'swr/mutation'
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LOCAL_URL, postData } from "apis";

const schema = z.object({
    email: z.string()
        .min(5, I18n.t('Login.validation_email_invalid'))
        .regex(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, { message: I18n.t('Login.validation_email_invalid') }),
    password: z.string()
        .min(8, { message: I18n.t('Login.validation_password_too_short') })
        .regex(/[A-Z]/, { message: I18n.t('Login.validation_password_uppercase') })
        .regex(/[a-z]/, { message: I18n.t('Login.validation_password_lowercase') })
        .regex(/\d/, { message: I18n.t('Login.validation_password_number') })
});

const LoginScreen = (props) => {
    const { navigation } = props;
    const theme = useTheme()
    const styles = dynamicStyles(theme)
    const language = useSelector(selectLanguageValue);
    const dispatch = useDispatch()
    const form = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });
    const { trigger: loginParrents } = useSWRMutation(`${LOCAL_URL}/api/login/parent`, postData)

    const [loading, setLoading] = useState(false)
    const [securePasswordEntry, setSecurePasswordEntry] = useState(true)


    const handleSubmittedFormuler = async (data) => {
        setLoading(true);
        const parrentData = {
            login: data.email,
            password: data.password,
            db: DATABASE
        }

        const response = await loginParrents(parrentData);
        if (response?.success) {
            showCustomMessage("Succes", response.message, 'success', "center");
            const data = response.data;
            dispatch(updateUserStored(data))
            setLoading(false)
            navigation.reset({
                index: 0,
                routes: [{ name: 'AppStacks' }],
            })
        } else {
            setLoading(false)
            showCustomMessage("Information", response?.message ? response?.message : "Une erreur est survenue lors de l'authentification. veillez reessayer", "warning", "bottom")
        }
    }

    return (
        <View style={styles.container}>
            <Image
                source={ImageE2}
                style={styles.logo}
            />
            <View style={styles.boxContainer}>
                <View style={styles.languageContainer}>
                    <Text style={styles.textlangauge}>{I18n.t("changeLanguage")}</Text>
                    <Picker
                        selectedValue={language}
                        onValueChange={(itemValue, itemIndex) => {
                            dispatch(changeLanguage(itemValue));
                        }}
                        style={{ width: 130, gap: 0, color: theme.primaryText, fontSize: 1, padding: 0 }}
                        dropdownIconColor={theme.primary}
                        mode="dropdown" >
                        <Picker.Item style={{ fontSize: 12, ...Theme.fontStyle.montserrat.bold }} label={I18n.t("Login.languageFrench")} value="fr" />
                        <Picker.Item style={{ fontSize: 12, ...Theme.fontStyle.montserrat.bold }} label={I18n.t("Login.languageEnglish")} value="en" />
                    </Picker >
                </View >
                <Controller
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                        <View>
                            <View style={styles.viewInputContent}>
                                <MaterialCommunityIcons name='email' size={27} color={fieldState.invalid ? theme.primary : "gray"} />
                                <TextInput
                                    style={styles.inputContainer}
                                    placeholderTextColor={theme.placeholderTextColor}
                                    onChange={() => (form.formState.isValid)}
                                    onChangeText={field.onChange}
                                    value={field.value || ''}
                                    placeholder={I18n.t("Login.username")}
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                                {!fieldState.invalid && <MaterialCommunityIcons
                                    name={"check"}
                                    size={24}
                                    color={theme.primary}
                                />}
                            </View>
                            {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                        </View>)} />
                <Controller
                    control={form.control}
                    name="password"
                    render={({ field, fieldState }) => (
                        <View>
                            <View style={styles.viewInputContent}>
                                <MaterialCommunityIcons name='lock' size={27} color={fieldState.invalid ? theme.primary : "gray"} />
                                <TextInput
                                    style={styles.inputContainer}
                                    placeholderTextColor={theme.placeholderTextColor}
                                    onChange={() => (form.formState.isValid)}
                                    onChangeText={field.onChange}
                                    value={field.value || ''}
                                    secureTextEntry={securePasswordEntry}
                                    placeholder={I18n.t("Login.password")}
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="none"
                                    maxLength={16}
                                />
                                <TouchableOpacity onPress={() => setSecurePasswordEntry(!securePasswordEntry)}>
                                    <MaterialCommunityIcons
                                        name={securePasswordEntry ? 'eye-off' : 'eye'}
                                        size={24}
                                        color="gray"
                                    />
                                </TouchableOpacity>
                            </View>
                            {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                        </View>)} />


                <View style={styles.buttonContainer}>
                    <Button
                        style={{ ...styles.loginButton, backgroundColor: loading ? theme.gray : theme.primary, flex: 1 }}
                        onPress={() => {
                            if (!form.formState.isValid) {
                                console.log("----------------------", form.formState.isValid);
                                showCustomMessage("Information", "Tout les champs sont requis", "warning", "bottom")
                                form.handleSubmit(handleSubmittedFormuler)();
                                return;
                            }
                            form.handleSubmit(handleSubmittedFormuler)();
                        }
                        }
                        loading={loading}
                        disabled={loading}
                        elevation={3}
                        labelStyle={styles.buttonLabel}
                        mode="elevated"
                    >
                        <Text style={styles.loginText}>{I18n.t("Login.login")}</Text>
                    </Button>
                </View>
                <View style={{ justifyContent: "flex-end", flexDirection: "row", flex: 1, alignSelf: "flex-end" }}>
                    <Text style={{ color: theme.primaryText }}>Pas de compte?</Text>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('SignInScreen')
                    }}>
                        <Text style={{ paddingHorizontal: 10, color: "blue" }}>Créer un</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </View>
    )
}


export default LoginScreen




