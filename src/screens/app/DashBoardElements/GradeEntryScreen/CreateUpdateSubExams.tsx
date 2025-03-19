import { View } from "react-native"
import DateAndNotesPickerSubExams from "./components/DateAndNotesPickerSubExams";
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { I18n } from "i18n";
import { Button as Button1, FAB } from 'react-native-paper';
import moment from "moment";
import useSWRMutation from "swr/mutation";
import { LOCAL_URL, postData, putData } from "apis";
import HorizontalScrollMenu from "./components/HorizontalScrollMenu ";
import dynamicStyles from "./styles";
import { useTheme } from "store";
import { Text } from "react-native";
import { useLayoutEffect, useState } from "react";
import { showCustomMessage, Theme } from "utils";

const today = new Date();
today.setHours(0, 0, 0, 0);

const schema = z.object({
    maxNote: z.string()
        .min(1, { message: I18n.t('validation.note_min_error', { value: 1 }) }) // Note inférieure à 1
        .max(100, { message: I18n.t('validation.note_max_error', { value: 100 }) }), // Note supérieure à 100
    weight: z.string()
        .min(1, { message: I18n.t('validation.note_min_error', { value: 1 }) }) // Note inférieure à 1
        .max(100, { message: I18n.t('validation.note_max_error', { value: 100 }) }), // Note supérieure à 100
    name: z.string()
        .min(5, { message: I18n.t('validation.note_min_error', { value: 1 }) }) // Note inférieure à 1
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
const CreateUpdateSubExams = (props: any): React.JSX.Element => {
    const { navigation, route } = props
    const { items, exam, label, canEdits } = route.params
    const [isLoading, setIsLoading] = useState(false);
    const [canEdit, setCanEdit] = useState(canEdits);
    const GradeEntryText: any = I18n.t("Dashboard.GradeEntry");

    const form = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: items ? {
            maxNote: items && items?.total_marks ? (items.total_marks + '') : '20',
            startDate: (items && items?.start_time ? new Date(items?.start_time) : new Date()),
            endDate: (items && items?.end_time ? new Date(items?.end_time) : undefined),
            weight: items.weight?.toString(),
            name: items && items?.name ? items?.name : '',
        } : {
            maxNote: exam && exam?.total_marks ? (exam.total_marks + '') : '',
            startDate: (exam && exam?.start_date ? new Date(exam?.start_date) : new Date()),
            endDate: (exam && exam?.end_date ? new Date(exam?.end_date) : undefined),
            weight: '',
            name: '',
        },
    });
    const theme = useTheme();
    const styles = dynamicStyles(theme)
    useLayoutEffect(() => {
        navigation.setOptions({
            title: items ? GradeEntryText.updateSubExam : GradeEntryText.createSubExam,
        });
    }, []);
    const { trigger: creacteNewSubExamen } = useSWRMutation(`${LOCAL_URL}/api/crud/sub-exam`, postData);
    const { trigger: updateSubExamen } = useSWRMutation(`${LOCAL_URL}/api/crud/sub-exam/${items?.id}`, postData);
    const isEmptyObject = (obj: any) => {
        return Object.keys(obj).length === 0;
    };
    const handleSubmitUpdate = async () => {
        try {
            await form.trigger();
            const dataForm1 = form.getValues();
            console.log(form.formState.validatingFields, "----------------------", form.formState.isValid, form.formState.errors);
            if (!form.formState.isValid) {
                await form.trigger();
                if (!isEmptyObject(form.formState.errors) || !items) {
                    showCustomMessage("Information", "Tout les champs sont requis", "warning", "bottom")
                    return
                }
            }
            setIsLoading(true)
            const data = {
                "start_time": moment(dataForm1.startDate).format("YYYY-MM-DD hh:mm:ss"),
                "end_time": moment(dataForm1.endDate).format("YYYY-MM-DD hh:mm:ss"),
                "total_marks": parseFloat(dataForm1?.maxNote),
                "weight": parseFloat(dataForm1?.weight),
                "type": items ? items?.type : label,
                "exam_id": exam?.id,
                "name": dataForm1?.name,
            }
            console.log("data form", data);
            try {
                let res = null
                if (items) {
                    res = await updateSubExamen(data)
                } else {
                    res = await creacteNewSubExamen(data)
                }
                if (res && res?.success) {
                    setCanEdit(false);
                    showCustomMessage("Success", "Exam Update success", "success", "center")
                    navigation.goBack();
                } else {
                    showCustomMessage("Information", res.message, "warning", "bottom")
                    return;
                }
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
        <View style={{ margin: 10, backgroundColor: theme.gray, justifyContent: "center", borderRadius: 10, padding: 10, }}>
            <Text style={{ textAlign: "center", ...Theme.fontStyle.inter.bold, color: theme.primaryText, fontSize: 16 }}>{exam?.session_id?.name} - {label?.toUpperCase()}   </Text>
            <Text style={{ textAlign: "center", ...Theme.fontStyle.inter.regular, color: theme.primaryText, fontSize: 16 }}>  {items ? items.name : ''}</Text>
        </View>
        <DateAndNotesPickerSubExams canEdit={canEdit} exam={items} form={form} />
        {canEdit && <View style={{ paddingVertical: 20, }}>
            <Button1
                style={{ backgroundColor: isLoading ? theme.gray : theme.primary, width: 200, alignSelf: "center", marginTop: 10, }}
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
        </View>}

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

export default CreateUpdateSubExams;
