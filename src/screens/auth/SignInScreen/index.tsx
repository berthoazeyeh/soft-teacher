import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { updateUserStored, useTheme } from "store";
import dynamicStyles from "./style";
import { ActivityIndicator, TextInput } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { showCustomMessage, Theme } from "utils";
import { I18n } from 'i18n';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import useSWR from "swr";
import { Region } from "react-native-maps";
import { CustomerLoader } from "components";
import { getData, LOCAL_URL, postData } from "apis";
import useSWRMutation from 'swr/mutation'
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDispatch } from "react-redux";

const schema = z.object({
    name: z.string()
        .min(5, I18n.t('Login.validation_username_too_short')),
    relation: z.number()
        .min(1, I18n.t('Login.validation_username_too_short')),
    phoneNumber: z.string()
        .min(9, I18n.t('Login.validation_phoneNumber_too_short')),
    email: z.string()
        .min(5, I18n.t('Login.validation_email_invalid'))
        .regex(/^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/, { message: I18n.t('Login.validation_email_invalid') }),
    password: z.string()
        .min(8, { message: I18n.t('Login.validation_password_too_short') })
        .regex(/[A-Z]/, { message: I18n.t('Login.validation_password_uppercase') })
        .regex(/[a-z]/, { message: I18n.t('Login.validation_password_lowercase') })
        .regex(/\d/, { message: I18n.t('Login.validation_password_number') })
});
interface Relationship {
    id: number;
    create_date: string;
    name: string;
}

