import React, { useLayoutEffect, useState } from 'react';
import { View, Text, Button, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { AnimatedFAB, FAB, TextInput } from 'react-native-paper';
import { clearUserStored, updateSyncing, updateUserStored, useCurrentUser, useTheme } from 'store';
import { DEFAULT_IMG, showCustomMessage, Theme } from 'utils';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { I18n } from 'i18n';
import { getData, LOCAL_URL, postData, PostFormData, putData, RechargeMobileWalletEnd } from 'apis';
import { CustomerLoader } from 'components';
import { useDispatch } from 'react-redux';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import useSWRMutation from 'swr/mutation';
import { clearCustomTables } from 'apis/database';

const schema = z.object({
    name: z.string()
        .min(5, I18n.t('Login.validation_username_too_short')),
    phoneNumber: z.string()
        .min(9, I18n.t('Login.validation_phoneNumber_too_short')),
});
const schema1 = z.object({
    newPassword: z.string()
        .min(8, { message: I18n.t('Login.validation_password_too_short') })
        .regex(/[A-Z]/, { message: I18n.t('Login.validation_password_uppercase') })
        .regex(/[a-z]/, { message: I18n.t('Login.validation_password_lowercase') })
        .regex(/\d/, { message: I18n.t('Login.validation_password_number') }),
    holdPassword: z.string()
        .min(5, { message: I18n.t('Login.validation_password_too_short') }),

    ConfirmNewPassword: z.string()
        .min(8, { message: I18n.t('Login.validation_password_too_short') })
        .regex(/[A-Z]/, { message: I18n.t('Login.validation_password_uppercase') })
        .regex(/[a-z]/, { message: I18n.t('Login.validation_password_lowercase') })
        .regex(/\d/, { message: I18n.t('Login.validation_password_number') })

}).refine((data) => data.newPassword === data.ConfirmNewPassword, {
    message: I18n.t('Login.validation_passwords_do_not_match'),
    path: ['ConfirmNewPassword'], // Chemin du champ à associer à cette erreur
});

type Parent = {
    email: string,
    id: number,
    name: string,
    partner_id: number,
    phone: string,
    relation: any,
    user_id: number

}

const ProfileScreen = (props: any) => {
    const { navigation } = props;
    const user = useCurrentUser()
    console.log(user);

    const { trigger: changeTeacherPassword } = useSWRMutation(`${LOCAL_URL}/api/change/password/${user?.user_id}`, PostFormData)

    // required_fields = ['old_password', 'new_password']
    const form = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    const form1 = useForm({
        resolver: zodResolver(schema1),
        mode: "onChange",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [updatePassword, setUpdatePassword] = useState(false);
    const [newPassword, setNewPassword] = useState("");
    const [holdPassword, setHoldPassword] = useState("");
    const dispatch = useDispatch();

    const [securePasswordEntry, setSecurePasswordEntry] = useState(true);

    const [userData, setUserData] = useState<Parent>(user);
    const theme = useTheme()
    const styles = style(theme)
    const handleEditToggle = () => {
        if (isEditing) {
            setLoading(false)
            if (!form.formState.isValid) {

                form.handleSubmit(() => { })();
                return;
            }
            handleSubmittedFormuler()
        }
        setIsEditing(!isEditing);
    };
    const handleEditPassWordToggle = () => {
        if (updatePassword) {

            setLoading(false)

            if (!form1.formState.isValid) {
                console.log("''''''''");

                form1.handleSubmit(handleSubmittedPassWordFormuler)();
                return;
            } else {
                form1.handleSubmit(handleSubmittedPassWordFormuler)();
                return;
            }
        }
        setIsEditing(!updatePassword)
        setUpdatePassword(!updatePassword);
    };

    const handleSubmittedPassWordFormuler = async (data: any) => {
        console.log(data);
        try {

            setLoading(true);
            const response = await changeTeacherPassword({ old_password: data.holdPassword, new_password: data.newPassword });
            console.log(response);
            if (response.success) {
                showCustomMessage("Success", "Mot de passe modifié avec succès.", "success", "center")

                setIsEditing(!updatePassword)
                setUpdatePassword(!updatePassword);
                setHoldPassword("")
                setNewPassword("")

                dispatch(clearUserStored(null))
                dispatch(updateSyncing(true))

                // await clearCustomTables(["assignment_types", "assignment_types", "assignments", "assignment_rooms", "attendanceLine", "students", "sessions", "classrooms"]);

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'AuthStacks' }],
                })
                console.log("log out");
            } else {
                showCustomMessage("Information", response?.message, "warning", "bottom")
            }

        } catch (error: any) {
            showCustomMessage("Information", "Une erreur s'est produite." + error?.message, "warning", "bottom")
        } finally {
            setLoading(false);
        }
    }

    const handleSubmittedFormuler = async () => {

        setLoading(true);
        const datas = { mobile: userData.phone, phone: userData.phone, name: userData.name }
        const response1 = await putData(`${LOCAL_URL}/api/res.partner/${userData.partner_id}`, { arg: datas })
        console.log(response1);

        if (response1?.success) {
            dispatch(updateUserStored(userData))
            showCustomMessage("Success", "Successfully updated.", "success", "center")
        } else {
            showCustomMessage("Information", "Une erreur s'est produite." + response1?.message, "warning", "bottom")
        }
        setLoading(false)
    }
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Profile Enseignant',
        });
    }, []);

    const handleChange = (field: any, value: any) => {
        setUserData(prevData => ({
            ...prevData,
            [field]: value,
        }));
    };

    return (
        <View style={styles.container}>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    <View style={styles.profilePic}>
                        <Image source={{ uri: `data:image/jpeg;base64,${DEFAULT_IMG}` }} style={{
                            width: 100,
                            height: 100,
                            alignSelf: "center",
                            borderRadius: 50,
                            resizeMode: "cover"
                        }} />
                        <Text style={[styles.label, { textAlign: "center" }]}>{userData.name}</Text>
                        <Text style={[styles.label, { textAlign: "center" }]}>
                            <MaterialCommunityIcons name='phone-dial-outline' size={20} color={theme.primary} />
                            {' '}
                            {userData.phone}
                        </Text>
                        <Text style={[styles.label, { textAlign: "center", marginBottom: 20, }]}>
                            <MaterialCommunityIcons name='email' size={20} color={theme.primary} />
                            {' '}{userData.email}
                        </Text>
                    </View>


                    {isEditing && <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => {
                            return <View >
                                <View style={styles.field}>
                                    <Text style={styles.label}>Full name</Text>
                                    <TextInput
                                        left={<TextInput.Icon icon="account" />}
                                        contentStyle={styles.inputContent}
                                        style={styles.input}
                                        value={userData.name}
                                        placeholder='Votre nom'
                                        onChangeText={(text) => {
                                            field.onChange(text);
                                            handleChange('name', text)
                                        }} />
                                </View>
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                            </View>
                        }} />}
                    {isEditing && <Controller
                        control={form.control}
                        name="phoneNumber"
                        render={({ field, fieldState }) => {
                            return <View >
                                <View style={styles.field}>
                                    <Text style={styles.label}> Phone</Text>
                                    <TextInput
                                        contentStyle={styles.inputContent}
                                        left={<TextInput.Icon icon="phone-dial-outline" />}
                                        style={styles.input}
                                        placeholder='Votre numero de telephone'
                                        keyboardType="phone-pad"
                                        value={userData.phone}
                                        onChangeText={(text) => {
                                            handleChange('phone', text)
                                            field.onChange(text)
                                        }} />
                                </View>
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                            </View>
                        }} />}
                    <TouchableOpacity onPress={handleEditToggle}
                        style={styles.updatePass}>
                        <Text style={styles.editButton}>{isEditing ? "Enregistrer" : 'Editer votre profile'}</Text>
                    </TouchableOpacity>

                    {updatePassword &&
                        <>
                            <Controller
                                control={form1.control}
                                name="holdPassword"
                                render={({ field, fieldState }) => {
                                    return <View>
                                        <View style={styles.field}>
                                            <Text style={styles.label}>Old password</Text>
                                            <TextInput
                                                contentStyle={styles.inputContent}
                                                left={<TextInput.Icon icon="lock" />}
                                                style={styles.input}
                                                value={field.value || ''}
                                                maxLength={20}
                                                autoCapitalize="none"

                                                placeholder='Old password'
                                                onChangeText={(text) => {
                                                    field.onChange(text)
                                                }}
                                                secureTextEntry={securePasswordEntry}
                                                right={<TextInput.Icon
                                                    onPress={() => setSecurePasswordEntry(!securePasswordEntry)}
                                                    icon={securePasswordEntry ? 'eye-off' : 'eye'}
                                                />} />
                                            {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                                        </View>
                                    </View>
                                }} />


                            <Controller
                                control={form1.control}
                                name="newPassword"
                                render={({ field, fieldState }) => {
                                    return <View style={styles.field}>
                                        <Text style={styles.label}>New password</Text>
                                        <TextInput
                                            contentStyle={styles.inputContent}
                                            left={<TextInput.Icon icon="lock" />}
                                            style={styles.input}
                                            value={field.value || ''}
                                            maxLength={20}
                                            autoCapitalize="none"
                                            placeholder='New password'
                                            onChangeText={(text) => {
                                                field.onChange(text)
                                            }}
                                            secureTextEntry={securePasswordEntry}
                                            right={<TextInput.Icon
                                                onPress={() => setSecurePasswordEntry(!securePasswordEntry)}
                                                icon={securePasswordEntry ? 'eye-off' : 'eye'}

                                            />} />
                                        {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}

                                    </View>
                                }} />
                            <Controller
                                control={form1.control}
                                name="ConfirmNewPassword"
                                render={({ field, fieldState }) => {
                                    return <View style={styles.field}>
                                        <Text style={styles.label}>Confirm new password</Text>
                                        <TextInput
                                            contentStyle={styles.inputContent}
                                            left={<TextInput.Icon icon="lock" />}
                                            style={styles.input}
                                            value={field.value || ''}
                                            maxLength={20}
                                            autoCapitalize="none"
                                            placeholder='Confirm new password'
                                            onChangeText={(text) => {
                                                field.onChange(text)
                                            }}
                                            secureTextEntry={securePasswordEntry}
                                            right={<TextInput.Icon
                                                onPress={() => setSecurePasswordEntry(!securePasswordEntry)}
                                                icon={securePasswordEntry ? 'eye-off' : 'eye'}

                                            />} />
                                        {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}

                                    </View>
                                }} />
                        </>
                    }
                    <TouchableOpacity onPress={handleEditPassWordToggle}
                        style={styles.updatePass}>
                        <Text style={styles.editButton}>{updatePassword ? "Enregistrer" : 'Editer le mot de passe'}</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <CustomerLoader I18n={I18n} theme={theme} color={theme.primary} loading={loading} />
        </View>
    );
};

