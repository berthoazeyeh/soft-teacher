import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { AddAssignmentScreen, AttendanceScreen, CourcesListeScreen, GradeEntryScreen, MyAbsencesScreen, MyAssignmentScreen, MyCourcesScreen, MyTimeTableScreen, NotebookScreen, PastReportCardsScreen, StudentDetailsScreen, StudentListScreen } from 'screens';

export type AuthStackList = {
    StudentListScreen: undefined;
    MyTimeTableScreen: undefined;
    MyCourcesScreen: undefined;
    PastReportCardsScreen: undefined;
    NotebookScreen: undefined;
    MyAbsencesScreen: undefined;
    GradeEntryScreen: undefined;
    AttendanceScreen: undefined;
    CourcesListeScreen: undefined;
    MyAssignmentScreen: undefined;
};
interface Item {
    name: string;
    screen: React.ComponentType<any>;
    haveHeader?: boolean;
}

const elements: Item[] = [
    // { name: "StudentListScreen", screen: StudentListScreen, haveHeader: false },
    { name: "MyTimeTableScreen", screen: MyTimeTableScreen, haveHeader: true },
    { name: "MyCourcesScreen", screen: MyCourcesScreen, haveHeader: false },
    { name: "PastReportCardsScreen", screen: PastReportCardsScreen, haveHeader: false },
    { name: "NotebookScreen", screen: NotebookScreen, haveHeader: false },
    { name: "MyAbsencesScreen", screen: MyAbsencesScreen, haveHeader: true },
    { name: "GradeEntryScreen", screen: GradeEntryScreen, haveHeader: false },
    { name: "AttendanceScreen", screen: AttendanceScreen, haveHeader: false },
    { name: "CourcesListeScreen", screen: CourcesListeScreen, haveHeader: false },
    { name: "StudentDetailsScreen", screen: StudentDetailsScreen, haveHeader: false },
    { name: "MyAssignmentScreen", screen: MyAssignmentScreen, haveHeader: false },
    { name: "AddAssignmentScreen", screen: AddAssignmentScreen, haveHeader: false },
];
const DashboadElementStack = createStackNavigator<AuthStackList>()

const DashboadElementStacks = () => {
    return (
        <DashboadElementStack.Navigator
            screenOptions={{
                headerBackTitleVisible: false,
            }}
            initialRouteName="StudentListScreen">
            <DashboadElementStack.Screen
                options={{ headerShown: false }}
                name="StudentListScreen"
                component={StudentListScreen}
            />

            {
                elements.map((element) => <DashboadElementStack.Screen
                    key={element.name}
                    options={{ headerShown: element.haveHeader }}
                    // @ts-ignore
                    name={element.name}
                    component={element.screen}
                />)
            }


        </DashboadElementStack.Navigator>
    )
}



export default DashboadElementStacks
