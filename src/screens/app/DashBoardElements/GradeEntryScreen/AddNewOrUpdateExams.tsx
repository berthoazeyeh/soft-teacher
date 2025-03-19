import { useCallback, useLayoutEffect, useState } from "react";
import { ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useCurrentUser, useTheme } from "store";
import dynamicStyles from "./styles";
import { showCustomMessage, Theme } from "utils";
import { I18n } from "i18n";
import DateAndNotesPicker from "./components/DateAndNotesPicker";
import { AnimatedFAB, Divider, FAB, } from "react-native-paper";
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button as Button1 } from 'react-native-paper';
import moment from "moment";
import useSWRMutation from "swr/mutation";
import { getData, LOCAL_URL, postData, putData } from "apis";
import HorizontalScrollMenu from "./components/HorizontalScrollMenu ";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

const today = new Date();
today.setHours(0, 0, 0, 0);


const schema = z.object({
    maxNote: z.string()
        .min(1, { message: I18n.t('validation.note_min_error', { value: 1 }) }) // Note inférieure à 1
        .max(100, { message: I18n.t('validation.note_max_error', { value: 100 }) }), // Note supérieure à 100
    dsCcWeight: z.string()
        .min(1, { message: I18n.t('validation.note_min_error', { value: 1 }) }) // Note inférieure à 1
        .max(100, { message: I18n.t('validation.note_max_error', { value: 100 }) }), // Note supérieure à 100

    startDate: z.date()
        .refine((date) => date >= today, {
            message: I18n.t('validation.start_date_error'), // Date de début inférieure à aujourd'hui
        }),

    endDate: z.date()
        .refine((date) => date >= today, {
            message: I18n.t('validation.end_date_error_today'), // Date de fin inférieure à aujourd'hui
        })

})
    .refine((data) => {
        const startDate = data.startDate; // Récupère la startDate pour comparer
        const twoDaysLater = new Date(startDate);
        twoDaysLater.setDate(startDate.getDate() + 2); // Ajoute 2 jours à la startDate
        return data.endDate >= twoDaysLater;
    }, {
        message: I18n.t('validation.end_date_error_start'), // Date de fin inférieure à startDate + 2 jours
        path: ['endDate'],
    })

const formSchema = z.object({
    poid: z.string().min(1, { message: I18n.t('validation.note_min_error', { value: 1 }) }) // Note inférieure à 1
        .max(100, { message: I18n.t('validation.note_max_error', { value: 100 }) }),
    nombre: z.string().min(1, { message: I18n.t('validation.note_min_error', { value: 1 }) }) // Note inférieure à 1
        .max(100, { message: I18n.t('validation.note_max_error', { value: 100 }) }),
});
const formsSchema = z.array(formSchema);

type FormData1 = z.infer<typeof formSchema>;

export const dataStucture = { "q1": ["DS1", "DS2", "CC", "MS",], "q2": ["DS3", "DS4", "CC", "MS",], "q3": ["DS5", "SI",] }

