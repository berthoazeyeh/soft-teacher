import React, { useState } from 'react';
import { View, TextInput, Text, Button, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { Theme } from 'utils';
import { useTheme } from 'store';
import { Controller } from 'react-hook-form';
import { I18n } from 'i18n';



const DateAndNotesPicker = ({ canEdit, exam, form }: { canEdit: boolean, exam: any, form: any }) => {

    const [startDate, setStartDate] = useState<Date | null>(exam && exam?.start_time ? new Date(exam?.start_time) : new Date());
    const [endDate, setEndDate] = useState<Date | null>(exam && exam?.end_time ? new Date(exam?.end_time) : null);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const theme = useTheme();
    const styles = style(theme);


    const GradeEntryText: any = I18n.t("Dashboard.GradeEntry");

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <View style={styles.datePicker}>
                    <Controller
                        control={form.control}
                        name="startDate"
                        render={({ field, fieldState }) => (
                            <View>
                                <Text style={{ ...Theme.fontStyle.montserrat.semiBold, color: theme.primaryText, fontSize: 15, }}>{GradeEntryText.label_start_date}</Text>
                                <Button
                                    disabled={!canEdit}
                                    title={field.value ? moment(field.value).format("LLLL") : GradeEntryText.choose}
                                    onPress={() => setShowStartPicker(true)}
                                />
                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}

                                {showStartPicker && (
                                    <DateTimePicker
                                        value={startDate || new Date()}
                                        mode="date"
                                        display="default"
                                        minimumDate={new Date()}
                                        onChange={(event, date) => {
                                            setShowStartPicker(false);
                                            if (date) {
                                                field.onChange(date);
                                                setStartDate(date);
                                            }
                                        }}
                                    />
                                )}
                            </View>)} />
                </View>

                <View style={styles.datePicker}>

                    <Controller
                        control={form.control}
                        name="endDate"
                        render={({ field, fieldState }) => (
                            <View>
                                <Text style={{ ...Theme.fontStyle.montserrat.semiBold, color: theme.primaryText, fontSize: 15, }}>{GradeEntryText.label_end_date}</Text>
                                <Button
                                    disabled={!canEdit}

                                    title={field.value ? moment(field.value).format("LLLL") : GradeEntryText.choose}
                                    onPress={() => setShowEndPicker(true)}
                                />

                                {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                                {showEndPicker && (
                                    <DateTimePicker
                                        value={endDate || new Date()}
                                        mode="date"
                                        display="default"
                                        minimumDate={startDate ?? new Date()}
                                        onChange={(event, date) => {
                                            setShowEndPicker(false);
                                            if (date) {
                                                field.onChange(date);
                                                setEndDate(date);
                                            }
                                        }}
                                    />
                                )}
                            </View>)} />
                </View>
            </View>

            {/* Notes Inputs */}
            {/* <View style={styles.row}> */}
            <Controller
                control={form.control}
                name="maxNote"
                render={({ field, fieldState }) => (
                    <>

                        <View style={styles.inputContainer}>

                            <Text style={{ ...Theme.fontStyle.montserrat.semiBold, color: theme.primaryText, fontSize: 15, }}>{GradeEntryText.label_total_note}</Text>
                            <TextInput
                                style={styles.input}
                                editable={canEdit}
                                textAlign='center'
                                maxLength={3}
                                keyboardType="numeric"
                                value={field.value || ''}
                                onChangeText={field.onChange}
                                placeholder={GradeEntryText.placeholder_max_note}

                            />
                            {fieldState.invalid && <Text style={styles.textdanger1}>{fieldState?.error?.message}</Text>}
                        </View>
                    </>)} />

            {/* <View style={styles.inputContainer}>
                    <Text style={{ ...Theme.fontStyle.montserrat.semiBold, color: theme.primaryText, fontSize: 15, }}>Note minimale:</Text>
                    <TextInput
                        style={styles.input}
                        editable={canEdit}
                        maxLength={3}
                        keyboardType="numeric"
                        textAlign='center'
                        value={minNote}
                        onChangeText={setMinNote}
                        placeholder="Min note"
                        multiline={false}
                        numberOfLines={1}


                    />
                </View> */}
            {/* </View> */}

        </View>
    );
};

const style = (theme: any) => StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: "flex-start",
        marginBottom: 10,
    },
    textdanger1: {
        margin: 2,
        color: 'red',
        ...Theme.fontStyle.montserrat.regular,
        fontSize: 12
    },
    buttonLabel: {
        color: theme.secondaryText,
        fontSize: 20,
        ...Theme.fontStyle.montserrat.semiBold,
    },
    loginText: {
        color: theme.secondaryText,
        fontSize: 16,
        letterSpacing: 1.7,
        ...Theme.fontStyle.montserrat.bold,

    },
    datePicker: {
        flex: 1,
        marginHorizontal: 10,
        gap: 10,
    },
    inputContainer: {
        flex: 1,
        marginHorizontal: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        fontSize: 16,
        ...Theme.fontStyle.montserrat.bold,
        marginTop: 5,

    },
});

export default DateAndNotesPicker;
