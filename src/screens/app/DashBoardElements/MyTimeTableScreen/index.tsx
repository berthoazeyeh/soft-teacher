import { useEffect, useState } from "react";
import { selectLanguageValue, useCurrentUser, useTheme } from "store";
import moment from "moment";
import MyTimetable from "./Components/MyTimeTable";
import { I18n } from 'i18n';
import { getMondayOfCurrentWeek } from "utils";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { getData, LOCAL_URL } from "apis";


function MyTimeTableScreen(props: any): React.JSX.Element {
    const { navigation, route } = props
    const { classRoom } = route.params
    const theme = useTheme()
    const language = useSelector(selectLanguageValue);
    const user = useCurrentUser();

    useEffect(() => {
    }, [])

    const [date, setDate] = useState<Date>(getMondayOfCurrentWeek().toDate());
    const { data, error: errors, isLoading: load } = useSWR(`${LOCAL_URL}/api/timesheet/faculty/${user?.id}/${classRoom.id}`,
        getData,
        {
            refreshInterval: 100000,
            refreshWhenHidden: true,
        },
    );



    return (
        <MyTimetable
            navigation={navigation}
            classRoom={classRoom}
            theme={theme}
            date={date}
            data={data}
            isLoading={load}
            language={language}
            I18n={I18n}
        ></MyTimetable>


    );

}

export default MyTimeTableScreen;