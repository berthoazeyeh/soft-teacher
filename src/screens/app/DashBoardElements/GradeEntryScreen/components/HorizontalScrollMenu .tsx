import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { showCustomMessage, Theme } from 'utils';
import { useTheme } from 'store';
import dynamicStyles from '../styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DataTable } from 'react-native-paper';
import Collapsible from 'react-native-collapsible';
import { deleteData, getData, LOCAL_URL } from 'apis';
import { ActivityIndicator } from 'react-native';
import useSWRMutation from 'swr/mutation';
import { I18n } from 'i18n';

// api/get-exam/id-exam


const HorizontalScrollMenu = (props: any): React.JSX.Element => {
    const { items, theme, index, navigation, setExam, exam, label } = props;
    const styles = createStyles(theme);
    const GradeEntryText: any = I18n.t("Dashboard.GradeEntry");

    return (
        <View key={index?.toString()} style={styles.container}>
            <DataTable>
                {items && items.map((item: any, index1: number) => (
                    <DataTableItem label={label} item={item} keys={index1} key={index1} theme={theme} navigation={navigation} setExam={setExam} exam={exam} />
                ))}
            </DataTable>
            <TouchableOpacity
                style={{ paddingHorizontal: 10, }}
                onPress={() => {
                    navigation.navigate("CreateUpdateSubExams", { items: null, exam, label, canEdits: true })
                }}
            >
                <Text style={{ ...Theme.fontStyle.montserrat.italic, color: theme.primary, fontSize: 15 }}>{GradeEntryText.add_plus}</Text>
            </TouchableOpacity>
        </View>
    );
};



const DataTableItem = (props: any): React.JSX.Element => {
    const { item, theme, navigation, keys, exam, label } = props;
    const styles = createStyles(theme);
    const GradeEntryText: any = I18n.t("Dashboard.GradeEntry");


    return (
        <TouchableOpacity key={keys} style={styles.container}
            onPress={() => {
                navigation.navigate("CreateUpdateSubExams", { items: item, exam, label, canEdits: false })
            }}
        >
            <DataTable.Row key={item.isbn} style={styles.row}>
                <DataTable.Cell style={styles.cell}>
                    <View style={styles.cellView}>
                        <Text style={styles.dayText}>
                            {item.name}
                        </Text>
                    </View>
                </DataTable.Cell>
                <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
                    <TextInput
                        placeholder={GradeEntryText.weight1}
                        value={(item.weight).toString().slice(0, 5) + " %"}
                        verticalAlign="middle"
                        onChangeText={(text) => () => { }}
                        style={styles.input}
                        editable={false}
                        textAlign="center"
                        textAlignVertical="center"
                        keyboardType="numeric"
                        numberOfLines={1}
                        maxLength={9} />

                    {/* <TouchableOpacity
                        onPress={async () => {
                            // const examRes = await getExam();
                            // console.log(examRes);

                            setIsLoading(true);
                            try {
                                const res = await deleteData(`${LOCAL_URL}/api/op.sub.exam/${item?.id}`, { arg: {} });
                                if (res.success) {
                                    showCustomMessage("Success", "Exam Creted success", "success", "center")
                                } else {

                                    showCustomMessage("Information", 'Une erreur s\'est produite :' + res?.message, "warning", "bottom")
                                }
                            } catch (error: any) {
                                showCustomMessage("Information", 'Une erreur s\'est produite :' + error?.message, "warning", "bottom")
                                console.log(error);
                            }
                        }}
                        style={styles.collapseToggle}>
                        {isLoading && <ActivityIndicator />}
                        <MaterialCommunityIcons
                            name={"delete"}
                            color={'red'}
                            size={25}
                        />
                    </TouchableOpacity> */}

                </View>
            </DataTable.Row>


        </TouchableOpacity>
    );
};


const createStyles = (theme: any) => StyleSheet.create({
    container: {
        marginVertical: 15,
    },
    row: {
        width: "100%",
        alignItems: "center",
    },
    input: {
        borderColor: '#ccc',
        borderWidth: 1,
        alignItems: "center",
        borderRadius: 5,
        height: 35,
        width: 80,
        textAlign: "center",
        paddingHorizontal: 7,
        fontSize: 14,
        color: theme.primaryText,
        backgroundColor: theme.gray,
        ...Theme.fontStyle.montserrat.bold
    },
    cell: {
        flex: 1,
    },
    cellView: {
        flex: 1,
        flexDirection: "column",
    },
    cad: {
        flex: 1,
        marginHorizontal: 5, // Space between cards
    },
    dayText: {
        ...Theme.fontStyle.montserrat.bold,
        fontSize: 16,
        color: theme.primaryText,
    },
    dateText: {
        ...Theme.fontStyle.montserrat.regular,
        color: theme.primaryText,
    },
    iconCell: {
        alignItems: "center",
        justifyContent: "center",
    },
    collapseToggle: {
        justifyContent: "flex-end",
        alignSelf: "center",
        textAlign: "right",
        ...Theme.fontStyle.montserrat.bold,
        color: theme.primary,
    },
    collapsibleContainer: {
        backgroundColor: theme.gray3,
        borderRadius: 10,
        padding: 10,
        marginVertical: 10,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    collapsibleText: {
        ...Theme.fontStyle.montserrat.semiBold,
        color: theme.primaryText,
    },
    boldText: {
        ...Theme.fontStyle.montserrat.bold,
    },
    remark: {
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 10,
        width: "100%",
        marginVertical: 5,
        textAlign: "center",
        ...Theme.fontStyle.montserrat.semiBold,
        borderColor: theme.gray4,
        color: theme.primaryText,
    },
    italicText: {
        ...Theme.fontStyle.montserrat.italic,
    },
});



export default HorizontalScrollMenu;