function AddNewOrUpdateExams(props: any): React.JSX.Element {
    const { navigation, route } = props
    const [isLoading, setIsLoading] = useState(false);
    const { classRoom, session, exam: exams, subject } = route.params
    const theme = useTheme()
    const styles = dynamicStyles(theme)
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [exam, setExam] = useState<any>(exams);
    const [canEdit, setCanEdit] = useState(exam ? false : true)
    const [globalError, setGlobalError] = useState<string | undefined>(undefined)
    const [totalPoint, setTotalPoint] = useState<number | undefined>(100)
    const user = useCurrentUser();
    const GradeEntryText: any = I18n.t("Dashboard.GradeEntry");

    const form = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            maxNote: exam && exam?.total_marks ? (exam.total_marks + '') : '20',
            startDate: (exam && exam?.start_date ? new Date(exam?.start_date) : new Date()),
            endDate: (exam && exam?.end_date ? new Date(exam?.end_date) : undefined),
            dsCcWeight: '50',
        },
    });

    useFocusEffect(
        useCallback(() => {
            GetExamByID();
            return () => {
            };
        }, [])
    );

    const { trigger: creacteNewExamenForSubject } = useSWRMutation(`${LOCAL_URL}/api/create/exam`, postData);
    const { trigger: updateExamenForSubject } = useSWRMutation(`${LOCAL_URL}/api/update/exam/${exam?.id}`, postData);
    const { trigger: getExamByID } = useSWRMutation(`${LOCAL_URL}/api/get-exam//${exam?.id}`, getData);

    const postNewExamenForSubjects = async (data: any) => {
        setIsLoading(true)
        try {
            const res = await creacteNewExamenForSubject(data)
            console.log(res);
            if (!res?.success) {
                showCustomMessage("Information", res.message, "warning", "bottom")
                return;
            }
            setExam(res.data);
            setCanEdit(false);
            showCustomMessage("Success", "Exam Creted success", "success", "center")
        } catch (error: any) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + error?.message, "warning", "bottom")
        } finally {
            setIsLoading(false)
        }
    };
    const GetExamByID = async () => {
        setIsLoading(true)
        try {
            const res = await getExamByID()
            // console.log("getExamByID", res);
            if (!res?.success) return;
            setExam(res.data);
            setCanEdit(false);
        } catch (error: any) {
            showCustomMessage("Information", GradeEntryText.message_error + error?.message, "warning", "bottom")
        } finally {
            setIsLoading(false)
        }
    };
    useLayoutEffect(() => {
        navigation.setOptions({
            title: GradeEntryText.newpartiel,
        });

    }, []);


    const list = dataStucture[session.exam_type.code as keyof typeof dataStucture] || [];

    const dataExams = exam ? list.reduce((result, label, index) => {
        const item = exam[label.toLowerCase() as keyof typeof dataStucture];
        result[label.toLowerCase()] = item
            ? item
            : null;
        return result;
    }, {} as Record<string, any | null>) : {};
    const flattenedData = Object.entries(dataExams)


    const initialForms1 = [...list.slice(0, list.length - 1).map(() => ({
        nombre: '3',
        poid: (session.exam_type.code === "q3" ? 50 : (100 / (list.length - 1))).toString(),
    })), ...list.slice(list.length - 1, list.length).map(() => ({
        nombre: '3',
        poid: (50).toString(),
    }))];

    const [forms1, setForms1] = useState<FormData1[]>(initialForms1);
    const [errors, setErrors] = useState<Record<number, { nombre?: string; poid?: string }>>({});
    const handleInputChange1 = (index: number, field: keyof FormData1, value: string) => {
        const updatedForms: FormData1[] = [...forms1];
        if (field === "nombre") {
            updatedForms[index][field] = value.length > 0 ? parseInt(value).toString() : '';
        } else {
            updatedForms[index][field] = value;
        }
        setForms1(updatedForms);
        const totalWeight = updatedForms.reduce((sum, form) => sum + (parseFloat(form.poid || "0") || 0), 0);
        if (totalWeight > 100) {
            // setGlobalError(`La somme des poids ne doit pas dépasser 100. ${totalWeight}>100`)
            setTotalPoint(totalWeight)
        } else if (totalWeight > 0) {
            setGlobalError(undefined)
            setTotalPoint(totalWeight)
        } else {
            setTotalPoint(undefined)
        }
        let fieldSchema = z.object({
            [field]: z.number().min(0, "Ce champ est requis").max(100, "le poid ne dois pas depassé 100"), // Personnalisez les règles selon vos besoins
        });
        if (field === "nombre") {
            fieldSchema = z.object({
                [field]: z.number().min(0, "Ce champ est requis").max(10, "Pas plus de 10 sous examen"), // Personnalisez les règles selon vos besoins
            });
        }
        const validationResult = fieldSchema.safeParse({ [field]: parseFloat(value) });
        setErrors((prev) => ({
            ...prev,
            [index]: { ...prev[index], [field]: validationResult.success ? undefined : validationResult.error.errors[0]?.message, },
        }));
    };




    const books: any[] = [
        {
            title: "DS1-TS1-1",
            isbn: "978-0-06-112008-4",
            genre: "Fiction",
            language: "English",
            edition: "25%"
        },
        {
            title: "DS1-TS1-2",
            isbn: "978-0-452-28423-4",
            genre: "Dystopian",
            language: "English",
            edition: "25%"
        },
        {
            title: "DS1-TS1-3",
            isbn: "978-0-14-243724-7",
            genre: "Adventure",
            language: "English",
            edition: "25%"
        },
        {
            title: "DS1-TS1-1",
            isbn: "978-0-19-953556-9",
            genre: "Romance",
            language: "English",
            edition: "25%"
        },
    ];


    const handleSubmit = async () => {
        try {
            // console.log(form);
            form.handleSubmit((d) => { })();
            await form.trigger();

            formsSchema.parse(forms1); // Valide tous les formulaires
            if (!form.formState.isValid) {
                await form.trigger();

                console.log("----------------------", form.formState.isValid);
                showCustomMessage("Information", "Tout les champs sont requis", "warning", "bottom")
                form.handleSubmit((d) => { })();
                return
            }
            const combined = list.reduce((result, label, index) => {
                const item = forms1[index];
                result[label.toLowerCase()] = item
                    ? { weight: parseFloat(item.poid), number_sub_exam: parseFloat(item.nombre) } // Renomme les clés
                    : null; // Associe null si l'index est hors limites
                return result;
            }, {} as Record<string, { weight: number; number_sub_exam: number } | null>);
            const dataForm1 = form.getValues();
            const dataSub = {
                "subject_id": subject?.id,
                "session_id": session?.id,
                "start_date": moment(dataForm1.startDate).format("YYYY-MM-DD"),
                "end_date": moment(dataForm1.endDate).format("YYYY-MM-DD"),
                "total_marks": parseFloat(dataForm1?.maxNote),
                "min_marks": 10,
                "faculty_id": user?.id,
                "ds_cc_weight": parseFloat(dataForm1?.dsCcWeight),
                ...combined
            }
            postNewExamenForSubjects(dataSub);
        } catch (e) {
            if (e instanceof z.ZodError) {
                // Gère les erreurs de validation Zod
                const validationErrors: Record<number, { poid?: string; nombre?: string }> = {};
                e.errors.forEach((error) => {
                    const [index, field] = error.path;
                    if (typeof index === "number" && typeof field === "string") {
                        if (!validationErrors[index]) validationErrors[index] = {};
                        validationErrors[index][field as keyof FormData1] = error.message;
                    }
                });
                setErrors(validationErrors);
                const sortedErrors = Object.keys(validationErrors)
                    .map(Number)
                    .sort((a, b) => a - b)
                    .map((index) => index,);
                if (sortedErrors.length > 0) {
                    setSelectedIndex(sortedErrors[0])
                    return
                }
            }
        }
    };

    const isEmptyObject = (obj: any) => {
        return Object.keys(obj).length === 0;
    };
    const handleSubmitUpdate = async () => {
        try {
            // form.handleSubmit((d) => { })();
            form.setValue("dsCcWeight", form.getValues().dsCcWeight);
            form.setValue("startDate", form.getValues().startDate)
            form.setValue("endDate", form.getValues().endDate)
            form.setValue("maxNote", form.getValues().maxNote)
            const dataForm1 = form.getValues();
            console.log(form.formState.isSubmitSuccessful);

            if (!form.formState.isValid) {
                if (!isEmptyObject(form.formState.errors)) {
                    console.log("----------------------", form.formState.isValid);
                    showCustomMessage("Information", "Tout les champs sont requis", "warning", "bottom")
                    form.handleSubmit((d) => { })();
                    return
                }
            }

            setIsLoading(true)

            const data = {
                "start_date": moment(dataForm1.startDate).format("YYYY-MM-DD"),
                "end_date": moment(dataForm1.endDate).format("YYYY-MM-DD"),
                "total_marks": parseFloat(dataForm1?.maxNote),
            }
            try {
                const assigma = await updateExamenForSubject(data)
                console.log(assigma);
                if (!assigma?.success) {
                    showCustomMessage("Information", assigma.message, "warning", "bottom")
                    return;
                }
                setCanEdit(false);
                showCustomMessage("Success", "Exam Update success", "success", "center")
            } catch (error: any) {
                showCustomMessage("Information", 'Une erreur s\'est produite :' + error?.message, "warning", "bottom")
            } finally {
                setIsLoading(false)
            }

        } catch (e) {

        }
    };

    return <View style={styles.container}>
        <ScrollView>
            <View style={{ backgroundColor: "#FFFFFF", elevation: 2, }}>
                <ItemRow lab1={GradeEntryText.class} lab2={GradeEntryText.session} value1={classRoom.name} value2={session?.name} theme={theme} />
                <ItemRow lab1={GradeEntryText.related_course} value1={subject.name} theme={theme} />
                <DateAndNotesPicker canEdit={canEdit} exam={exam} form={form} />
            </View>

            {exam && canEdit && <View>
                <Button1
                    style={{ backgroundColor: isLoading ? theme.gray : theme.primary, width: 200, alignSelf: "center", marginVertical: 15, }}
                    onPress={() => {
                        handleSubmitUpdate();
                    }
                    }
                    loading={isLoading}
                    disabled={isLoading}
                    elevation={3}
                    labelStyle={styles.buttonLabel}
                    mode="elevated"
                >
                    {!isLoading &&
                        <Text style={styles.loginText}>{GradeEntryText.save}</Text>
                    }
                </Button1>
            </View>

            }
            <Divider />
            {!exam && <ScrollView horizontal
                showsHorizontalScrollIndicator={false}
            >
                <View style={{ flexDirection: "row", paddingHorizontal: 0, elevation: 4, backgroundColor: "#FFFFFF", }}>
                    {list.map((item, index) => {
                        return (
                            <TouchableOpacity key={index.toString()} style={{
                                borderWidth: 1.4,
                                borderColor: index === selectedIndex ? theme.primary : '#ccc',
                                paddingHorizontal: 15,
                                paddingVertical: 4,
                                backgroundColor: index === selectedIndex ? theme.primary : "white"
                            }}
                                onPress={() => {
                                    setSelectedIndex(index)
                                }}
                            >
                                <Text style={{ color: index === selectedIndex ? theme.secondaryText : theme.primaryText, ...Theme.fontStyle.montserrat.regular, fontSize: 15 }}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        )
                    })}
                </View>
            </ScrollView>}
            {exam && <ScrollView horizontal
                showsHorizontalScrollIndicator={false} >
                <View style={{ flexDirection: "row", paddingHorizontal: 0, elevation: 4, backgroundColor: "#FFFFFF", }}>
                    {flattenedData.map(([key, items], index) => {
                        return (
                            <TouchableOpacity key={index.toString()} style={{
                                borderWidth: 1.4,
                                borderColor: index === selectedIndex ? theme.primary : '#ccc',
                                paddingHorizontal: 15,
                                paddingVertical: 4,
                                backgroundColor: index === selectedIndex ? theme.primary : "white"
                            }}
                                onPress={() => {
                                    setSelectedIndex(index)
                                }}
                            >
                                <Text style={{ color: index === selectedIndex ? theme.secondaryText : theme.primaryText, ...Theme.fontStyle.montserrat.regular, fontSize: 15 }}>
                                    {key.toUpperCase()}
                                </Text>
                            </TouchableOpacity>

                        )
                    })}
                </View>
            </ScrollView>}

            {flattenedData.map(([key, items], index) => {
                if (selectedIndex === index)
                    return (
                        <HorizontalScrollMenu key={index} index={index} items={items} theme={theme} navigation={navigation} setExam={setExam} exam={exam} label={key} />
                    )
            })}


            <Divider />
            {!exam && (

                forms1.map((item, index) => {
                    if (selectedIndex === index)
                        return (
                            <View key={index.toString()} style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: "flex-start",
                                marginTop: 20,
                            }}>
                                <View style={{
                                    flex: 1,
                                    marginHorizontal: 10,
                                }}>
                                    <Text style={{ ...Theme.fontStyle.montserrat.semiBold, color: theme.primaryText, fontSize: 15, }}>
                                        {GradeEntryText.exam_weight}
                                    </Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#ccc',
                                            padding: 10,
                                            borderRadius: 5,
                                            fontSize: 14,
                                            ...Theme.fontStyle.montserrat.semiBold,
                                            marginTop: 5,
                                        }}
                                        textAlign='center'
                                        maxLength={5}
                                        keyboardType="numeric"
                                        value={item.poid.toString()}
                                        onChangeText={(text) => handleInputChange1(index, "poid", text)}
                                        placeholder="Poid"
                                    />
                                    {errors[index]?.poid && (
                                        <Text style={styles.error}>{errors[index]?.poid}</Text>
                                    )}
                                </View>

                                <View style={{
                                    flex: 1,
                                    marginHorizontal: 10,
                                }}>
                                    <Text
                                        style={{ ...Theme.fontStyle.montserrat.semiBold, color: theme.primaryText, fontSize: 14, }}>
                                        {GradeEntryText.num_sub_exams}</Text>
                                    <TextInput
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#ccc',
                                            padding: 10,
                                            borderRadius: 5,
                                            fontSize: 14,
                                            ...Theme.fontStyle.montserrat.semiBold,
                                            marginTop: 5,
                                        }}
                                        maxLength={2}
                                        keyboardType="numeric"
                                        textAlign='center'
                                        value={item.nombre.toString()}
                                        onChangeText={(text) => handleInputChange1(index, "nombre", text)}
                                        placeholder={GradeEntryText.sub_exam}
                                        multiline={false}
                                        numberOfLines={1}
                                    />
                                    {errors[index]?.nombre && (
                                        <Text style={styles.error}>{errors[index]?.nombre}</Text>
                                    )}
                                </View>
                            </View>
                        )
                })
            )
            }
            {!exam && (selectedIndex === list.length - 1) && session.exam_type.code != "q3" && <>
                <Divider style={{ marginTop: 15, height: 1 }} />
                <Controller
                    control={form.control}
                    name="dsCcWeight"
                    render={({ field, fieldState }) => (
                        <>
                            <View style={styles.inputContainerC}>
                                <Text style={{ ...Theme.fontStyle.montserrat.semiBold, color: theme.primaryText, fontSize: 15, }}> Poid des DS et CC:</Text>
                                <TextInput
                                    style={styles.input1}
                                    editable={true}
                                    textAlign='center'
                                    maxLength={3}
                                    keyboardType="numeric"
                                    value={field.value || ''}
                                    onChangeText={field.onChange}
                                    placeholder={GradeEntryText.ds_cc_weight}
                                />
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                            </View>
                        </>)} />

            </>}
            {!exam &&
                totalPoint && !globalError && totalPoint > 1 && (
                    <Text style={{ color: theme.primary, marginTop: 20, textAlign: "center" }}>
                        {GradeEntryText.total_weight}: {totalPoint?.toString()}
                    </Text>
                )}
            {
                !exam && globalError && (
                    <Text style={{ color: "red", marginTop: 20, textAlign: "center" }}>
                        {globalError}
                    </Text>
                )}


            {!exam && <View>
                <Button1
                    style={{ backgroundColor: isLoading ? theme.gray : theme.primary, width: 200, alignSelf: "center", marginTop: 10, }}
                    onPress={() => {
                        handleSubmit();
                    }
                    }
                    loading={isLoading}
                    disabled={isLoading}
                    elevation={3}
                    labelStyle={styles.buttonLabel}
                    mode="elevated"
                >

                    {!isLoading &&
                        <Text style={styles.loginText}>{GradeEntryText.save}</Text>
                    }
                </Button1>
            </View>}



            <View style={{ height: 50 }} />
        </ScrollView>
        {!canEdit &&
            <FAB
                icon="update"
                onPress={() => setCanEdit(true)}
                visible={true}
                color={theme.secondaryText}
                style={styles.fabStyle}
            />
        }
    </View>
}