function SignInScreen(props: any): React.JSX.Element {
    const { navigation } = props;
    const theme = useTheme();
    const styles = dynamicStyles(theme);
    const dispatch = useDispatch();

    const form = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
    });
    const [loading, setLoading] = useState(false);
    const [relationList, setRelationList] = useState([]);

    const [securePasswordEntry, setSecurePasswordEntry] = useState(true);
    const { data, error, isLoading } = useSWR(`${LOCAL_URL}/api/op.parent.relationship/search`,
        getData,
        {
            refreshInterval: 100000,
            refreshWhenHidden: true,
        },
    );

    const { trigger: createNewParrents } = useSWRMutation(`${LOCAL_URL}/api/create/parent`, postData)


    useEffect(() => {
        if (data?.success) {
            setRelationList(data.data);
        }
    }, [data])
    const handleSubmittedFormuler = async (data: any) => {
        console.log(data);

        setLoading(true);
        const parrentData = {
            phone: data.phoneNumber,
            email: data.email,
            name: data.name,
            relationship_id: data.relation,
            password: data.password,
        }

        const response = await createNewParrents(parrentData);
        if (response.success) {
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
            showCustomMessage("Information", response.message, "warning", "bottom")
        }
        console.log(response);
    }


    return (
        <View style={styles.container}>
            <ScrollView>


                <Image
                    source={require("assets/images/parent.jpg")}
                    resizeMode="contain"
                    style={{
                        width: 200,
                        height: 150,
                        alignSelf: "center",
                    }}
                />

                <Text style={styles.title}>{I18n.t('Register.title')}</Text>
                <View style={{ gap: 10 }}>


                    <Controller
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => {

                            return <View >
                                <View style={styles.inputContainer}>
                                    <Icon name="person" size={24} style={styles.icon} />
                                    <TextInput
                                        placeholder={I18n.t('Register.name')}
                                        style={styles.input}
                                        onChange={() => (form.formState.isValid)}
                                        onChangeText={field.onChange}
                                        placeholderTextColor={theme.placeholderTextColor}

                                        value={field.value || ''}
                                        underlineColor={theme.primaryBackground}
                                    />
                                </View>
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                            </View>
                        }} />



                    {/* <Controller
                        control={form.control}
                        name="dob"
                        render={({ field, fieldState }) => (
                            <View>
                                <View style={styles.inputContainer}>
                                    <Icon name="calendar-today" size={24} style={styles.icon} />
                                    <CustomDatePicker
                                        date={field.value}
                                        onDateChange={field.onChange}
                                        theme={theme}
                                    />
                                </View>
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                            </View>)} /> */}


                    <Controller
                        control={form.control}
                        name="phoneNumber"
                        render={({ field, fieldState }) => (<View>

                            <View style={styles.inputContainer}>
                                <Icon name="phone" size={24} style={styles.icon} />
                                <TextInput
                                    placeholder={I18n.t('Register.phone')}
                                    style={styles.input}
                                    value={field.value}
                                    onChange={() => (form.formState.isValid)}
                                    onChangeText={field.onChange}
                                    placeholderTextColor={theme.placeholderTextColor}

                                    keyboardType="phone-pad"
                                    underlineColorAndroid="transparent"
                                    underlineColor={theme.primaryBackground}

                                />
                            </View>
                            {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}

                        </View>)} />


                    <Controller
                        control={form.control}
                        name="relation"
                        render={({ field, fieldState }) => (
                            <View style={{ flex: 1 }}>
                                <View style={styles.inputContainer}>
                                    {isLoading &&
                                        <ActivityIndicator />
                                    }
                                    {!isLoading &&
                                        <Icon name="group" size={24} style={styles.icon} />
                                    }
                                    <Picker
                                        selectedValue={field.value}
                                        onValueChange={(itemValue, itemIndex) => {
                                            field.onChange(itemValue!)
                                            form.formState.isValid
                                        }}
                                        style={{ flex: 1, gap: 0, color: theme.primaryText, fontSize: 1, padding: 0 }}
                                        dropdownIconColor={theme.primary}
                                        mode="dropdown"
                                    >
                                        <Picker.Item style={{ fontSize: 16, ...Theme.fontStyle.montserrat.semiBold }} label={I18n.t('Register.relation')} value={null} />
                                        {relationList.map((relation: Relationship) => {
                                            return <Picker.Item key={relation.id} style={{ fontSize: 16, ...Theme.fontStyle.montserrat.semiBold }} label={relation.name} value={relation.id} />
                                        })}
                                    </Picker >
                                </View>
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                            </View>)} />
                    <Controller
                        control={form.control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <View>
                                <View style={styles.inputContainer}>
                                    <Icon name="email" size={24} style={styles.icon} />
                                    <TextInput
                                        placeholder="Email"
                                        style={styles.input}
                                        value={field.value}
                                        onChange={() => (form.formState.isValid)}
                                        onChangeText={field.onChange}
                                        placeholderTextColor={theme.placeholderTextColor}

                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        underlineColorAndroid="transparent"
                                        underlineColor={theme.primaryBackground}

                                    />
                                </View>
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}

                            </View>

                        )} />

                    <Controller
                        control={form.control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <View>

                                <View style={styles.inputContainer}>
                                    <Icon name="lock" size={24} style={styles.icon} />
                                    <TextInput
                                        placeholder={I18n.t('Register.password')}
                                        style={styles.input}
                                        value={field.value}
                                        onChange={() => (form.formState.isValid)}
                                        onChangeText={field.onChange}
                                        placeholderTextColor={theme.placeholderTextColor}
                                        underlineColorAndroid="transparent"
                                        underlineColor={theme.primaryBackground}
                                        secureTextEntry={securePasswordEntry}
                                    />
                                    <TouchableOpacity onPress={() => setSecurePasswordEntry(!securePasswordEntry)}>
                                        <MaterialCommunityIcons
                                            name={securePasswordEntry ? 'eye-off' : 'eye'}
                                            size={24}
                                            style={styles.icon1}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}

                            </View>
                        )} />
                </View>
                <TouchableOpacity style={styles.button} onPress={() => {
                    if (!form.formState.isValid) {
                        console.log("----------------------", form.formState.isValid);
                        showCustomMessage("Information", I18n.t('Register.all_fields_required'), "warning", "bottom")
                        form.handleSubmit(handleSubmittedFormuler)();

                        return;
                    }
                    form.handleSubmit(handleSubmittedFormuler)();
                }}>
                    <Text style={styles.buttonText}> {I18n.t('Register.signing')}
                    </Text>
                </TouchableOpacity>
                <CustomerLoader loading={loading} theme={theme} I18n={I18n} color={theme.primary} />
            </ScrollView>
        </View>
    );
}
export default SignInScreen;