const style = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.primaryBackground,
    },
    content: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.primaryBackground,
    },
    updatePass: {
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        alignSelf: "center",
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 10,
        marginVertical: 3,
        marginBottom: 30,
        backgroundColor: theme.gray3
    },
    profilePic: {
        alignSelf: "center",
        gap: 10,
        marginBottom: 20,

    },
    editButton: {
        color: '#007BFF',
        ...Theme.fontStyle.montserrat.regular,
        fontSize: 16,

    },
    field: {
        width: '100%',
        marginBottom: 15,
    },
    fabStyle: {
        bottom: 86,
        right: 16,
        position: 'absolute',
        // backgroundColor: theme.primary,
        backgroundColor: theme.primaryBackground,
    },
    label: {
        ...Theme.fontStyle.montserrat.bold,
        fontSize: 18,
        color: theme.primaryText,
        marginBottom: 5,
    },
    value: {
        ...Theme.fontStyle.montserrat.regular,
        fontSize: 18,
        color: theme.primaryText,
    },
    input: {
        ...Theme.fontStyle.montserrat.semiBold,
        color: theme.primaryText,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        paddingHorizontal: 20,
        fontSize: 14,
        backgroundColor: '#fff',
    },
    inputContent: {
        ...Theme.fontStyle.montserrat.semiBold,
        color: theme.primaryText,
        borderWidth: 0,
        borderColor: theme.primaryBackground,
        fontSize: 14,
    },
    textdanger1: {
        margin: 2,
        color: 'red',
        ...Theme.fontStyle.montserrat.italic,
        fontSize: 14,
        marginLeft: 10,
    },
});


export default ProfileScreen;
