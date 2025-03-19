import { createStackNavigator } from '@react-navigation/stack'
import React from 'react'
import { AddAssignmentScreen, AddNewOrUpdateExams, AssignmemtRenderStudentListScreen, AttendanceScreen, CourcesListeScreen, CreateUpdateSubExams, ExamsListeScreen, GradeEntryScreen, InviteStudentForCources, MyAbsencesScreen, MyAssignmentScreen, MyCourcesScreen, MyExamsAbsencesScreen, MyTimeTableScreen, NotebookScreen, PastReportCardsScreen, SeeAndMarkStudentAsignmemtScreen, StudentDetailsScreen, StudentListScreen } from 'screens';

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
    MyExamsAbsencesScreen: undefined;
    ExamsListeScreen: undefined;
    CreateUpdateSubExams: undefined;
};
interface Item {
    name: string;
    screen: React.ComponentType<any>;
    haveHeader?: boolean;
}

const elements: Item[] = [
    { name: "MyTimeTableScreen", screen: MyTimeTableScreen, haveHeader: false },
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
    { name: "InviteStudentForCources", screen: InviteStudentForCources, haveHeader: true },
    { name: "AssignmemtRenderStudentListScreen", screen: AssignmemtRenderStudentListScreen, haveHeader: false },
    { name: "SeeAndMarkStudentAsignmemtScreen", screen: SeeAndMarkStudentAsignmemtScreen, haveHeader: false },
    { name: "ExamsListeScreen", screen: ExamsListeScreen, haveHeader: false },
    { name: "MyExamsAbsencesScreen", screen: MyExamsAbsencesScreen, haveHeader: true },
    { name: "AddNewOrUpdateExams", screen: AddNewOrUpdateExams, haveHeader: true },
    { name: "CreateUpdateSubExams", screen: CreateUpdateSubExams, haveHeader: true },
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