type ItemRowType = {
    lab1: string;
    value1: string;
    lab2?: string;
    value2?: string;
    theme: any;
}
const ItemRow: (f: ItemRowType) => React.JSX.Element = ({ lab1, lab2, value1, value2, theme }: ItemRowType) => {
    return (
        <View style={{ backgroundColor: theme.gray, flexDirection: "row", paddingVertical: 5, margin: 5, justifyContent: lab2 ? "space-around" : "center", paddingHorizontal: 15, borderBottomStartRadius: 15, borderTopRightRadius: 15 }}>
            <View style={{ gap: 3, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: theme.primaryText, ...Theme.fontStyle.montserrat.regular, fontSize: 15 }}>{lab1}</Text>
                <Text style={{ color: theme.primaryText, ...Theme.fontStyle.montserrat.bold, fontSize: 18 }}>{value1}</Text>
            </View>
            {lab2 && <View style={{ gap: 3, justifyContent: "center", alignItems: "center" }}>
                <Text style={{ color: theme.primaryText, ...Theme.fontStyle.montserrat.regular, fontSize: 15 }}>{lab2}</Text>
                <Text style={{ color: theme.primaryText, ...Theme.fontStyle.montserrat.bold, fontSize: 18 }}>{value2}</Text>
            </View>}
        </View>
    )
}


export default AddNewOrUpdateExams;