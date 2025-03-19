import { Component } from "react";
// @ts-ignore
import TimeTableView, { genTimeBlock } from 'react-native-timetable';
import { ScrollView, StyleSheet, View } from "react-native";
import { Alert } from "react-native";
import moment, { now } from "moment";
import { CustomerLoader } from "components";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Picker } from "@react-native-picker/picker";
import { Divider } from "react-native-paper";
import { getTimeSlotsForWeek, Theme } from "utils";
import HeaderDashBoad from "./Header";
import React from "react";


interface RenderPickerSemesterProps {
    labels: string
    value: number
    item: Item[],
    onValueChange: (itemValue: number) => void
}
const getDate = (dayOW: number, hours = 0, minutes = 0) => {
    const date = moment(now()).toDate();
    date.setDate(dayOW);
    date.setHours(hours);
    if (minutes != null) {
        date.setMinutes(minutes);
    }
    return date;
};



interface Item {
    id: number,
    labels: string,
    value: number,
}
interface Props {
    theme: any,
    date: Date,
    classRoom: any,
    navigation: any,
    language: string,
    isLoading: boolean,
    I18n: any,
    data: any,

}
interface State {
    numOfDays: number,
    pivotDate: Date,
}
class MyTimetable extends Component<Props, State> {

    timetableRef: any;
    styles: any;

    semesterList: Item[] = [
        { id: 1, labels: "1 jour", value: 1 },
        { id: 2, labels: "2 jours", value: 2 },
        { id: 3, labels: "3 jours", value: 3 },
        { id: 4, labels: "4 jours", value: 4 },
        { id: 5, labels: "5 jours", value: 5 },
        { id: 6, labels: "6 jours", value: 6 },
        { id: 7, labels: "7 jours", value: 7 },
        { id: 8, labels: "30 jours", value: 30 },
    ]
    constructor(props: Props) {
        super(props);
        this.state = {
            numOfDays: 5,
            pivotDate: props.date,
        }
        this.styles = style(props.theme);
    }

    scrollViewRef = (ref: any) => {
        this.timetableRef = ref;
    };

    onEventPress = (evt: any) => {
        Alert.alert("onEventPress", JSON.stringify(evt));
        // this.setState({
        //     numOfDays: 1, // default 5 days
        //     pivotDate: new Date("2024-08-09"),
        // })
    };

    onDateChange = (date: Date) => {
        this.setState({
            pivotDate: date,
            // numOfDays: 1, // default 5 days
        })
    };
    onNDaysChange = (num: number) => {
        this.setState({
            numOfDays: num,
        })
    };


    render() {
        const timtable: any[] = this.props.data ? this.props.data : []
        let transformedStudents = timtable?.map(item =>
        ({
            title: item?.subject_id?.name,
            startTime: new Date(item.start_datetime),
            endTime: new Date(item.end_datetime),
            location: item.classroom_id?.name,
            extra_descriptions: ["All students",],
        })
        );
        let corecttransformedStudents = transformedStudents ? transformedStudents : []
        // corecttransformedStudents?.push(...getTimeSlotsForWeek());
        // corecttransformedStudents = this.props.data;
        // console.log(";;;;;", this.props.data?.data);
        const RenderPicker = ({ item, labels, onValueChange, value }: RenderPickerSemesterProps) => (<>
            <View style={this.styles.header}>
                <Picker
                    itemStyle={{ color: this.props.theme.primaryText, ...Theme.fontStyle.montserrat.bold }}
                    selectedValue={value}
                    onValueChange={(itemValue: number) => onValueChange(itemValue)}
                    style={this.styles.picker}>
                    <Picker.Item
                        style={this.styles.pickerItemStyle}
                        label={labels}
                        value={null} />
                    {item.map((item: Item) => <Picker.Item
                        style={this.styles.pickerItemStyle}
                        key={item.id}
                        label={item.labels?.toString()}
                        value={item.value} />)}
                </Picker>
            </View>
            <Divider />
        </>
        );


        return (<View style={this.styles.container}>
            <HeaderDashBoad
                navigation={this.props.navigation}
                children={this.props.classRoom}
                theme={this.props.theme}
                picker={<RenderPicker
                    item={this.semesterList}
                    value={this.state.numOfDays}
                    onValueChange={this.onNDaysChange}
                    labels="Jours" />}
            />
            <ScrollView>
                {/* <View style={this.styles.inputContainerP}>

                    <View style={this.styles.inputContainer}>
                        <Icon name="calendar-today" size={24} style={this.styles.icon} />
                        <CustomDatePicker
                            date={this.state.pivotDate}
                            onDateChange={this.onDateChange}
                            theme={this.props.theme}
                        />
                    </View>
                    <View style={this.styles.inputContainer}>
                        <RenderPicker item={this.semesterList} value={this.state.numOfDays} onValueChange={this.onNDaysChange} labels="Jours" />
                    </View>
                </View> */}
                <View style={this.styles.container}>
                    <View style={{ padding: 0 }}>
                        <TimeTableView
                            scrollViewRef={this.scrollViewRef}
                            events={corecttransformedStudents && corecttransformedStudents.length > 0 ? corecttransformedStudents : []}
                            pivotTime={7}
                            pivotEndTime={20}
                            pivotDate={this.state.pivotDate}
                            nDays={this.state.numOfDays}
                            onEventPress={this.onEventPress}
                            headerStyle={this.styles.headerStyle}
                            dateHeaderFormat="dddd"
                            locale={this.props.language} />
                    </View>
                </View>

            </ScrollView>
            <CustomerLoader loading={this.props.isLoading} theme={this.props.theme} I18n={this.props.I18n} color={this.props.theme.primary} />

        </View>
        );
    }
};

const style = (theme: any) => StyleSheet.create({
    headerStyle: {
        backgroundColor: theme.primary
    },
    container: {
        flex: 1,
        backgroundColor: theme.primaryBackground,
    },
    title: {
        ...Theme.fontStyle.montserrat.bold,
        color: theme.primaryText,
        fontSize: 18,
    },
    name: {
        ...Theme.fontStyle.montserrat.bold,
        color: theme.primaryText,
        fontSize: 18,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
        borderRadius: 40,
    },
    picker: {
        height: 50,
        padding: 0,
        margin: 0,
        flex: 1,
    },
    pickerItemStyle: { color: "black", ...Theme.fontStyle.montserrat.semiBold, flex: 1, },
    headerContent: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: "100%",
        flexDirection: "row",
        gap: 20,
        alignItems: "center",
        height: 70
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        padding: 2,
        width: '50%',
    },
    inputContainerP: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "space-around",
        borderWidth: 1,
        borderColor: theme.gray,
        marginBottom: 5,
        borderRadius: 10,
        paddingHorizontal: 10,
        padding: 2,
        width: '100%',
    },
    header: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: theme.gray3,
        borderRadius: 10,
        flex: 1,
    },
    icon: {
        marginRight: 0,
        color: theme.primaryText,
    },
});
export default MyTimetable