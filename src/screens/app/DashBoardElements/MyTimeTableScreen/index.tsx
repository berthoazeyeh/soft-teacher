import { useEffect, useState } from "react";
import { selectLanguageValue, useCurrentUser, useTheme } from "store";
import moment from "moment";
import MyTimetable from "./Components/MyTimeTable";
import { I18n } from 'i18n';
import { getMondayOfCurrentWeek, showCustomMessage } from "utils";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { getData, LOCAL_URL } from "apis";
import { getSessionsFilter } from "services/SessionsServices";
import { db } from "apis/database";


function MyTimeTableScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom } = route.params
    const theme = useTheme()
    const language = useSelector(selectLanguageValue);
    const user = useCurrentUser();
    const [isLoading, setisLoading] = useState<boolean>(true)
    const [data, setData] = useState<any[]>([])
    useEffect(() => {
        fetchLocalTeacherTimeTablesData()
    }, [navigation])

    const [date, setDate] = useState<Date>(getMondayOfCurrentWeek().toDate());
    // const { data, error: errors, isLoading: load } = useSWR(`${LOCAL_URL}/api/timesheet/faculty/${user?.id}/${classRoom.id}`,
    //     getData,
    //     {
    //         refreshInterval: 100000,
    //         refreshWhenHidden: true,
    //     },
    // );
    async function fetchLocalTeacherTimeTablesData() {
        try {
            setisLoading(true);
            const res0 = await getSessionsFilter(db, user?.id, classRoom?.id ?? undefined);
            if (res0.success && res0.data) {
                setData(res0.data);
                console.log("///....", res0);

            } else {
                showCustomMessage("Information", res0.error, "warning", "bottom")
            }
        } catch (error) {
            showCustomMessage("Information", 'Une erreur s\'est produite :' + error, "warning", "bottom")
        } finally {
            setisLoading(false);
        }
    }


    return (
        <MyTimetable
            navigation={navigation}
            classRoom={classRoom}
            theme={theme}
            date={date}
            data={data}
            isLoading={isLoading}
            language={language}
            I18n={I18n}
        ></MyTimetable>


    );

}

export default MyTimeTableScreen;